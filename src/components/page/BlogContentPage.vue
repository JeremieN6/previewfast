<template>
    <section>
      <LandingNav />
      <BlogContent />
      <LandingNewsletter />
      <LandingFooter />
    </section>
</template>
  
  <script setup>
    import LandingNav from '../../components/landing/LandingNav.vue'
    import BlogContent from '../../components/blog/BlogContent.vue'
    import LandingNewsletter from '../../components/landing/LandingNewsletter.vue'
    import LandingFooter from '../../components/landing/LandingFooter.vue'
  </script>