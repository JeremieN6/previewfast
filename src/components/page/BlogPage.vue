<template>
    <section>
      <LandingNav />
      <Blog />
      <LandingNewsletter />
      <LandingFooter />
    </section>
</template>
  
  <script setup>
    import LandingNav from '../../components/landing/LandingNav.vue'
    import Blog from '../../components/blog/Blog.vue'
    import LandingNewsletter from '../../components/landing/LandingNewsletter.vue'
    import LandingFooter from '../../components/landing/LandingFooter.vue'
  </script>