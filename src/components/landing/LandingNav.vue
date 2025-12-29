<template>
  <header class="border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800">
    <nav class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4 py-4 lg:px-6">
      <RouterLink to="/" class="flex items-center gap-2 text-xl font-semibold text-gray-700 dark:text-white">
        <span class="text-3xl">⚡</span>
        PreviewFast
      </RouterLink>

      <div class="flex items-center gap-3 lg:order-2">
        <div class="hidden items-center space-x-3 md:flex">
          <button
            v-if="!isAuthenticated"
            type="button"
            @click="requestAuth()"
            class="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Connexion
          </button>

          <template v-else>
            <UserDropdown
              :user-email="userEmail"
              :user-plan="userPlan"
              :last-sync-time="lastSyncTime"
              @logout="logout"
              @billing="billing"
            />
            <div
              class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
              :class="userPlan === 'pro'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'"
            >
              <svg v-if="userPlan === 'pro'" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{{ userPlan === 'pro' ? 'Plan Pro' : 'Plan Free' }}</span>
            </div>
          </template>

          <RouterLink
            to="/atelier"
            v-if="!isAuthenticated"
            class="inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          >
            Aller à l'atelier
          </RouterLink>
        </div>

        <button
          type="button"
          class="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 lg:hidden"
          :aria-expanded="isMenuOpen"
          @click="toggleMenu"
        >
          <span class="sr-only">Basculer le menu</span>
          <svg v-if="!isMenuOpen" class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 010 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 010 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 010 2H4a1 1 0 01-1-1z"
            />
          </svg>
          <svg v-else class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            />
          </svg>
        </button>
      </div>

      <div class="w-full lg:order-1 lg:flex lg:w-auto" :class="{ hidden: !isMenuOpen }">
        <ul class="mt-4 flex flex-col gap-2 text-sm font-medium lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
          <li v-for="link in navLinks" :key="link.href">
            <RouterLink
              v-if="link.isRoute"
              :to="link.href"
              class="block rounded px-3 py-2 hover:text-blue-600"
              @click="closeMenu"
            >
              {{ link.label }}
            </RouterLink>
            <a
              v-else
              :href="link.href"
              class="block rounded px-3 py-2 hover:text-blue-600"
              @click="closeMenu"
            >
              {{ link.label }}
            </a>
          </li>
          <li>
            <button type="button" class="px-3 py-2 text-left hover:text-blue-600" @click="openEmail">Contact</button>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed, inject, ref } from 'vue'
import { RouterLink } from 'vue-router'
import UserDropdown from '../user/UserDropdown.vue'
import authService from '../../services/authService.js'

const emit = defineEmits(['open-auth-modal'])

const isMenuOpen = ref(false)
const auth = inject('auth', null)

const navLinks = [
  { label: 'Accueil', href: '/', isRoute: true },
  { label: 'Atelier', href: '/atelier', isRoute: true },
  { label: 'Processus', href: '/#process', isRoute: false },
  { label: 'Bénéfices', href: '/#benefits', isRoute: false },
  { label: 'Tarifs', href: '/#pricing', isRoute: false },
  { label: 'FAQ', href: '/#faq', isRoute: false }
]

const isAuthenticated = computed(() => auth?.isAuthenticated?.value ?? authService.isAuthenticated())
const userEmail = computed(() => auth?.userEmail?.value ?? authService.getUserEmail())
const userPlan = computed(() => auth?.userPlan?.value ?? 'free')
const lastSyncTime = computed(() => auth?.lastSyncTime?.value ?? null)

const requestAuth = () => {
  emit('open-auth-modal')
}

const logout = () => {
  if (auth?.logout) {
    auth.logout()
  } else {
    authService.logout()
  }
}

const billing = () => {
  if (auth?.billing) {
    auth.billing()
  } else {
    window.location.href = '/atelier'
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const openEmail = () => {
  window.location.href = 'mailto:contact@previewfaster.com'
}
</script>
