<template>
  <div id="previewfaster-app">
    <main class="hero" aria-labelledby="hero-title">
      <header class="hero__header">
        <p class="eyebrow">PreviewFaster mockup TEST VUE iPhone 15 Pro</p>
        <h1 id="hero-title">Reprenez ce layout App Store</h1>
        <p class="lead">
          Importez vos captures d'écran et gardez une typographie, un cadrage et un dégradé cohérents pour vos
          screenshots.
        </p>
      </header>

      <Design1 :screensCount="5" />
      <Design2 :screensCount="5" />
      <Design3 :screensCount="5" />
      <Design4 :screensCount="5" />
      <Design5 :screensCount="5" />
      <Design6 :screensCount="5" />
      <Design7 :screensCount="5" />
    </main>

    <!-- Bouton toggle dark mode (inspiré de QuickEsti) -->
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
  </div>
</template>

<script>
import Design1 from './components/designs/Design1.vue';
import Design2 from './components/designs/Design2.vue';
import Design3 from './components/designs/Design3.vue';
import Design4 from './components/designs/Design4.vue';
import Design5 from './components/designs/Design5.vue';
import Design6 from './components/designs/Design6.vue';
import Design7 from './components/designs/Design7.vue';

export default {
  name: 'App',
  components: {
    Design1,
    Design2,
    Design3,
    Design4,
    Design5,
    Design6,
    Design7
  },
  data() {
    return {
      isDarkMode: false
    }
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;

      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      }
    },

    initDarkMode() {
      // Vérifier les préférences sauvegardées ou système
      const savedTheme = localStorage.getItem('color-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        this.isDarkMode = true;
        document.documentElement.classList.add('dark');
      } else {
        this.isDarkMode = false;
        document.documentElement.classList.remove('dark');
      }
    }
  },

  mounted() {
    this.initDarkMode();
  }
}
</script>
