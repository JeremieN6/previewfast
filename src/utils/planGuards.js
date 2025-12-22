/**
 * 🛡️ PLAN GUARDS - SOURCE UNIQUE DE VÉRITÉ
 * 
 * Module centralisé pour toutes les règles FREE/PRO
 * ⚠️ AUCUNE règle ne doit être définie ailleurs !
 */

import { getUserPlan, isPro, isFree, canExport, getRemainingExports } from './planManager.js'
import toast from './toast.js'

/**
 * 📋 DÉFINITION DES RÈGLES PAR PLAN
 * Source unique de vérité - NE PAS DUPLIQUER
 */
export const PLAN_RULES = {
  free: {
    // Projets
    maxProjects: 1,
    projectName: 'Projet unique',
    
    // Écrans
    maxScreensPerDesign: 5,
    canAddScreen: false,
    
    // Édition
    canEditAllScreens: false, // Édition écran par écran uniquement
    canDuplicateScreens: false,
    canApplyToAll: false,
    
    // Presets
    canCreatePresets: true,
    canUseDesignPresets: false, // Limité aux presets écran
    maxPresets: 5,
    
    // Export
    canExport: true,
    maxExports: 5,
    exportQuality: 'standard',
    exportHasWatermark: true,
    exportHD: false,
    
    // Features
    features: {
      duplication: false,
      applyToAll: false,
      designPresets: false,
      unlimitedExports: false,
      hdExport: false,
      noWatermark: false
    }
  },
  
  pro: {
    // Projets
    maxProjects: Infinity,
    projectName: 'Projets illimités',
    
    // Écrans
    maxScreensPerDesign: 10,
    canAddScreen: true,
    
    // Édition
    canEditAllScreens: true,
    canDuplicateScreens: true,
    canApplyToAll: true,
    
    // Presets
    canCreatePresets: true,
    canUseDesignPresets: true,
    maxPresets: Infinity,
    
    // Export
    canExport: true,
    maxExports: Infinity,
    exportQuality: 'hd',
    exportHasWatermark: false,
    exportHD: true,
    
    // Features
    features: {
      duplication: true,
      applyToAll: true,
      designPresets: true,
      unlimitedExports: true,
      hdExport: true,
      noWatermark: true
    }
  }
}

/**
 * 🔍 Obtenir les règles du plan actuel
 * @returns {Object} Règles du plan
 */
export function getCurrentPlanRules() {
  const plan = getUserPlan()
  return PLAN_RULES[plan] || PLAN_RULES.free
}

/**
 * 🔍 Vérifier si une fonctionnalité est disponible
 * @param {string} feature - Nom de la fonctionnalité
 * @returns {boolean}
 */
export function hasFeature(feature) {
  const rules = getCurrentPlanRules()
  return rules.features[feature] === true
}

/**
 * 🛡️ GUARDS FONCTIONNELS
 * Vérifient si une action est autorisée + affichent un toast si bloqué
 */

/**
 * Guard : Duplication d'écran
 * @param {boolean} showToast - Afficher un toast si bloqué
 * @returns {boolean} true si autorisé
 */
export function canDuplicateScreen(showToast = true) {
  const rules = getCurrentPlanRules()
  
  if (!rules.canDuplicateScreens) {
    if (showToast) {
      toast.warning('🔒 Fonctionnalité PRO : Duplication d\'écrans', {
        action: 'Passer PRO',
        onAction: () => {
          // Émettre un événement pour ouvrir la modal upgrade
          window.dispatchEvent(new CustomEvent('open-upgrade-modal', { 
            detail: { feature: 'duplicateScreens' } 
          }))
        }
      })
    }
    return false
  }
  
  return true
}

/**
 * Guard : Application globale des modifications
 * @param {boolean} showToast - Afficher un toast si bloqué
 * @returns {boolean} true si autorisé
 */
export function canApplyToAllScreens(showToast = true) {
  const rules = getCurrentPlanRules()
  
  if (!rules.canApplyToAll) {
    if (showToast) {
      toast.warning('🔒 Fonctionnalité PRO : Application globale', {
        action: 'Passer PRO',
        onAction: () => {
          window.dispatchEvent(new CustomEvent('open-upgrade-modal', { 
            detail: { feature: 'applyToAll' } 
          }))
        }
      })
    }
    return false
  }
  
  return true
}

/**
 * Guard : Création de preset design
 * @param {boolean} showToast - Afficher un toast si bloqué
 * @returns {boolean} true si autorisé
 */
export function canCreateDesignPreset(showToast = true) {
  const rules = getCurrentPlanRules()
  
  if (!rules.canUseDesignPresets) {
    if (showToast) {
      toast.warning('🔒 Fonctionnalité PRO : Presets design', {
        action: 'Passer PRO',
        onAction: () => {
          window.dispatchEvent(new CustomEvent('open-upgrade-modal', { 
            detail: { feature: 'designPresets' } 
          }))
        }
      })
    }
    return false
  }
  
  return true
}

/**
 * Guard : Ajout d'écran
 * @param {number} currentScreenCount - Nombre d'écrans actuels
 * @param {boolean} showToast - Afficher un toast si bloqué
 * @returns {boolean} true si autorisé
 */
export function canAddScreen(currentScreenCount, showToast = true) {
  const rules = getCurrentPlanRules()
  
  if (currentScreenCount >= rules.maxScreensPerDesign) {
    if (showToast) {
      const message = isPro() 
        ? `Limite atteinte : ${rules.maxScreensPerDesign} écrans maximum`
        : `🔒 Limite FREE atteinte : ${rules.maxScreensPerDesign} écrans maximum`
      
      toast.warning(message, isPro() ? {} : {
        action: 'Passer PRO',
        onAction: () => {
          window.dispatchEvent(new CustomEvent('open-upgrade-modal', { 
            detail: { feature: 'addScreen' } 
          }))
        }
      })
    }
    return false
  }
  
  return true
}

/**
 * Guard : Export
 * @param {boolean} showToast - Afficher un toast si bloqué
 * @returns {boolean} true si autorisé
 */
export function canPerformExport(showToast = true) {
  if (!canExport()) {
    if (showToast) {
      const remaining = getRemainingExports()
      toast.error('🚫 Limite d\'exports atteinte (5/5)', {
        action: 'Passer PRO',
        onAction: () => {
          window.dispatchEvent(new CustomEvent('open-upgrade-modal', { 
            detail: { feature: 'exportLimit' } 
          }))
        }
      })
    }
    return false
  }
  
  return true
}

/**
 * Guard : Nombre de presets
 * @param {number} currentPresetCount - Nombre de presets actuels
 * @param {boolean} showToast - Afficher un toast si bloqué
 * @returns {boolean} true si autorisé
 */
export function canCreatePreset(currentPresetCount, showToast = true) {
  const rules = getCurrentPlanRules()
  
  if (currentPresetCount >= rules.maxPresets) {
    if (showToast) {
      toast.warning(`🔒 Limite atteinte : ${rules.maxPresets} presets maximum en FREE`, {
        action: 'Passer PRO',
        onAction: () => {
          window.dispatchEvent(new CustomEvent('open-upgrade-modal', { 
            detail: { feature: 'presets' } 
          }))
        }
      })
    }
    return false
  }
  
  return true
}

/**
 * 🎨 HELPERS POUR L'UI
 * Déterminent l'affichage des éléments visuels
 */

/**
 * Obtenir le badge à afficher pour une fonctionnalité
 * @param {string} feature - Nom de la fonctionnalité
 * @returns {string|null} Texte du badge ou null
 */
export function getFeatureBadge(feature) {
  if (isPro()) return null
  
  const needsPro = !hasFeature(feature)
  return needsPro ? 'PRO' : null
}

/**
 * Vérifier si un bouton doit être désactivé
 * @param {string} feature - Nom de la fonctionnalité
 * @returns {boolean} true si désactivé
 */
export function isFeatureDisabled(feature) {
  return !hasFeature(feature)
}

/**
 * Obtenir le tooltip pour une fonctionnalité
 * @param {string} feature - Nom de la fonctionnalité
 * @returns {string} Texte du tooltip
 */
export function getFeatureTooltip(feature) {
  if (isPro()) return ''
  
  const tooltips = {
    duplication: 'Dupliquer des écrans (PRO)',
    applyToAll: 'Appliquer à tous les écrans (PRO)',
    designPresets: 'Créer des presets design (PRO)',
    unlimitedExports: 'Exports illimités (PRO)',
    hdExport: 'Export en qualité HD (PRO)',
    noWatermark: 'Export sans watermark (PRO)'
  }
  
  return tooltips[feature] || 'Fonctionnalité PRO'
}

/**
 * 📊 INFORMATIONS POUR L'AFFICHAGE
 */

/**
 * Obtenir un résumé du plan actuel
 * @returns {Object} Résumé du plan
 */
export function getPlanSummary() {
  const plan = getUserPlan()
  const rules = getCurrentPlanRules()
  const remaining = isFree() ? getRemainingExports() : null
  
  return {
    plan,
    isPro: isPro(),
    isFree: isFree(),
    
    // Limites
    maxScreens: rules.maxScreensPerDesign,
    maxExports: rules.maxExports,
    maxPresets: rules.maxPresets,
    
    // Compteurs
    exportsRemaining: remaining,
    
    // Features disponibles
    features: rules.features,
    
    // Messages
    planName: plan === 'pro' ? 'PRO' : 'GRATUIT',
    planEmoji: plan === 'pro' ? '💎' : '🆓'
  }
}

/**
 * 🔄 GESTION DES ÉTATS UTILISATEUR
 */

/**
 * Vérifier l'état de l'abonnement
 * @param {Object} user - Données utilisateur
 * @returns {string} État de l'abonnement
 */
export function getUserSubscriptionState(user) {
  if (!user) return 'guest' // Non connecté
  
  if (user.plan === 'pro') {
    // Vérifier si l'abonnement est actif
    if (user.subscriptionStatus === 'active') {
      return 'pro_active'
    }
    
    // Abonnement en période de fin
    if (user.currentPeriodEnd) {
      const endDate = new Date(user.currentPeriodEnd)
      const now = new Date()
      
      if (endDate > now) {
        return 'pro_ending' // Toujours actif mais va expirer
      } else {
        return 'pro_expired' // Expiré, doit repasser en FREE
      }
    }
    
    return 'pro_inactive' // PRO mais pas d'abonnement valide
  }
  
  return 'free' // Plan gratuit
}

/**
 * Obtenir le message d'état de l'abonnement
 * @param {string} state - État de l'abonnement
 * @returns {string} Message
 */
export function getSubscriptionStateMessage(state) {
  const messages = {
    guest: 'Non connecté',
    free: 'Plan Gratuit',
    pro_active: 'PRO Actif',
    pro_ending: 'PRO - Expire bientôt',
    pro_expired: 'PRO Expiré - Renouveler',
    pro_inactive: 'PRO Inactif'
  }
  
  return messages[state] || 'Inconnu'
}

export default {
  // Règles
  PLAN_RULES,
  getCurrentPlanRules,
  hasFeature,
  
  // Guards fonctionnels
  canDuplicateScreen,
  canApplyToAllScreens,
  canCreateDesignPreset,
  canAddScreen,
  canPerformExport,
  canCreatePreset,
  
  // Helpers UI
  getFeatureBadge,
  isFeatureDisabled,
  getFeatureTooltip,
  
  // Informations
  getPlanSummary,
  
  // États utilisateur
  getUserSubscriptionState,
  getSubscriptionStateMessage
}
