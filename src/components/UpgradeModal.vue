<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Overlay -->
    <div 
      class="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>
    
    <!-- Modal -->
    <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {{ upgradeData.title }}
            </h2>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Body -->
      <div class="px-6 py-6">
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          {{ upgradeData.message }}
        </p>
        
        <!-- Benefits list -->
        <div v-if="upgradeData.benefits && upgradeData.benefits.length > 0" class="mb-6">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Avec le plan Pro, vous débloquez :
          </p>
          <ul class="space-y-2">
            <li 
              v-for="(benefit, index) in upgradeData.benefits" 
              :key="index"
              class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{{ benefit }}</span>
            </li>
          </ul>
        </div>
        
        <!-- Export count if applicable -->
        <div v-if="showExportCount" class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 mb-4">
          <p class="text-sm text-amber-900 dark:text-amber-100">
            📊 Vous avez utilisé <strong>{{ exportCount }}/5</strong> exports gratuits
          </p>
        </div>
        
        <!-- Pro plan features -->
        <div class="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div class="flex items-center justify-between mb-2">
            <span class="text-lg font-bold text-gray-900 dark:text-white">Plan Pro</span>
            <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">9,90€<span class="text-sm font-normal">/mois</span></span>
          </div>
          <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>✓ Exports illimités en HD</li>
            <li>✓ Duplication d'écrans</li>
            <li>✓ Modifications globales</li>
            <li>✓ Presets design-wide</li>
            <li>✓ Aucun watermark</li>
          </ul>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Plus tard
        </button>
        
        <button
          @click="handleUpgrade"
          :disabled="isLoading"
          class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Chargement...' : 'Passer en Pro' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getExportCount } from '../utils/planManager.js'
import { UPGRADE_MESSAGES } from '../utils/plans.config.js'
import { getAuthToken } from '../services/authService.js'

const BACKEND_URL = import.meta.env.VITE_API_URL || window.location.origin

export default {
  name: 'UpgradeModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    feature: {
      type: String,
      required: true,
      validator: (value) => {
        return ['duplicateScreens', 'applyGlobalChanges', 'designPresets', 'exportLimit', 'exportZIP', 'hdExport'].includes(value)
      }
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    upgradeData() {
      return UPGRADE_MESSAGES[this.feature] || {
        title: '🔒 Fonctionnalité Pro',
        message: 'Cette fonctionnalité est réservée aux utilisateurs Pro.',
        benefits: []
      }
    },
    
    showExportCount() {
      return this.feature === 'exportLimit'
    },
    
    exportCount() {
      return getExportCount()
    }
  },
  methods: {
    async handleUpgrade() {
      const token = getAuthToken()
      
      // Si pas connecté, ouvrir la modal d'auth
      if (!token) {
        alert('Veuillez vous connecter pour passer en Pro')
        this.$emit('close')
        // Émettre un événement pour ouvrir la modal d'auth
        window.dispatchEvent(new CustomEvent('open-auth-modal'))
        return
      }
      
      try {
        this.isLoading = true
        
        // Appel backend pour créer une Checkout Session
        const response = await fetch(`${BACKEND_URL}/stripe/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Erreur lors de la création de la session Stripe')
        }
        
        const data = await response.json()
        
        // Rediriger vers Stripe Checkout
        window.location.href = data.url
        
      } catch (error) {
        console.error('[Upgrade] Erreur:', error)
        alert('❌ Erreur lors de la redirection vers le paiement. Veuillez réessayer.')
        this.isLoading = false
      }
    }
  }
}
</script>
