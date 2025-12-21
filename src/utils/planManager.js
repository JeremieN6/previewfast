/**
 * Gestionnaire de l'état du plan utilisateur
 * 
 * Stockage dans localStorage
 * Pas d'auth, pas de backend (pour l'instant)
 */

const STORAGE_KEY_PLAN = 'previewfaster_user_plan'
const STORAGE_KEY_EXPORTS = 'previewfaster_export_count'

/**
 * Plans disponibles
 */
export const PLAN_FREE = 'free'
export const PLAN_PRO = 'pro'

/**
 * Récupérer le plan actuel de l'utilisateur
 * @returns {string} 'free' ou 'pro'
 */
export function getUserPlan() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PLAN)
    
    if (stored === PLAN_PRO || stored === PLAN_FREE) {
      return stored
    }
    
    // Par défaut : Free
    return PLAN_FREE
  } catch (error) {
    console.error('[PlanManager] Erreur lecture plan:', error)
    return PLAN_FREE
  }
}

/**
 * Définir le plan utilisateur
 * @param {string} plan - 'free' ou 'pro'
 * @returns {boolean} Succès
 */
export function setUserPlan(plan) {
  if (plan !== PLAN_FREE && plan !== PLAN_PRO) {
    console.error('[PlanManager] Plan invalide:', plan)
    return false
  }
  
  try {
    localStorage.setItem(STORAGE_KEY_PLAN, plan)
    console.log(`[PlanManager] ✅ Plan changé: ${plan}`)
    return true
  } catch (error) {
    console.error('[PlanManager] Erreur sauvegarde plan:', error)
    return false
  }
}

/**
 * Vérifier si l'utilisateur est Pro
 * @returns {boolean}
 */
export function isPro() {
  return getUserPlan() === PLAN_PRO
}

/**
 * Vérifier si l'utilisateur est Free
 * @returns {boolean}
 */
export function isFree() {
  return getUserPlan() === PLAN_FREE
}

/**
 * Passer en Pro (mode dev / mock)
 * En production, cela sera fait après paiement Stripe
 * @returns {boolean}
 */
export function upgradeToPro() {
  const success = setUserPlan(PLAN_PRO)
  
  if (success) {
    // Réinitialiser le compteur d'exports
    resetExportCount()
    console.log('[PlanManager] 🎉 Upgrade vers Pro réussi')
  }
  
  return success
}

/**
 * Rétrograder en Free (mode dev uniquement)
 * @returns {boolean}
 */
export function downgradeToFree() {
  return setUserPlan(PLAN_FREE)
}

/**
 * Récupérer le nombre d'exports effectués
 * @returns {number}
 */
export function getExportCount() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_EXPORTS)
    const count = parseInt(stored, 10)
    
    return isNaN(count) ? 0 : count
  } catch (error) {
    console.error('[PlanManager] Erreur lecture compteur exports:', error)
    return 0
  }
}

/**
 * Incrémenter le compteur d'exports
 * @returns {number} Nouveau nombre d'exports
 */
export function incrementExportCount() {
  try {
    const current = getExportCount()
    const newCount = current + 1
    
    localStorage.setItem(STORAGE_KEY_EXPORTS, newCount.toString())
    console.log(`[PlanManager] Export #${newCount}`)
    
    return newCount
  } catch (error) {
    console.error('[PlanManager] Erreur incrémentation exports:', error)
    return getExportCount()
  }
}

/**
 * Réinitialiser le compteur d'exports
 * Utilisé lors de l'upgrade vers Pro
 */
export function resetExportCount() {
  try {
    localStorage.setItem(STORAGE_KEY_EXPORTS, '0')
    console.log('[PlanManager] Compteur exports réinitialisé')
  } catch (error) {
    console.error('[PlanManager] Erreur reset compteur:', error)
  }
}

/**
 * Vérifier si l'utilisateur peut encore exporter
 * @returns {boolean}
 */
export function canExport() {
  // Pro : exports illimités
  if (isPro()) return true
  
  // Free : vérifier la limite
  const count = getExportCount()
  const limit = 5 // Défini dans plans.config.js
  
  return count < limit
}

/**
 * Obtenir le nombre d'exports restants (Free uniquement)
 * @returns {number}
 */
export function getRemainingExports() {
  if (isPro()) return Infinity
  
  const count = getExportCount()
  const limit = 5
  const remaining = limit - count
  
  return Math.max(0, remaining)
}

/**
 * Réinitialiser complètement le plan utilisateur
 * Utilisé pour les tests ou le reset complet
 */
export function resetUserPlan() {
  try {
    localStorage.removeItem(STORAGE_KEY_PLAN)
    localStorage.removeItem(STORAGE_KEY_EXPORTS)
    console.log('[PlanManager] Plan utilisateur réinitialisé')
  } catch (error) {
    console.error('[PlanManager] Erreur reset plan:', error)
  }
}

/**
 * Obtenir les informations complètes du plan
 * @returns {object}
 */
export function getPlanInfo() {
  const plan = getUserPlan()
  const exportCount = getExportCount()
  const remaining = getRemainingExports()
  
  return {
    plan,
    isPro: plan === PLAN_PRO,
    isFree: plan === PLAN_FREE,
    exportCount,
    remainingExports: remaining,
    canExport: canExport()
  }
}
