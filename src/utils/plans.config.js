/**
 * Configuration centralisée des plans Free / Pro
 * 
 * Ce fichier définit TOUTES les règles business et limitations
 * Toute modification de feature doit passer par ici
 */

export const PLANS_CONFIG = {
  free: {
    // Nom affiché
    displayName: 'Free',
    
    // Limitations projets & écrans
    maxProjects: 1,        // Nombre de designs modifiables en parallèle
    maxScreens: 5,         // Nombre d'écrans modifiables par design
    
    // Limitations exports
    maxExports: 5,         // Nombre total d'exports autorisés
    exportHD: false,       // Exports en qualité réduite (pixelRatio: 1 au lieu de 2)
    watermark: true,       // Watermark "Made with PreviewFaster" sur les exports
    
    // Fonctionnalités de productivité
    canDuplicateScreens: false,      // Bloquer la duplication d'écrans
    canApplyGlobalChanges: false,    // Bloquer "Appliquer à tous"
    canUseScreenPresets: true,       // Autoriser les presets d'écran uniquement
    canUseDesignPresets: false,      // Bloquer les presets design-wide
    
    // Features avancées (pour plus tard)
    canExportZIP: false,             // Export ZIP désactivé
    canImportPresets: false,         // Import/Export de presets bloqué
    canUseTemplates: false,          // Templates communautaires bloqués
    
    // Limites de stockage
    maxPresetsPerDesign: 3,          // Maximum 3 presets par design
    maxModificationsPerScreen: Infinity, // Pas de limite sur les modifs
  },
  
  pro: {
    // Nom affiché
    displayName: 'Pro',
    
    // Limitations projets & écrans
    maxProjects: Infinity,  // Illimité (sera limité en Module 9 avec backend)
    maxScreens: 10,         // 10 écrans modifiables par design
    
    // Limitations exports
    maxExports: Infinity,   // Exports illimités
    exportHD: true,         // Exports haute qualité (pixelRatio: 2)
    watermark: false,       // Pas de watermark
    
    // Fonctionnalités de productivité
    canDuplicateScreens: true,       // Duplication autorisée
    canApplyGlobalChanges: true,     // "Appliquer à tous" activé
    canUseScreenPresets: true,       // Presets d'écran autorisés
    canUseDesignPresets: true,       // Presets design-wide autorisés
    
    // Features avancées
    canExportZIP: true,              // Export ZIP activé
    canImportPresets: true,          // Import/Export de presets activé
    canUseTemplates: true,           // Accès aux templates communautaires
    
    // Limites de stockage
    maxPresetsPerDesign: Infinity,   // Presets illimités
    maxModificationsPerScreen: Infinity,
  }
}

/**
 * Messages d'upgrade affichés aux utilisateurs Free
 */
export const UPGRADE_MESSAGES = {
  duplicateScreens: {
    title: '🔒 Fonctionnalité Pro',
    message: 'La duplication d\'écrans est réservée aux utilisateurs Pro.',
    benefits: [
      'Dupliquer vos écrans en un clic',
      'Gagner du temps sur les setups répétitifs',
      'Copier les configurations entre écrans'
    ]
  },
  
  applyGlobalChanges: {
    title: '🔒 Fonctionnalité Pro',
    message: 'L\'application globale des changements est réservée aux utilisateurs Pro.',
    benefits: [
      'Appliquer vos modifications à tous les écrans',
      'Maintenir la cohérence de vos designs',
      'Modifier 5 écrans en une seule action'
    ]
  },
  
  designPresets: {
    title: '🔒 Fonctionnalité Pro',
    message: 'Les presets de design complet sont réservés aux utilisateurs Pro.',
    benefits: [
      'Sauvegarder des configurations pour tout le design',
      'Réutiliser vos setups sur tous les écrans',
      'Créer des templates personnalisés'
    ]
  },
  
  exportLimit: {
    title: '🔒 Limite d\'exports atteinte',
    message: 'Vous avez atteint la limite de 5 exports gratuits.',
    benefits: [
      'Exports illimités',
      'Qualité HD (haute résolution)',
      'Pas de watermark'
    ]
  },
  
  exportZIP: {
    title: '🔒 Export ZIP Pro',
    message: 'L\'export ZIP de tous les écrans est réservé aux utilisateurs Pro.',
    benefits: [
      'Exporter tous vos écrans en un clic',
      'Format ZIP prêt pour l\'App Store',
      'Gain de temps considérable'
    ]
  },
  
  hdExport: {
    title: '💎 Export HD',
    message: 'Les exports en haute définition sont réservés aux utilisateurs Pro.',
    benefits: [
      'Résolution 2x (Retina)',
      'Qualité optimale pour l\'App Store',
      'Images ultra-nettes'
    ]
  }
}

/**
 * Prix des plans (pour affichage UI)
 * Sera connecté à Stripe au Module 9
 */
export const PLANS_PRICING = {
  free: {
    price: 0,
    currency: '€',
    period: 'forever',
    label: 'Gratuit'
  },
  
  pro: {
    price: 9,
    currency: '€',
    period: 'month',
    label: '9€/mois'
  }
}

/**
 * Helper pour vérifier si un plan a accès à une fonctionnalité
 */
export function canAccess(userPlan, feature) {
  const plan = PLANS_CONFIG[userPlan] || PLANS_CONFIG.free
  return plan[feature] || false
}

/**
 * Helper pour obtenir la limite d'une ressource
 */
export function getLimit(userPlan, resource) {
  const plan = PLANS_CONFIG[userPlan] || PLANS_CONFIG.free
  return plan[resource] || 0
}

/**
 * Helper pour vérifier si un utilisateur a atteint une limite
 */
export function hasReachedLimit(userPlan, resource, currentCount) {
  const limit = getLimit(userPlan, resource)
  
  if (limit === Infinity) return false
  
  return currentCount >= limit
}
