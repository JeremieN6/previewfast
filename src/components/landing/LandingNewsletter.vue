<template>
  <section class="bg-gray-100 dark:bg-gray-800">
    <div class="mx-auto max-w-screen-xl px-4 py-16 lg:px-6">
      <div class="mx-auto max-w-screen-md text-center">
        <h2 class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Recevez la newsletter produit</h2>
        <p class="mx-auto mb-8 max-w-2xl text-gray-500 dark:text-gray-400">
          Roadmap, promos et accès anticipé à de nouveaux templates. Un email par mois, pas plus.
        </p>
        <form @submit.prevent="handleSubmit" class="space-y-4 sm:flex sm:space-y-0">
          <div class="relative w-full sm:flex-1">
            <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg">
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
              </svg>
            </span>
            <input
              v-model="email"
              type="email"
              name="email"
              :disabled="isLoading"
              class="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="Entrez votre email"
              required
            />
          </div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full rounded-lg bg-blue-700 px-6 py-3 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
          >
            {{ isLoading ? 'Envoi...' : 'Souscrire' }}
          </button>
        </form>
        <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Nous respectons vos données. Consultez notre
          <RouterLink to="/" class="font-medium text-blue-600 hover:underline dark:text-blue-400">politique de confidentialité</RouterLink>.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { showToast, TOAST_TYPE } from '../../utils/toast.js'

const email = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  if (!email.value || isLoading.value) return
  
  isLoading.value = true
  
  try {
    const response = await fetch('http://localhost:3001/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      showToast({
        message: 'Votre email a bien été ajouté à la newsletter',
        type: TOAST_TYPE.SUCCESS,
        duration: 5000
      })
      email.value = '' // Reset le formulaire
    } else {
      showToast({
        message: data.error || 'Une erreur est survenue',
        type: TOAST_TYPE.ERROR,
        duration: 5000
      })
    }
  } catch (error) {
    console.error('Erreur newsletter:', error)
    showToast({
      message: 'Impossible de s\'inscrire à la newsletter',
      type: TOAST_TYPE.ERROR,
      duration: 5000
    })
  } finally {
    isLoading.value = false
  }
}
</script>
