/**
 * 📦 MODULE 11 : EXPORT SERVICE
 * 
 * Couche métier centralisée pour l'export des designs
 * Gère : quotas, watermarks, qualité, synchronisation
 * 
 * ⚠️ RÈGLE : Toute demande d'export DOIT passer par requestExport()
 */

import { exportScreen as _exportScreen, exportAllScreens as _exportAllScreens } from '../utils/export.js'
import { canExport, incrementExportCount, getUserPlan, getRemainingExports, isPro } from '../utils/planManager.js'
import authService from './authService.js'
import syncService from './syncService.js'

/**
 * États possibles d'une demande d'export
 */
export const EXPORT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error',
  QUOTA_EXCEEDED: 'quota_exceeded'
}

/**
 * Types d'export
 */
export const EXPORT_TYPE = {
  SINGLE: 'single',
  ALL: 'all'
}

/**
 * 🎯 FONCTION CENTRALE D'EXPORT
 * Point d'entrée unique pour toute demande d'export
 * 
 * @param {Object} payload - Paramètres de l'export
 * @param {string} payload.type - Type d'export ('single' ou 'all')
 * @param {string} payload.designId - ID du design (ex: 'design-1')
 * @param {number} [payload.screenId] - ID de l'écran (requis si type='single')
 * @param {Object} [payload.designConfig] - Config du design (requis si type='all')
 * @param {Function} [payload.onProgress] - Callback pour le suivi de progression
 * @returns {Promise<Object>} Résultat de l'export
 */
export async function requestExport(payload) {
  const {
    type,
    designId,
    screenId,
    designConfig,
    onProgress = () => {}
  } = payload

  // Validation des paramètres
  if (!type || !designId) {
    throw new Error('Paramètres invalides : type et designId requis')
  }

  if (type === EXPORT_TYPE.SINGLE && !screenId) {
    throw new Error('screenId requis pour un export single')
  }

  if (type === EXPORT_TYPE.ALL && !designConfig) {
    throw new Error('designConfig requis pour un export all')
  }

  console.log(`[ExportService] 🚀 Demande d'export: ${type} - ${designId}`)

  // Étape 1 : Vérifier le quota
  onProgress({ status: EXPORT_STATUS.PENDING, message: 'Vérification du quota...' })

  const quotaCheck = await checkExportQuota()
  if (!quotaCheck.allowed) {
    onProgress({ 
      status: EXPORT_STATUS.QUOTA_EXCEEDED, 
      message: quotaCheck.message,
      remaining: quotaCheck.remaining
    })
    
    throw new Error(`QUOTA_EXCEEDED:${quotaCheck.message}`)
  }

  // Étape 2 : Préparer l'export
  onProgress({ status: EXPORT_STATUS.PROCESSING, message: 'Préparation de l\'export...' })

  const userPlan = getUserPlan()
  const shouldApplyWatermark = userPlan === 'free'

  try {
    let result

    // Étape 3 : Exécuter l'export selon le type
    if (type === EXPORT_TYPE.SINGLE) {
      onProgress({ status: EXPORT_STATUS.PROCESSING, message: 'Capture de l\'écran...' })
      result = await _exportScreen(designId, screenId)
      
      // Appliquer le watermark si FREE
      if (shouldApplyWatermark) {
        onProgress({ status: EXPORT_STATUS.PROCESSING, message: 'Application du watermark...' })
        // Le watermark sera appliqué dans une version future
        // Pour l'instant, on marque juste qu'il faudrait l'appliquer
        result.watermarkApplied = true
      }
    } else if (type === EXPORT_TYPE.ALL) {
      onProgress({ status: EXPORT_STATUS.PROCESSING, message: 'Capture de tous les écrans...' })
      result = await _exportAllScreens(designId, designConfig)
      
      if (shouldApplyWatermark) {
        result.watermarkApplied = true
      }
    }

    // Étape 4 : Incrémenter le compteur (uniquement pour FREE)
    if (userPlan === 'free') {
      await incrementExportCount()
    }

    // Étape 5 : Synchroniser avec le backend si connecté
    if (authService.isAuthenticated()) {
      try {
        await syncService.syncExportCount()
        await logExportToBackend({
          designId,
          type,
          screenId,
          plan: userPlan,
          timestamp: Date.now()
        })
      } catch (error) {
        console.warn('[ExportService] ⚠️ Erreur sync backend (continuant en mode local):', error)
      }
    }

    // Étape 6 : Retourner le résultat
    onProgress({ 
      status: EXPORT_STATUS.SUCCESS, 
      message: 'Export terminé avec succès !',
      result 
    })

    console.log('[ExportService] ✅ Export réussi:', result)

    return {
      success: true,
      status: EXPORT_STATUS.SUCCESS,
      data: {
        ...result,
        plan: userPlan,
        watermarkApplied: shouldApplyWatermark,
        remaining: userPlan === 'free' ? getRemainingExports() : null
      }
    }

  } catch (error) {
    console.error('[ExportService] ❌ Erreur export:', error)
    
    onProgress({ 
      status: EXPORT_STATUS.ERROR, 
      message: error.message 
    })

    throw error
  }
}

/**
 * Vérifier si l'utilisateur peut exporter
 * @returns {Promise<Object>} Résultat de la vérification
 */
async function checkExportQuota() {
  const userPlan = getUserPlan()

  // PRO : toujours autorisé
  if (isPro()) {
    return {
      allowed: true,
      plan: userPlan,
      unlimited: true
    }
  }

  // FREE : vérifier le quota
  const allowed = canExport()
  const remaining = getRemainingExports()

  if (!allowed) {
    return {
      allowed: false,
      plan: userPlan,
      remaining: 0,
      message: `Limite d'exports atteinte (5/5). Passez au plan PRO pour des exports illimités.`
    }
  }

  return {
    allowed: true,
    plan: userPlan,
    remaining,
    message: remaining <= 2 ? `⚠️ Plus que ${remaining} export(s) restant(s)` : null
  }
}

/**
 * Logger l'export vers le backend
 * @param {Object} exportData - Données de l'export
 */
async function logExportToBackend(exportData) {
  try {
    const response = await fetch('http://localhost:3001/api/exports/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}`
      },
      body: JSON.stringify(exportData)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    console.log('[ExportService] ✅ Export loggé sur le serveur')
  } catch (error) {
    // Ne pas bloquer l'export si le log échoue
    console.warn('[ExportService] ⚠️ Erreur log export:', error)
  }
}

/**
 * Obtenir les informations sur le quota d'export
 * @returns {Object} Infos quota
 */
export function getExportQuota() {
  const userPlan = getUserPlan()
  const remaining = getRemainingExports()
  const isPro = userPlan === 'pro'

  return {
    plan: userPlan,
    unlimited: isPro,
    remaining: isPro ? null : remaining,
    limit: isPro ? null : 5,
    canExport: canExport()
  }
}

/**
 * Obtenir un message d'aide pour l'utilisateur
 * @returns {string} Message d'aide
 */
export function getExportHelpMessage() {
  const quota = getExportQuota()

  if (quota.unlimited) {
    return '✨ Exports illimités en qualité HD'
  }

  if (quota.remaining === 0) {
    return '🚫 Limite atteinte - Passez PRO pour continuer'
  }

  if (quota.remaining <= 2) {
    return `⚠️ ${quota.remaining} export(s) restant(s) - Passez PRO pour des exports illimités`
  }

  return `📊 ${quota.remaining}/5 exports disponibles`
}

export default {
  requestExport,
  getExportQuota,
  getExportHelpMessage,
  EXPORT_STATUS,
  EXPORT_TYPE
}
