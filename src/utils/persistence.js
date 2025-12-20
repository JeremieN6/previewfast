/**
 * Module de persistance locale pour PreviewFaster
 * 
 * Format de stockage :
 * {
 *   "design-1": {
 *     "screen-1": {
 *       "bg": { type: "background", value: "#111827" },
 *       "title": { type: "text", value: "Mon titre" }
 *     }
 *   }
 * }
 * 
 * Règles :
 * - Seules les modifications utilisateur sont sauvegardées
 * - Chaque design est isolé
 * - Silent fails (pas d'erreurs visibles)
 */

const STORAGE_KEY_PREFIX = 'previewfaster_design_';

/**
 * Sauvegarde l'état d'un design spécifique
 * @param {string} designId - ID du design (ex: "design-1")
 * @param {string} screenId - ID de l'écran (ex: "screen-1")
 * @param {object} modifications - Objet des modifications { zoneId: { type, value } }
 */
export function saveDesignState(designId, screenId, modifications) {
  try {
    // Charger l'état actuel du design
    const currentState = loadDesignState(designId) || {};
    
    // Mettre à jour l'écran spécifique
    if (!currentState[screenId]) {
      currentState[screenId] = {};
    }
    
    // Merger les modifications
    currentState[screenId] = {
      ...currentState[screenId],
      ...modifications
    };
    
    // Sauvegarder dans localStorage
    const key = `${STORAGE_KEY_PREFIX}${designId}`;
    localStorage.setItem(key, JSON.stringify(currentState));
    
    console.log(`[Persistence] Saved ${designId} / ${screenId}:`, modifications);
    
    return true;
  } catch (error) {
    console.warn('[Persistence] Failed to save state:', error);
    return false;
  }
}

/**
 * Charge l'état sauvegardé d'un design
 * @param {string} designId - ID du design (ex: "design-1")
 * @returns {object|null} L'état sauvegardé ou null si aucun
 */
export function loadDesignState(designId) {
  try {
    const key = `${STORAGE_KEY_PREFIX}${designId}`;
    const data = localStorage.getItem(key);
    
    if (!data) {
      console.log(`[Persistence] No saved state for ${designId}`);
      return null;
    }
    
    const state = JSON.parse(data);
    console.log(`[Persistence] Loaded ${designId}:`, state);
    
    return state;
  } catch (error) {
    console.warn('[Persistence] Failed to load state:', error);
    return null;
  }
}

/**
 * Charge l'état d'un écran spécifique
 * @param {string} designId - ID du design
 * @param {string} screenId - ID de l'écran
 * @returns {object|null} Les modifications de l'écran ou null
 */
export function loadScreenState(designId, screenId) {
  try {
    const designState = loadDesignState(designId);
    
    if (!designState || !designState[screenId]) {
      return null;
    }
    
    return designState[screenId];
  } catch (error) {
    console.warn('[Persistence] Failed to load screen state:', error);
    return null;
  }
}

/**
 * Réinitialise l'état d'un design (supprime toutes ses modifications)
 * @param {string} designId - ID du design à réinitialiser
 */
export function resetDesignState(designId) {
  try {
    const key = `${STORAGE_KEY_PREFIX}${designId}`;
    localStorage.removeItem(key);
    
    console.log(`[Persistence] Reset ${designId}`);
    
    return true;
  } catch (error) {
    console.warn('[Persistence] Failed to reset state:', error);
    return false;
  }
}

/**
 * Liste tous les designs ayant un état sauvegardé
 * @returns {string[]} Liste des designIds
 */
export function listSavedDesigns() {
  try {
    const designs = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        designs.push(key.replace(STORAGE_KEY_PREFIX, ''));
      }
    }
    
    return designs;
  } catch (error) {
    console.warn('[Persistence] Failed to list designs:', error);
    return [];
  }
}

/**
 * Réinitialise tous les designs (nettoyage complet)
 */
export function resetAllDesigns() {
  try {
    const designs = listSavedDesigns();
    
    designs.forEach(designId => {
      resetDesignState(designId);
    });
    
    console.log('[Persistence] Reset all designs');
    
    return true;
  } catch (error) {
    console.warn('[Persistence] Failed to reset all:', error);
    return false;
  }
}

/**
 * Obtient la taille totale du stockage
 * @returns {number} Taille en octets
 */
export function getStorageSize() {
  try {
    let size = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const value = localStorage.getItem(key);
        size += key.length + (value ? value.length : 0);
      }
    }
    
    return size;
  } catch (error) {
    console.warn('[Persistence] Failed to calculate size:', error);
    return 0;
  }
}
