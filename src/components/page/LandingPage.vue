<template>
  <div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <LandingNav />
    <main>
      <LandingHero />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingTestimonials />
      <LandingPricing />
      <LandingFaq />
      <LandingNewsletter />
    </main>
    <LandingFooter />
  </div>
</template>

<script setup>
import LandingFaq from '../../components/landing/LandingFaq.vue'
import LandingFeatures from '../../components/landing/LandingFeatures.vue'
import LandingFooter from '../../components/landing/LandingFooter.vue'
import LandingHero from '../../components/landing/LandingHero.vue'
import LandingHowItWorks from '../../components/landing/LandingHowItWorks.vue'
import LandingNav from '../../components/landing/LandingNav.vue'
import LandingNewsletter from '../../components/landing/LandingNewsletter.vue'
import LandingPricing from '../../components/landing/LandingPricing.vue'
import LandingTestimonials from '../../components/landing/LandingTestimonials.vue'
</script>
