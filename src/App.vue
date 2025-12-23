<template>
  <div>
    <!-- Bouton toggle dark mode - Visible partout -->
    <div class="fixed right-4 bottom-4 z-50">
      <button
        @click="toggleDarkMode"
        type="button"
        class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 transition-colors duration-300 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600"
        title="Basculer le mode sombre"
        aria-label="Basculer le thème"
      >
        <!-- Icône lune (mode dark) -->
        <svg v-show="!isDarkMode" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
        <!-- Icône soleil (mode light) -->
        <svg v-show="isDarkMode" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
    
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, provide, computed } from 'vue'
import authService from './services/authService.js'
import { getUserPlan } from './utils/planManager.js'

const isDarkMode = ref(false)
const isAuthenticated = ref(false)
const userEmail = ref(null)
const userPlan = ref('free')
const lastSyncTime = ref(null)

// Initialiser le mode sombre au chargement
onMounted(() => {
  const savedTheme = localStorage.getItem('color-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDarkMode.value = false
    document.documentElement.classList.remove('dark')
  }
  
  // Initialiser l'état d'authentification
  initAuth()
})

// Initialiser l'authentification
const initAuth = () => {
  isAuthenticated.value = authService.isAuthenticated()
  
  if (isAuthenticated.value) {
    userEmail.value = authService.getUserEmail()
    userPlan.value = getUserPlan()
    
    // Formater le temps de sync (à adapter selon ton système)
    const lastSync = localStorage.getItem('last-sync-time')
    if (lastSync) {
      lastSyncTime.value = formatSyncTime(lastSync)
    }
  }
}

// Formater le temps de synchronisation
const formatSyncTime = (timestamp) => {
  const now = Date.now()
  const diff = now - parseInt(timestamp)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (minutes < 1) return 'à l\'instant'
  if (minutes < 60) return `il y a ${minutes} min`
  if (hours < 24) return `il y a ${hours} h`
  return `il y a ${days} j`
}

// Déconnexion
const handleLogout = () => {
  authService.logout()
  isAuthenticated.value = false
  userEmail.value = null
  userPlan.value = 'free'
  lastSyncTime.value = null
  
  // Rediriger vers la page d'accueil
  window.location.href = '/'
}

// Gérer l'abonnement (Stripe billing portal)
const handleBilling = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/stripe/create-billing-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
      }
    })
    
    const data = await response.json()
    if (data.url) {
      window.location.href = data.url
    }
  } catch (error) {
    console.error('Erreur billing portal:', error)
  }
}

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('color-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('color-theme', 'light')
  }
}

// Provide auth state to all components
provide('auth', {
  isAuthenticated: computed(() => isAuthenticated.value),
  userEmail: computed(() => userEmail.value),
  userPlan: computed(() => userPlan.value),
  lastSyncTime: computed(() => lastSyncTime.value),
  logout: handleLogout,
  billing: handleBilling,
  refreshAuth: initAuth
})
</script>

<style>
/* Global styles if needed */
</style>
