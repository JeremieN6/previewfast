/**
 * Service de gestion des données utilisateur
 * 
 * Stocke et synchronise:
 * - Projets (modifications d'écrans par design)
 * - Presets (configurations réutilisables)
 * - Plan utilisateur
 * - Compteur d'exports
 */

import db from './database.js'

/**
 * Sauvegarder les données complètes de l'utilisateur
 * (utilisé lors de la migration localStorage → cloud)
 */
export function saveUserData(userId, data) {
  try {
    const { projects, presets, plan, exportCount } = data
    
    // Démarrer une transaction
    const saveTransaction = db.transaction(() => {
      // 1. Mettre à jour le plan et le compteur d'exports
      if (plan || exportCount !== undefined) {
        const updates = []
        const params = []
        
        if (plan) {
          updates.push('plan = ?')
          params.push(plan)
        }
        
        if (exportCount !== undefined) {
          updates.push('export_count = ?')
          params.push(exportCount)
        }
        
        updates.push('updated_at = CURRENT_TIMESTAMP')
        params.push(userId)
        
        db.prepare(`
          UPDATE users 
          SET ${updates.join(', ')}
          WHERE id = ?
        `).run(...params)
      }
      
      // 2. Sauvegarder les projets
      if (projects) {
        Object.keys(projects).forEach(designId => {
          const projectData = projects[designId]
          
          // Supprimer l'ancienne version si elle existe
          db.prepare(`
            DELETE FROM user_data 
            WHERE user_id = ? AND data_type = 'project' AND data_key = ?
          `).run(userId, designId)
          
          // Insérer la nouvelle version
          db.prepare(`
            INSERT INTO user_data (user_id, data_type, data_key, data_value)
            VALUES (?, 'project', ?, ?)
          `).run(userId, designId, JSON.stringify(projectData))
        })
      }
      
      // 3. Sauvegarder les presets
      if (presets) {
        Object.keys(presets).forEach(designId => {
          const presetsArray = presets[designId]
          
          // Supprimer l'ancienne version
          db.prepare(`
            DELETE FROM user_data 
            WHERE user_id = ? AND data_type = 'preset' AND data_key = ?
          `).run(userId, designId)
          
          // Insérer la nouvelle version
          db.prepare(`
            INSERT INTO user_data (user_id, data_type, data_key, data_value)
            VALUES (?, 'preset', ?, ?)
          `).run(userId, designId, JSON.stringify(presetsArray))
        })
      }
    })
    
    // Exécuter la transaction
    saveTransaction()
    
    console.log(`[UserData] ✅ Données sauvegardées pour userId: ${userId}`)
    
    return { success: true }
  } catch (error) {
    console.error('[UserData] Erreur lors de la sauvegarde:', error)
    throw error
  }
}

/**
 * Récupérer toutes les données de l'utilisateur
 */
export function getUserData(userId) {
  try {
    // 1. Récupérer les infos utilisateur
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId)
    
    if (!user) {
      throw new Error('Utilisateur introuvable')
    }
    
    // 2. Récupérer tous les projets
    const projectsRows = db.prepare(`
      SELECT data_key, data_value 
      FROM user_data 
      WHERE user_id = ? AND data_type = 'project'
    `).all(userId)
    
    const projects = {}
    projectsRows.forEach(row => {
      projects[row.data_key] = JSON.parse(row.data_value)
    })
    
    // 3. Récupérer tous les presets
    const presetsRows = db.prepare(`
      SELECT data_key, data_value 
      FROM user_data 
      WHERE user_id = ? AND data_type = 'preset'
    `).all(userId)
    
    const presets = {}
    presetsRows.forEach(row => {
      presets[row.data_key] = JSON.parse(row.data_value)
    })
    
    console.log(`[UserData] ✅ Données récupérées pour userId: ${userId}`)
    
    return {
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        exportCount: user.export_count,
        stripeCustomerId: user.stripe_customer_id,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      projects,
      presets
    }
  } catch (error) {
    console.error('[UserData] Erreur lors de la récupération:', error)
    throw error
  }
}

/**
 * Mettre à jour le plan utilisateur
 */
export function updateUserPlan(userId, plan) {
  try {
    if (plan !== 'free' && plan !== 'pro') {
      throw new Error('Plan invalide')
    }
    
    db.prepare(`
      UPDATE users 
      SET plan = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(plan, userId)
    
    console.log(`[UserData] ✅ Plan mis à jour: ${userId} → ${plan}`)
    
    return { success: true, plan }
  } catch (error) {
    console.error('[UserData] Erreur lors de la mise à jour du plan:', error)
    throw error
  }
}

/**
 * Incrémenter le compteur d'exports
 */
export function incrementUserExportCount(userId) {
  try {
    db.prepare(`
      UPDATE users 
      SET export_count = export_count + 1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(userId)
    
    const user = db.prepare('SELECT export_count FROM users WHERE id = ?').get(userId)
    
    console.log(`[UserData] Export count incrémenté: ${userId} → ${user.export_count}`)
    
    return { success: true, exportCount: user.export_count }
  } catch (error) {
    console.error('[UserData] Erreur lors de l\'incrémentation:', error)
    throw error
  }
}
