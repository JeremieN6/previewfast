<template>
  <button
    @click="openBillingPortal"
    :disabled="isLoading"
    class="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
    </svg>
    <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>{{ isLoading ? 'Chargement...' : 'Gérer mon abonnement' }}</span>
  </button>
</template>

<script>
import { getAuthToken } from '../services/authService.js'

const BACKEND_URL = 'http://localhost:3001'

export default {
  name: 'BillingButton',
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    async openBillingPortal() {
      const token = getAuthToken()
      
      if (!token) {
        alert('Veuillez vous connecter pour accéder à votre espace facturation')
        return
      }
      
      try {
        this.isLoading = true
        
        // Appel backend pour créer une session Billing Portal
        const response = await fetch(`${BACKEND_URL}/stripe/create-portal-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Erreur lors de la création de la session Billing Portal')
        }
        
        const data = await response.json()
        
        // Rediriger vers le Billing Portal Stripe
        window.location.href = data.url
        
      } catch (error) {
        console.error('[Billing] Erreur:', error)
        alert('❌ Erreur lors de l\'accès à l\'espace facturation. Veuillez réessayer.')
        this.isLoading = false
      }
    }
  }
}
</script>
