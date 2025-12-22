/**
 * Module de gestion des presets
 * Sauvegarde/chargement de configurations réutilisables
 */

const STORAGE_KEY = 'previewfaster_presets'

/**
 * Générer un ID unique pour un preset
 * @returns {string}
 */
function generatePresetId() {
  return `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Récupérer tous les presets depuis localStorage
 * @returns {Object} Structure: { "design-1": [...], "design-2": [...] }
 */
export function getAllPresets() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('[Presets] Erreur lors de la lecture:', error)
    return {}
  }
}

/**
 * Récupérer les presets d'un design spécifique
 * @param {string} designId - L'ID du design (ex: "design-1")
 * @returns {Array} Liste des presets
 */
export function getDesignPresets(designId) {
  const allPresets = getAllPresets()
  return allPresets[designId] || []
}

/**
 * Sauvegarder un nouveau preset
 * @param {string} designId - L'ID du design
 * @param {string} name - Nom du preset
 * @param {string} scope - "screen" ou "design"
 * @param {Object} values - Les valeurs à sauvegarder
 * @param {number|null} screenNum - Numéro de l'écran (si scope="screen")
 * @returns {Object} Le preset créé
 */
export function savePreset(designId, name, scope, values, screenNum = null) {
  try {
    const allPresets = getAllPresets()
    
    // Initialiser le tableau si nécessaire
    if (!allPresets[designId]) {
      allPresets[designId] = []
    }
    
    // Créer le preset
    const preset = {
      id: generatePresetId(),
      name: name.trim(),
      designId,
      scope, // "screen" ou "design"
      screenNum: scope === 'screen' ? screenNum : null,
      values,
      createdAt: new Date().toISOString()
    }
    
    // Ajouter au début du tableau (plus récent en premier)
    allPresets[designId].unshift(preset)
    
    // Sauvegarder
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPresets))
    
    console.log(`✅ Preset "${name}" sauvegardé pour ${designId}`)
    
    return preset
  } catch (error) {
    console.error('[Presets] Erreur lors de la sauvegarde:', error)
    throw error
  }
}

/**
 * Supprimer un preset
 * @param {string} designId - L'ID du design
 * @param {string} presetId - L'ID du preset à supprimer
 * @returns {boolean} Succès
 */
export function deletePreset(designId, presetId) {
  try {
    const allPresets = getAllPresets()
    
    if (!allPresets[designId]) {
      return false
    }
    
    // Filtrer pour retirer le preset
    allPresets[designId] = allPresets[designId].filter(p => p.id !== presetId)
    
    // Sauvegarder
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPresets))
    
    console.log(`✅ Preset ${presetId} supprimé`)
    
    return true
  } catch (error) {
    console.error('[Presets] Erreur lors de la suppression:', error)
    return false
  }
}

/**
 * Récupérer un preset spécifique
 * @param {string} designId - L'ID du design
 * @param {string} presetId - L'ID du preset
 * @returns {Object|null} Le preset ou null
 */
export function getPreset(designId, presetId) {
  const presets = getDesignPresets(designId)
  return presets.find(p => p.id === presetId) || null
}

/**
 * Mettre à jour un preset existant
 * @param {string} designId - L'ID du design
 * @param {string} presetId - L'ID du preset
 * @param {Object} updates - Les modifications (name, values, etc.)
 * @returns {Object|null} Le preset mis à jour ou null
 */
export function updatePreset(designId, presetId, updates) {
  try {
    const allPresets = getAllPresets()
    
    if (!allPresets[designId]) {
      return null
    }
    
    const presetIndex = allPresets[designId].findIndex(p => p.id === presetId)
    
    if (presetIndex === -1) {
      return null
    }
    
    // Mettre à jour
    allPresets[designId][presetIndex] = {
      ...allPresets[designId][presetIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    // Sauvegarder
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPresets))
    
    console.log(`✅ Preset ${presetId} mis à jour`)
    
    return allPresets[designId][presetIndex]
  } catch (error) {
    console.error('[Presets] Erreur lors de la mise à jour:', error)
    return null
  }
}

/**
 * Supprimer tous les presets d'un design
 * @param {string} designId - L'ID du design
 * @returns {boolean} Succès
 */
export function clearDesignPresets(designId) {
  try {
    const allPresets = getAllPresets()
    
    if (allPresets[designId]) {
      delete allPresets[designId]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allPresets))
      console.log(`✅ Tous les presets de ${designId} supprimés`)
    }
    
    return true
  } catch (error) {
    console.error('[Presets] Erreur lors du nettoyage:', error)
    return false
  }
}

/**
 * Exporter les presets en JSON (pour sauvegarde externe)
 * @param {string|null} designId - Design spécifique ou null pour tout exporter
 * @returns {string} JSON string
 */
export function exportPresets(designId = null) {
  const allPresets = getAllPresets()
  const data = designId ? { [designId]: allPresets[designId] || [] } : allPresets
  return JSON.stringify(data, null, 2)
}

/**
 * Importer des presets depuis JSON
 * @param {string} jsonString - JSON string des presets
 * @param {boolean} merge - Fusionner avec existants ou remplacer
 * @returns {boolean} Succès
 */
export function importPresets(jsonString, merge = true) {
  try {
    const importedData = JSON.parse(jsonString)
    
    if (merge) {
      const existingData = getAllPresets()
      
      // Fusionner
      Object.keys(importedData).forEach(designId => {
        if (!existingData[designId]) {
          existingData[designId] = []
        }
        existingData[designId].push(...importedData[designId])
      })
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData))
    } else {
      // Remplacer complètement
      localStorage.setItem(STORAGE_KEY, JSON.stringify(importedData))
    }
    
    console.log('✅ Presets importés avec succès')
    return true
  } catch (error) {
    console.error('[Presets] Erreur lors de l\'importation:', error)
    return false
  }
}

/**
 * Sauvegarder tous les presets (utilisé pour sync cloud)
 * @param {Object} presetsData - Structure complète des presets { "design-1": [...], ... }
 * @returns {boolean} Succès
 */
export function saveAllPresets(presetsData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presetsData))
    console.log('[Presets] Tous les presets sauvegardés')
    return true
  } catch (error) {
    console.error('[Presets] Erreur lors de la sauvegarde globale:', error)
    return false
  }
}
