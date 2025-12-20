/**
 * Module d'export des écrans en images PNG
 * Utilise html-to-image pour capturer le DOM rendu
 */

import { toPng } from 'html-to-image'
import JSZip from 'jszip'

// Options par défaut pour la capture d'image
const DEFAULT_OPTIONS = {
  quality: 1, // Qualité maximale
  pixelRatio: 2, // Résolution × 2 pour écrans HD
  cacheBust: true, // Éviter le cache des images
  skipFonts: false, // Inclure les polices
  includeQueryParams: true // Inclure les query params des URLs
}

/**
 * Exporte un écran unique en PNG
 * @param {string} designId - L'ID du design (ex: "design-1")
 * @param {number|string} screenNum - Le numéro de l'écran (ex: 1, 2, 3...)
 * @returns {Promise<{success: boolean, filename: string}>}
 */
export async function exportScreen(designId, screenNum) {
  console.log(`[Export] Capture de ${designId}, écran ${screenNum}...`)
  
  try {
    // Extraire le numéro du design (ex: "design-1" → "1")
    const designNum = designId.split('-')[1]
    
    // Sélectionner l'écran avec le sélecteur spécifique
    const selector = `.myScreen-design-${designNum}[data-screen="${screenNum}"]`
    const screenElement = document.querySelector(selector)
    
    if (!screenElement) {
      throw new Error(`Écran non trouvé avec le sélecteur: ${selector}`)
    }
    
    // Retirer temporairement les classes 'screen-selected' et 'screen-selectable' 
    // pour éviter la bordure bleue et le voile hover
    const hadSelectedClass = screenElement.classList.contains('screen-selected')
    const hadSelectableClass = screenElement.classList.contains('screen-selectable')
    
    if (hadSelectedClass) {
      screenElement.classList.remove('screen-selected')
    }
    if (hadSelectableClass) {
      screenElement.classList.remove('screen-selectable')
    }
    
    // Petite pause pour que le DOM se mette à jour
    await sleep(50)
    
    // Capturer l'élément en PNG
    const dataUrl = await toPng(screenElement, DEFAULT_OPTIONS)
    
    // Remettre les classes si elles étaient présentes
    if (hadSelectableClass) {
      screenElement.classList.add('screen-selectable')
    }
    if (hadSelectedClass) {
      screenElement.classList.add('screen-selected')
    }
    
    // Télécharger l'image
    const filename = `${designId}_screen-${screenNum}.png`
    downloadImage(dataUrl, filename)
    
    console.log(`[Export] ✅ ${filename} téléchargé`)
    
    return {
      success: true,
      filename
    }
  } catch (error) {
    console.error(`[Export] ❌ Erreur lors de l'export:`, error)
    throw error
  }
}

/**
 * Exporte tous les écrans d'un design en ZIP
 * @param {string} designId - L'ID du design (ex: "design-1")
 * @param {object} designConfig - La configuration du design (contient screens array)
 * @returns {Promise<{success: boolean, filename: string, screenCount: number}>}
 */
export async function exportAllScreens(designId, designConfig) {
  console.log(`[Export] Export de tous les écrans du ${designId}...`)
  
  try {
    const designNum = designId.split('-')[1]
    
    // Récupérer tous les numéros d'écrans depuis la config
    // La structure est : { screens: [ { id: "screen-1", ... }, { id: "screen-2", ... } ] }
    const screenNumbers = (designConfig.screens || [])
      .map(screen => {
        // Extraire le numéro depuis "screen-1", "screen-2", etc.
        const match = screen.id.match(/screen-(\d+)/)
        return match ? parseInt(match[1]) : null
      })
      .filter(num => num !== null)
      .sort((a, b) => a - b)
    
    if (screenNumbers.length === 0) {
      throw new Error('Aucun écran trouvé dans la configuration')
    }
    
    console.log(`[Export] ${screenNumbers.length} écrans à capturer`)
    
    // Créer un ZIP
    const zip = new JSZip()
    const folder = zip.folder(designId)
    
    // Sauvegarder les éléments qui avaient la classe selected
    const selectedElements = []
    
    // Capturer chaque écran
    for (let i = 0; i < screenNumbers.length; i++) {
      const screenNum = screenNumbers[i]
      console.log(`[Export] Capture écran ${i + 1}/${screenNumbers.length} (screen-${screenNum})...`)
      
      const selector = `.myScreen-design-${designNum}[data-screen="${screenNum}"]`
      const screenElement = document.querySelector(selector)
      
      if (!screenElement) {
        console.warn(`[Export] ⚠️ Écran ${screenNum} non trouvé, ignoré`)
        continue
      }
      
      // Retirer temporairement les classes 'screen-selected' et 'screen-selectable'
      // pour éviter la bordure bleue et le voile hover
      const hadSelectedClass = screenElement.classList.contains('screen-selected')
      const hadSelectableClass = screenElement.classList.contains('screen-selectable')
      
      if (hadSelectedClass) {
        screenElement.classList.remove('screen-selected')
      }
      if (hadSelectableClass) {
        screenElement.classList.remove('screen-selectable')
      }
      
      // Stocker pour remettre les classes après
      if (hadSelectedClass || hadSelectableClass) {
        selectedElements.push({ element: screenElement, hadSelected: hadSelectedClass, hadSelectable: hadSelectableClass })
      }
      
      // Petite pause pour que le DOM se mette à jour
      await sleep(50)
      
      // Capturer l'écran
      const dataUrl = await toPng(screenElement, DEFAULT_OPTIONS)
      
      // Convertir dataUrl en blob
      const blob = await dataUrlToBlob(dataUrl)
      
      // Ajouter au ZIP
      folder.file(`screen-${screenNum}.png`, blob)
      
      // Petite pause pour éviter de surcharger le navigateur
      await sleep(100)
    }
    
    // Remettre les classes sur les éléments qui les avaient
    selectedElements.forEach(({ element, hadSelected, hadSelectable }) => {
      if (hadSelectable) {
        element.classList.add('screen-selectable')
      }
      if (hadSelected) {
        element.classList.add('screen-selected')
      }
    })
    
    console.log('[Export] Génération du ZIP...')
    
    // Générer le ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    
    // Télécharger le ZIP
    const filename = `${designId}_all-screens.zip`
    downloadBlob(zipBlob, filename)
    
    console.log(`[Export] ✅ ${filename} téléchargé (${screenNumbers.length} écrans)`)
    
    return {
      success: true,
      filename,
      screenCount: screenNumbers.length
    }
  } catch (error) {
    console.error(`[Export] ❌ Erreur lors de l'export:`, error)
    throw error
  }
}

/**
 * Télécharge une image depuis une dataUrl
 * @param {string} dataUrl - L'URL de l'image en base64
 * @param {string} filename - Le nom du fichier
 */
function downloadImage(dataUrl, filename) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

/**
 * Télécharge un blob
 * @param {Blob} blob - Le blob à télécharger
 * @param {string} filename - Le nom du fichier
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Convertit une dataUrl en Blob
 * @param {string} dataUrl - L'URL de l'image en base64
 * @returns {Promise<Blob>}
 */
async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl)
  return response.blob()
}

/**
 * Pause asynchrone
 * @param {number} ms - Durée en millisecondes
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
