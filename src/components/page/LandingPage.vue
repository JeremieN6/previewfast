<template>
  <div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <LandingNav @open-auth-modal="openAuthModal" />
    <main>
      <LandingHero />
      <LandingLiveDemo />
      <LandingBenefits />
      <LandingProcess />
      <LandingPricing />
      <LandingTestimonials />
      <LandingFrequentQuestions />
      <LandingNewsletter />
    </main>
    <LandingFooter />
    <AuthModal :is-open="isAuthModalOpen" @close="closeAuthModal" @success="handleAuthSuccess" />
  </div>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'

import LandingFooter from '../../components/landing/LandingFooter.vue'
import LandingHero from '../../components/landing/LandingHero.vue'
import LandingProcess from '../../components/landing/LandingProcess.vue'
import LandingNav from '../../components/landing/LandingNav.vue'
import LandingNewsletter from '../../components/landing/LandingNewsletter.vue'
import LandingPricing from '../../components/landing/LandingPricing.vue'
import LandingTestimonials from '../../components/landing/LandingTestimonials.vue'
import LandingBenefits from '../../components/landing/LandingBenefits.vue'
import LandingLiveDemo from '../../components/landing/LandingLiveDemo.vue'
import LandingFrequentQuestions from '../../components/landing/LandingFrequentQuestions.vue'
import AuthModal from '../../components/AuthModal.vue'

const auth = inject('auth', null)
const isAuthModalOpen = ref(false)

const openAuthModal = () => {
  isAuthModalOpen.value = true
}

const closeAuthModal = () => {
  isAuthModalOpen.value = false
}

const handleAuthSuccess = () => {
  auth?.refreshAuth?.()
  closeAuthModal()
}

const handleOpenAuthEvent = () => {
  openAuthModal()
}

onMounted(() => {
  window.addEventListener('open-auth-modal', handleOpenAuthEvent)
})

onBeforeUnmount(() => {
  window.removeEventListener('open-auth-modal', handleOpenAuthEvent)
})
</script>
