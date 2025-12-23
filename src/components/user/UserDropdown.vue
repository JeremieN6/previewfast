<template>
  <div class="relative" data-user-menu>
    <!-- Bouton utilisateur -->
    <button
      @click="toggleMenu"
      class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      :aria-expanded="isOpen"
    >
      <!-- Avatar -->
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-xs font-bold text-white">
        {{ userEmail ? userEmail[0].toUpperCase() : 'U' }}
      </div>
      <!-- Email -->
      <span class="hidden md:inline text-gray-700 dark:text-gray-300">{{ userEmail }}</span>
      <!-- Chevron -->
      <svg 
        class="h-4 w-4 transition-transform duration-200" 
        :class="{ 'rotate-180': isOpen }" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        class="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-600 dark:bg-gray-800"
      >
        <!-- Header - Info utilisateur -->
        <div class="border-b border-gray-200 px-4 py-3 dark:border-gray-600">
          <div class="text-xs text-gray-500 dark:text-gray-400">Connecté en tant que</div>
          <div class="font-medium text-gray-900 dark:text-white">{{ userEmail }}</div>
          <div v-if="lastSyncTime" class="mt-1 text-xs text-green-600 dark:text-green-400">
            ✓ Synchronisé {{ lastSyncTime }}
          </div>
        </div>

        <!-- Action - Gérer mon abonnement -->
        <button
          v-if="userPlan === 'pro'"
          @click="handleBilling"
          class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg class="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
          <span class="text-gray-700 dark:text-gray-300">Gérer mon abonnement</span>
        </button>

        <!-- Action - Se déconnecter -->
        <button
          @click="handleLogout"
          class="flex w-full items-center gap-3 border-t border-gray-200 px-4 py-3 text-left text-red-600 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-red-400 dark:hover:bg-gray-700"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span>Se déconnecter</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  userEmail: {
    type: String,
    required: true
  },
  userPlan: {
    type: String,
    default: 'free',
    validator: (value) => ['free', 'pro'].includes(value)
  },
  lastSyncTime: {
    type: String,
    default: null
  }
})

// Emits
const emit = defineEmits(['logout', 'billing'])

// State
const isOpen = ref(false)

// Methods
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handleLogout = () => {
  isOpen.value = false
  emit('logout')
}

const handleBilling = () => {
  isOpen.value = false
  emit('billing')
}

const handleClickOutside = (event) => {
  const dropdown = event.target.closest('[data-user-menu]')
  if (!dropdown && isOpen.value) {
    isOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
