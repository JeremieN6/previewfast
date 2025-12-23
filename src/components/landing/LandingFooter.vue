<template>
  <footer class="border-t border-gray-100 bg-gray-100 px-4 py-10 dark:border-gray-800 dark:bg-gray-900">
    <div class="mx-auto max-w-screen-xl text-center">
      <RouterLink to="/" class="text-2xl font-semibold text-gray-900 dark:text-white">⚡ PreviewFast</RouterLink>
      <p class="mt-4 text-gray-500 dark:text-gray-400">Votre allié pour livrer des mockups impeccables.</p>
      <ul class="mt-6 flex flex-wrap items-center justify-center gap-4 text-gray-900 dark:text-gray-200">
        <li><RouterLink to="/" class="hover:underline">Accueil</RouterLink></li>
        <li><RouterLink to="/atelier" class="hover:underline">Builder</RouterLink></li>
        <li><a href="#features" class="hover:underline">Fonctionnalités</a></li>
        <li><a href="#faq" class="hover:underline">FAQ</a></li>
      </ul>
      <p class="mt-6 text-sm text-gray-500 dark:text-gray-400">
        © {{ currentYear }} PreviewFast.
        Site réalisé avec 💖 par <a href="https://jeremiecode.fr" class="font-medium text-blue-600 hover:underline dark:text-blue-400">JeremieCode™ Corp</a>.
      </p>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const currentYear = new Date().getFullYear()
</script>
