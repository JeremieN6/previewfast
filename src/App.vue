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

      <Design1 
        :screensCount="5" 
        @screen-selected="handleScreenSelection('design-1', $event)"
        :selectedScreenId="selectedDesign === 'design-1' ? selectedScreenId : null"
      />
      <Design2 
        :screensCount="5"
        @screen-selected="handleScreenSelection('design-2', $event)"
        :selectedScreenId="selectedDesign === 'design-2' ? selectedScreenId : null"
      />
      <Design3 
        :screensCount="5"
        @screen-selected="handleScreenSelection('design-3', $event)"
        :selectedScreenId="selectedDesign === 'design-3' ? selectedScreenId : null"
      />
      <Design4 
        :screensCount="5"
        @screen-selected="handleScreenSelection('design-4', $event)"
        :selectedScreenId="selectedDesign === 'design-4' ? selectedScreenId : null"
      />
      <Design5 
        :screensCount="5"
        @screen-selected="handleScreenSelection('design-5', $event)"
        :selectedScreenId="selectedDesign === 'design-5' ? selectedScreenId : null"
      />
      <Design6 
        :screensCount="5"
        @screen-selected="handleScreenSelection('design-6', $event)"
        :selectedScreenId="selectedDesign === 'design-6' ? selectedScreenId : null"
      />
      <Design7 
        :screensCount="5"
        @screen-selected="handleScreenSelection('design-7', $event)"
        :selectedScreenId="selectedDesign === 'design-7' ? selectedScreenId : null"
      />
    </main>

    <!-- Bouton Modifier (uniquement si écran sélectionné) -->
    <div v-if="selectedDesign && selectedScreenId" class="fixed right-4 bottom-20 z-50">
      <button
        @click="openEditModal"
        type="button"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        Modifier
      </button>
    </div>

    <!-- Bouton toggle dark mode -->
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

    <!-- Modale d'édition -->
    <EditModal
      :isOpen="isEditModalOpen"
      :screenData="currentScreenData"
      @close="closeEditModal"
      @apply-changes="applyChanges"
    />
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
import EditModal from './components/EditModal.vue';

// Import des configs JSON
import design1Config from '../configs/designs/design-1.json';
import design2Config from '../configs/designs/design-2.json';
import design3Config from '../configs/designs/design-3.json';
import design4Config from '../configs/designs/design-4.json';
import design5Config from '../configs/designs/design-5.json';
import design6Config from '../configs/designs/design-6.json';
import design7Config from '../configs/designs/design-7.json';

export default {
  name: 'App',
  components: {
    Design1,
    Design2,
    Design3,
    Design4,
    Design5,
    Design6,
    Design7,
    EditModal
  },
  data() {
    return {
      isDarkMode: false,
      selectedDesign: null,
      selectedScreenId: null,
      isEditModalOpen: false,
      designConfigs: {
        'design-1': design1Config,
        'design-2': design2Config,
        'design-3': design3Config,
        'design-4': design4Config,
        'design-5': design5Config,
        'design-6': design6Config,
        'design-7': design7Config
      },
      modifications: {} // Store des modifications locales
    }
  },
  computed: {
    currentScreenData() {
      if (!this.selectedDesign || !this.selectedScreenId) {
        return { id: '', editableZones: [] }
      }
      
      const config = this.designConfigs[this.selectedDesign]
      const screen = config.screens.find(s => s.id === `screen-${this.selectedScreenId}`)
      
      return screen || { id: '', editableZones: [] }
    }
  },
  methods: {
    handleScreenSelection(designId, screenNum) {
      this.selectedDesign = designId
      this.selectedScreenId = screenNum
    },
    
    openEditModal() {
      this.isEditModalOpen = true
    },
    
    closeEditModal() {
      this.isEditModalOpen = false
    },
    
    applyChanges(edits) {
      // Stocker les modifications
      const key = `${this.selectedDesign}-screen-${this.selectedScreenId}`
      this.modifications[key] = edits
      
      // Appliquer les modifications au DOM
      this.applyModificationsToDOM(edits)
    },
    
    applyModificationsToDOM(edits) {
      const screenSelector = `[data-screen="${this.selectedScreenId}"]`
      const screenElement = document.querySelector(screenSelector)
      
      if (!screenElement) return
      
      Object.keys(edits).forEach(zoneId => {
        const edit = edits[zoneId]
        const zone = this.currentScreenData.editableZones.find(z => z.id === zoneId)
        
        if (!zone) return
        
        const targetElement = screenElement.querySelector(zone.selector)
        
        if (!targetElement) return
        
        // Appliquer selon le type
        if (zone.type === 'background') {
          if (edit.type === 'color' || edit.type === 'gradient') {
            targetElement.style.background = edit.value
          }
        } else if (zone.type === 'text') {
          targetElement.textContent = edit.value
        } else if (zone.type === 'image') {
          if (edit.type === 'url' || edit.type === 'upload') {
            targetElement.src = edit.value
          }
        }
      })
    },
    
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
