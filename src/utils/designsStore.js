/**
 * Store centralisé pour les designs
 * Bridge entre persistence.js (localStorage) et syncService.js (cloud)
 */

const STORAGE_KEY_PREFIX = 'previewfaster_design_';

/**
 * Récupérer tous les designs depuis localStorage
 * Format retourné : { "design-1": {...}, "design-2": {...}, ... }
 * @returns {object}
 */
export function getDesigns() {
  const designs = {};
  
  try {
    // Parcourir toutes les clés localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Filtrer uniquement les clés de designs
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const designId = key.replace(STORAGE_KEY_PREFIX, '');
        const data = localStorage.getItem(key);
        
        if (data) {
          designs[designId] = JSON.parse(data);
        }
      }
    }
    
    return designs;
  } catch (error) {
    console.error('[DesignsStore] Erreur lors du chargement des designs:', error);
    return {};
  }
}

/**
 * Sauvegarder tous les designs dans localStorage
 * Format attendu : { "design-1": {...}, "design-2": {...}, ... }
 * @param {object} designs - Objet contenant tous les designs
 * @returns {boolean}
 */
export function saveDesigns(designs) {
  try {
    // D'abord, supprimer tous les anciens designs
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Puis sauvegarder les nouveaux designs
    Object.entries(designs).forEach(([designId, designData]) => {
      const key = `${STORAGE_KEY_PREFIX}${designId}`;
      localStorage.setItem(key, JSON.stringify(designData));
    });
    
    console.log(`[DesignsStore] Sauvegardé ${Object.keys(designs).length} designs`);
    return true;
  } catch (error) {
    console.error('[DesignsStore] Erreur lors de la sauvegarde des designs:', error);
    return false;
  }
}

/**
 * Récupérer un design spécifique
 * @param {string} designId - ID du design (ex: "design-1")
 * @returns {object|null}
 */
export function getDesign(designId) {
  try {
    const key = `${STORAGE_KEY_PREFIX}${designId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`[DesignsStore] Erreur lors du chargement de ${designId}:`, error);
    return null;
  }
}

/**
 * Sauvegarder un design spécifique
 * @param {string} designId - ID du design (ex: "design-1")
 * @param {object} designData - Données du design
 * @returns {boolean}
 */
export function saveDesign(designId, designData) {
  try {
    const key = `${STORAGE_KEY_PREFIX}${designId}`;
    localStorage.setItem(key, JSON.stringify(designData));
    console.log(`[DesignsStore] Sauvegardé ${designId}`);
    return true;
  } catch (error) {
    console.error(`[DesignsStore] Erreur lors de la sauvegarde de ${designId}:`, error);
    return false;
  }
}

/**
 * Supprimer tous les designs
 * @returns {boolean}
 */
export function clearAllDesigns() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`[DesignsStore] Supprimé ${keysToRemove.length} designs`);
    return true;
  } catch (error) {
    console.error('[DesignsStore] Erreur lors de la suppression des designs:', error);
    return false;
  }
}
