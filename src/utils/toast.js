/**
 * 🔔 SYSTÈME DE TOASTS
 * Remplace les alert() natifs par des toasts Flowbite élégants
 */

let toastContainer = null

/**
 * Types de toasts disponibles
 */
export const TOAST_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

/**
 * Initialiser le conteneur de toasts
 * À appeler au montage de l'app
 */
export function initToastContainer() {
  if (toastContainer) return

  toastContainer = document.createElement('div')
  toastContainer.id = 'toast-container'
  toastContainer.className = 'fixed top-5 right-5 z-[9999] flex flex-col gap-2'
  document.body.appendChild(toastContainer)
}

/**
 * Afficher un toast
 * @param {Object} options - Options du toast
 * @param {string} options.message - Message à afficher
 * @param {string} options.type - Type de toast (success, error, warning, info)
 * @param {number} options.duration - Durée en ms (défaut: 4000)
 * @param {string} options.action - Texte du bouton d'action
 * @param {Function} options.onAction - Callback du bouton d'action
 */
export function showToast({
  message,
  type = TOAST_TYPE.INFO,
  duration = 4000,
  action = null,
  onAction = null
}) {
  // Initialiser le conteneur si nécessaire
  if (!toastContainer) {
    initToastContainer()
  }

  // Créer le toast
  const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const toast = document.createElement('div')
  toast.id = toastId
  toast.className = 'flex items-center w-full max-w-sm p-4 text-gray-700 bg-white rounded-lg shadow-lg border border-gray-200 animate-slide-in-right'
  toast.setAttribute('role', 'alert')

  // Icône selon le type
  const icons = {
    success: `
      <div class="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
        </svg>
      </div>
    `,
    error: `
      <div class="inline-flex items-center justify-center shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </div>
    `,
    warning: `
      <div class="inline-flex items-center justify-center shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
      </div>
    `,
    info: `
      <div class="inline-flex items-center justify-center shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
      </div>
    `
  }

  // Construire le HTML du toast
  let toastHTML = `
    ${icons[type] || icons.info}
    <div class="ms-3 text-sm font-normal flex-1">${message}</div>
  `

  // Ajouter le bouton d'action si présent
  if (action && onAction) {
    toastHTML += `
      <button 
        type="button" 
        class="ms-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
        data-action="true"
      >
        ${action}
      </button>
    `
  }

  // Bouton de fermeture
  toastHTML += `
    <button 
      type="button" 
      class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
      data-dismiss="true"
      aria-label="Close"
    >
      <span class="sr-only">Close</span>
      <svg class="w-3 h-3" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
    </button>
  `

  toast.innerHTML = toastHTML

  // Event listeners
  const dismissButton = toast.querySelector('[data-dismiss="true"]')
  dismissButton?.addEventListener('click', () => removeToast(toastId))

  const actionButton = toast.querySelector('[data-action="true"]')
  if (actionButton && onAction) {
    actionButton.addEventListener('click', () => {
      onAction()
      removeToast(toastId)
    })
  }

  // Ajouter au conteneur
  toastContainer.appendChild(toast)

  // Auto-dismiss après la durée
  if (duration > 0) {
    setTimeout(() => removeToast(toastId), duration)
  }

  return toastId
}

/**
 * Supprimer un toast
 * @param {string} toastId - ID du toast à supprimer
 */
function removeToast(toastId) {
  const toast = document.getElementById(toastId)
  if (!toast) return

  // Animation de sortie
  toast.classList.add('animate-slide-out-right')
  
  setTimeout(() => {
    toast.remove()
  }, 300)
}

/**
 * Raccourcis pour les types courants
 */
export const toast = {
  success: (message, options = {}) => showToast({ message, type: TOAST_TYPE.SUCCESS, ...options }),
  error: (message, options = {}) => showToast({ message, type: TOAST_TYPE.ERROR, ...options }),
  warning: (message, options = {}) => showToast({ message, type: TOAST_TYPE.WARNING, ...options }),
  info: (message, options = {}) => showToast({ message, type: TOAST_TYPE.INFO, ...options })
}

export default toast
