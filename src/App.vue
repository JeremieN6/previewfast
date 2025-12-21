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

    <!-- Badge Plan + Bouton Upgrade (toujours visible) -->
    <div class="fixed top-4 right-4 z-40 flex items-center gap-3">
      <!-- Badge plan actuel -->
      <div :class="[
        'px-4 py-2 rounded-lg font-medium text-sm shadow-lg flex items-center gap-2',
        userPlan === 'pro' 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
      ]">
        <svg v-if="userPlan === 'pro'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
        <span>{{ userPlan === 'pro' ? 'Plan Pro' : 'Plan Free' }}</span>
      </div>
      
      <!-- Bouton upgrade (uniquement si Free) -->
      <button
        v-if="userPlan === 'free'"
        @click="openUpgradeModal(null)"
        class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        Passer en Pro
      </button>
      
      <!-- Compteur exports (uniquement si Free) -->
      <div 
        v-if="userPlan === 'free'" 
        class="px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-medium"
        :title="`${remainingExports} export(s) restant(s)`"
      >
        📊 {{ exportCount }}/5 exports
      </div>
    </div>

    <!-- Bouton Modifier (uniquement si écran sélectionné) -->
    <div v-if="selectedDesign && selectedScreenId" class="fixed right-4 bottom-20 z-50 flex flex-col gap-3">
      <!-- Menu Modifier avec dropdown -->
      <div class="relative">
        <button
          @click="isEditDropdownOpen = !isEditDropdownOpen"
          type="button"
          class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-between gap-2"
          title="Options d'édition"
          aria-label="Ouvrir le menu d'édition"
        >
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Modifier
          </span>
          <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isEditDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <!-- Menu dropdown édition -->
        <div
          v-show="isEditDropdownOpen"
          class="absolute bottom-full right-0 mb-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden"
        >
          <!-- Option 1 : Modifier cet écran -->
          <button
            @click="openEditModal"
            type="button"
            class="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-600"
          >
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">Modifier cet écran</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Éditer les valeurs de l'écran {{ selectedScreenId }}
                </div>
              </div>
            </div>
          </button>
          
          <!-- Option 2 : Dupliquer vers un autre écran -->
          <button
            @click="handleDuplicateClick"
            type="button"
            :disabled="!canDuplicate"
            :class="[
              'w-full px-4 py-3 text-left transition-colors border-b border-gray-200 dark:border-gray-600',
              canDuplicate 
                ? 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
            ]"
          >
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 mt-0.5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              <div class="flex-1">
                <div class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  Dupliquer vers...
                  <span v-if="!canDuplicate" class="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">PRO</span>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  <template v-if="canDuplicate">Copier cet écran sur un autre écran</template>
                  <template v-else>Fonctionnalité réservée au plan Pro</template>
                </div>
              </div>
            </div>
          </button>
          
          <!-- Option 3 : Appliquer à tous (désactivée pour l'instant) -->
          <button
            type="button"
            disabled
            class="w-full px-4 py-3 text-left opacity-50 cursor-not-allowed border-b border-gray-200 dark:border-gray-600"
          >
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 mt-0.5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
              </svg>
              <div>
                <div class="font-medium text-gray-400 dark:text-gray-500">Appliquer à tous</div>
                <div class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  Prochainement disponible
                </div>
              </div>
            </div>
          </button>
          
          <!-- Option 4 : Presets -->
          <button
            @click="openPresetModal"
            type="button"
            class="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 mt-0.5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">Presets</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Sauvegarder ou charger des configurations
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <!-- Bouton Exporter cet écran -->
      <button
        @click="handleExportScreen"
        type="button"
        :disabled="isExporting"
        class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all flex items-center gap-2"
        title="Exporter cet écran en PNG"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
        {{ isExporting ? 'Export...' : 'Exporter écran' }}
      </button>
      
      <!-- Bouton Exporter tous les écrans du design -->
      <button
        @click="handleExportAllScreens"
        type="button"
        :disabled="isExporting"
        class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg shadow-lg transition-all flex items-center gap-2"
        title="Exporter tous les écrans de ce design en ZIP"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
        </svg>
        {{ isExporting ? 'Export...' : 'Exporter tout' }}
      </button>
      
      <!-- Bouton Réinitialiser avec dropdown -->
      <div class="relative">
        <button
          @click="isResetDropdownOpen = !isResetDropdownOpen"
          type="button"
          class="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-between gap-2"
          title="Options de réinitialisation"
          aria-label="Ouvrir le menu de réinitialisation"
        >
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Réinitialiser
          </span>
          <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isResetDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <!-- Menu dropdown -->
        <div
          v-show="isResetDropdownOpen"
          class="absolute bottom-full right-0 mb-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden"
        >
          <!-- Option 1 : Cet écran -->
          <button
            @click="resetCurrentScreen"
            type="button"
            class="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-600"
          >
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 mt-0.5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">Cet écran uniquement</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {{ selectedDesign }}, écran {{ selectedScreenId }}
                </div>
              </div>
            </div>
          </button>
          
          <!-- Option 2 : Ce design -->
          <button
            @click="resetCurrentDesign"
            type="button"
            class="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-600"
          >
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 mt-0.5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
              </svg>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">Ce design complet</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {{ selectedDesign }} (5 écrans)
                </div>
              </div>
            </div>
          </button>
          
          <!-- Option 3 : Tous les designs -->
          <button
            @click="resetAllDesigns"
            type="button"
            class="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <div>
                <div class="font-medium text-red-600 dark:text-red-400">⚠️ Tous les designs</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  7 designs × 5 écrans = 35 écrans
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
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
      :designConfig="selectedDesign ? designConfigs[selectedDesign] : null"
      @close="closeEditModal"
      @apply-changes="applyChanges"
      @apply-to-all="applyChangesToAll"
      @upgrade-required="openUpgradeModal"
    />
    
    <!-- Modale de duplication -->
    <DuplicateModal
      :isOpen="isDuplicateModalOpen"
      :sourceDesign="selectedDesign"
      :sourceScreen="selectedScreenId"
      :designConfig="selectedDesign ? designConfigs[selectedDesign] : null"
      @close="closeDuplicateModal"
      @duplicate="handleDuplicate"
    />    
    <!-- Modal des presets -->
    <PresetModal
      :isOpen="isPresetModalOpen"
      :designId="selectedDesign"
      :currentScreen="selectedScreenId"
      :currentEdits="selectedDesign && selectedScreenId ? modifications[`${selectedDesign}-screen-${selectedScreenId}`] || {} : {}"
      @close="closePresetModal"
      @load-preset="handleLoadPreset"
    />
    
    <!-- Modal d'upgrade -->
    <UpgradeModal
      :isOpen="isUpgradeModalOpen"
      :feature="upgradeFeature || 'duplicateScreens'"
      @close="closeUpgradeModal"
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
import DuplicateModal from './components/DuplicateModal.vue';
import PresetModal from './components/PresetModal.vue';
import UpgradeModal from './components/UpgradeModal.vue';

// Import du module de persistance
import { saveDesignState, loadDesignState, resetDesignState } from './utils/persistence.js';

// Import du module d'export
import { exportScreen, exportAllScreens } from './utils/export.js';

// Import du système de plans
import { getUserPlan, isPro, canExport, getRemainingExports, getExportCount } from './utils/planManager.js';
import { canAccess } from './utils/plans.config.js';

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
    EditModal,
    DuplicateModal,
    PresetModal,
    UpgradeModal
  },
  data() {
    return {
      isDarkMode: false,
      selectedDesign: null,
      selectedScreenId: null,
      isEditModalOpen: false,
      isEditDropdownOpen: false, // État du dropdown d'édition
      isDuplicateModalOpen: false, // État de la modal de duplication
      isPresetModalOpen: false, // État de la modal des presets
      isUpgradeModalOpen: false, // État de la modal d'upgrade
      upgradeFeature: null, // Fonctionnalité à débloquer
      isExporting: false, // État d'export
      isResetDropdownOpen: false, // État du dropdown de réinitialisation
      userPlan: 'free', // Plan utilisateur (free/pro)
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
    // Vérifier si l'utilisateur peut utiliser la duplication
    canDuplicate() {
      return this.userPlan === 'pro' || canAccess(this.userPlan, 'canDuplicateScreens')
    },
    
    // Compteur d'exports pour Free
    exportCount() {
      return getExportCount()
    },
    
    // Exports restants pour Free
    remainingExports() {
      return getRemainingExports()
    },
    
    currentScreenData() {
      if (!this.selectedDesign || !this.selectedScreenId) {
        return { id: '', editableZones: [] }
      }
      
      const config = this.designConfigs[this.selectedDesign]
      const screen = config.screens.find(s => s.id === `screen-${this.selectedScreenId}`)
      
      if (!screen) {
        return { id: '', editableZones: [] }
      }
      
      // Priorité 1 : Modifications locales en mémoire (this.modifications)
      const key = `${this.selectedDesign}-screen-${this.selectedScreenId}`
      const localEdits = this.modifications[key] || {}
      
      // Priorité 2 : Modifications sauvegardées dans localStorage
      const savedState = loadDesignState(this.selectedDesign)
      const screenId = `screen-${this.selectedScreenId}`
      const savedEdits = savedState?.[screenId] || {}
      
      // Fusionner : local > saved > default
      const enrichedZones = screen.editableZones.map(zone => {
        const localEdit = localEdits[zone.id]
        const savedEdit = savedEdits[zone.id]
        
        if (localEdit) {
          // Modification locale en cours de session (la plus récente)
          return {
            ...zone,
            current: localEdit.value
          }
        } else if (savedEdit) {
          // Modification sauvegardée depuis localStorage
          return {
            ...zone,
            current: savedEdit.value
          }
        }
        
        // Pas de modification, garder la valeur par défaut
        return zone
      })
      
      return {
        ...screen,
        editableZones: enrichedZones
      }
    }
  },
  methods: {
    handleClickOutside(event) {
      // Vérifier si le clic est en dehors des dropdowns
      const dropdown = event.target.closest('.relative');
      if (!dropdown) {
        if (this.isResetDropdownOpen) {
          this.isResetDropdownOpen = false;
        }
        if (this.isEditDropdownOpen) {
          this.isEditDropdownOpen = false;
        }
      }
    },
    
    handleScreenSelection(designId, screenNum) {
      this.selectedDesign = designId
      this.selectedScreenId = screenNum
    },
    
    openEditModal() {
      this.isEditDropdownOpen = false // Fermer le dropdown
      this.isEditModalOpen = true
    },
    
    closeEditModal() {
      this.isEditModalOpen = false
    },
    
    openDuplicateModal() {
      this.isEditDropdownOpen = false // Fermer le dropdown
      this.isDuplicateModalOpen = true
    },
    
    handleDuplicateClick() {
      // Vérifier si l'utilisateur peut utiliser cette fonctionnalité
      if (!this.canDuplicate) {
        this.openUpgradeModal('duplicateScreens')
        return
      }
      
      // Si autorisé, ouvrir la modal
      this.openDuplicateModal()
    },
    
    closeDuplicateModal() {
      this.isDuplicateModalOpen = false
    },
    
    openUpgradeModal(feature) {
      this.upgradeFeature = feature
      this.isUpgradeModalOpen = true
    },
    
    closeUpgradeModal() {
      this.isUpgradeModalOpen = false
      this.upgradeFeature = null
    },
    
    openPresetModal() {
      // Fermer le dropdown d'édition
      this.isEditDropdownOpen = false
      // Ouvrir la modal des presets
      this.isPresetModalOpen = true
    },
    
    closePresetModal() {
      this.isPresetModalOpen = false
    },
    
    handleLoadPreset(preset) {
      if (!preset || !preset.values) {
        alert('❌ Preset invalide')
        return
      }
      
      // Fermer la modal
      this.closePresetModal()
      
      if (preset.scope === 'screen') {
        // Appliquer à l'écran actuel uniquement
        this.applyPresetToScreen(preset.values, this.selectedScreenId)
      } else if (preset.scope === 'design') {
        // Appliquer à tous les écrans compatibles du design
        this.applyPresetToDesign(preset.values)
      }
      
      // Recharger pour appliquer visuellement
      window.location.reload()
    },
    
    applyPresetToScreen(presetValues, targetScreenId) {
      if (!this.selectedDesign || !targetScreenId) return
      
      // Sauvegarder dans localStorage
      const screenId = `screen-${targetScreenId}`
      saveDesignState(this.selectedDesign, screenId, presetValues)
      
      console.log(`✅ Preset appliqué à l'écran ${targetScreenId}`)
    },
    
    applyPresetToDesign(presetValues) {
      if (!this.selectedDesign) return
      
      const config = this.designConfigs[this.selectedDesign]
      
      // Pour chaque écran du design
      config.screens.forEach(screen => {
        // Filtrer uniquement les zones qui existent dans cet écran
        const compatibleEdits = {}
        
        Object.keys(presetValues).forEach(zoneId => {
          const zoneExists = screen.editableZones.some(z => z.id === zoneId)
          
          if (zoneExists) {
            compatibleEdits[zoneId] = presetValues[zoneId]
          }
        })
        
        // Sauvegarder uniquement si des zones compatibles existent
        if (Object.keys(compatibleEdits).length > 0) {
          saveDesignState(this.selectedDesign, screen.id, compatibleEdits)
          
          console.log(`✅ ${screen.id}: ${Object.keys(compatibleEdits).length} zone(s) du preset appliquée(s)`)
        }
      })
      
      console.log(`✅ Preset appliqué à tout le design ${this.selectedDesign}`)
    },
    
    handleDuplicate({ targetScreen }) {
      if (!this.selectedDesign || !this.selectedScreenId) return
      
      // Récupérer l'état source
      const sourceKey = `${this.selectedDesign}_screen-${this.selectedScreenId}`
      const sourceState = this.modifications[sourceKey] || loadDesignState(this.selectedDesign)?.[`screen-${this.selectedScreenId}`]
      
      if (!sourceState) {
        alert('Aucune modification à dupliquer')
        return
      }
      
      // Copier l'état vers la cible
      const targetKey = `${this.selectedDesign}_screen-${targetScreen}`
      this.modifications[targetKey] = { ...sourceState }
      
      // Sauvegarder dans localStorage
      const screenId = `screen-${targetScreen}`
      saveDesignState(this.selectedDesign, screenId, sourceState)
      
      // Fermer la modal
      this.closeDuplicateModal()
      
      // Recharger la page pour appliquer visuellement
      window.location.reload()
      
      console.log(`✅ Écran ${this.selectedScreenId} dupliqué vers écran ${targetScreen}`)
    },
    
    applyChanges(edits) {
      // Stocker les modifications
      const key = `${this.selectedDesign}-screen-${this.selectedScreenId}`
      this.modifications[key] = edits
      
      // Appliquer les modifications au DOM
      this.applyModificationsToDOM(edits)
      
      // Sauvegarder automatiquement dans localStorage
      if (this.selectedDesign && this.selectedScreenId) {
        const screenId = `screen-${this.selectedScreenId}`
        saveDesignState(this.selectedDesign, screenId, edits)
      }
    },
    
    applyChangesToAll(edits) {
      if (!this.selectedDesign) return
      
      const config = this.designConfigs[this.selectedDesign]
      const allScreens = config.screens || []
      
      console.log(`[App] Application des modifications à tous les écrans du ${this.selectedDesign}`)
      
      // Pour chaque écran du design
      allScreens.forEach(screen => {
        const match = screen.id.match(/screen-(\d+)/)
        const screenNum = match ? parseInt(match[1]) : null
        
        if (!screenNum) return
        
        // Filtrer les éditions pour ne garder que celles compatibles avec cet écran
        const compatibleEdits = {}
        
        Object.keys(edits).forEach(zoneId => {
          const zoneExists = screen.editableZones.some(z => z.id === zoneId)
          if (zoneExists) {
            compatibleEdits[zoneId] = edits[zoneId]
          }
        })
        
        // Si des éditions compatibles existent, les sauvegarder
        if (Object.keys(compatibleEdits).length > 0) {
          const key = `${this.selectedDesign}_screen-${screenNum}`
          
          // Fusionner avec les modifications existantes
          this.modifications[key] = {
            ...(this.modifications[key] || {}),
            ...compatibleEdits
          }
          
          // Sauvegarder dans localStorage
          saveDesignState(this.selectedDesign, screen.id, compatibleEdits)
          
          console.log(`✅ ${screen.id}: ${Object.keys(compatibleEdits).length} zone(s) modifiée(s)`)
        }
      })
      
      // Recharger la page pour appliquer visuellement
      window.location.reload()
    },
    
    applyModificationsToDOM(edits) {
      // Extraire le numéro du design (ex: 'design-1' -> '1')
      const designNum = this.selectedDesign.split('-')[1]
      // Sélecteur spécifique au design ET à l'écran
      const screenSelector = `.myScreen-design-${designNum}[data-screen="${this.selectedScreenId}"]`
      const screenElement = document.querySelector(screenSelector)
      
      if (!screenElement) {
        console.warn(`[App] Screen element not found: ${screenSelector}`)
        return
      }
      
      Object.keys(edits).forEach(zoneId => {
        const edit = edits[zoneId]
        const zone = this.currentScreenData.editableZones.find(z => z.id === zoneId)
        
        if (!zone) {
          console.warn(`[App] Zone not found: ${zoneId}`)
          return
        }
        
        // Pour le background, si le sélecteur cible l'écran lui-même, appliquer directement
        let targetElement
        if (zone.type === 'background' && screenElement.matches(zone.selector)) {
          targetElement = screenElement
        } else {
          // Pour les autres zones, chercher l'élément à l'intérieur
          targetElement = screenElement.querySelector(zone.selector)
        }
        
        if (!targetElement) {
          console.warn(`[App] Target element not found for zone ${zoneId} with selector: ${zone.selector}`)
          return
        }
        
        // Appliquer selon le type
        if (zone.type === 'background') {
          if (edit.type === 'color' || edit.type === 'gradient') {
            targetElement.style.background = edit.value
            console.log(`[App] Applied ${edit.type} to ${zoneId}:`, edit.value)
          }
        } else if (zone.type === 'text') {
          targetElement.textContent = edit.value
          console.log(`[App] Applied text to ${zoneId}:`, edit.value)
        } else if (zone.type === 'image') {
          if (edit.type === 'url' || edit.type === 'upload') {
            targetElement.src = edit.value
            
            // Cas spécial : logo du Design 3 nécessite un width de 30%
            if (this.selectedDesign === 'design-3' && zoneId === 'logo') {
              targetElement.style.width = '30%'
              targetElement.style.height = 'auto' // Maintenir le ratio
            }
            
            console.log(`[App] Applied image to ${zoneId}`)
          }
        }
      })
    },
    
    resetCurrentScreen() {
      if (!this.selectedDesign || !this.selectedScreenId) return
      
      // Fermer le dropdown
      this.isResetDropdownOpen = false
      
      // Pas de confirmation pour un seul écran (risque faible)
      const key = `${this.selectedDesign}_screen-${this.selectedScreenId}`
      
      // Supprimer de l'état local
      if (this.modifications[key]) {
        delete this.modifications[key]
      }
      
      // Supprimer du localStorage
      const savedState = loadDesignState(this.selectedDesign)
      if (savedState && savedState[`screen-${this.selectedScreenId}`]) {
        delete savedState[`screen-${this.selectedScreenId}`]
        saveDesignState(this.selectedDesign, savedState)
      }
      
      // Recharger la page pour réinitialiser visuellement
      window.location.reload()
      
      console.log(`✅ Écran ${this.selectedScreenId} du ${this.selectedDesign} réinitialisé`)
    },
    
    resetCurrentDesign() {
      if (!this.selectedDesign) return
      
      // Fermer le dropdown
      this.isResetDropdownOpen = false
      
      // Compter les modifications pour ce design
      const modificationCount = Object.keys(this.modifications)
        .filter(key => key.startsWith(this.selectedDesign))
        .length
      
      // Confirmation si des modifications existent
      if (modificationCount > 0) {
        const confirm = window.confirm(
          `⚠️ Réinitialiser tout le ${this.selectedDesign} ?\n\n` +
          `Cela supprimera les modifications sur les 5 écrans de ce design.\n\n` +
          `Voulez-vous continuer ?`
        )
        
        if (!confirm) return
      }
      
      // Réinitialiser l'état dans localStorage
      resetDesignState(this.selectedDesign)
      
      // Réinitialiser l'état local
      Object.keys(this.modifications).forEach(key => {
        if (key.startsWith(this.selectedDesign)) {
          delete this.modifications[key]
        }
      })
      
      // Recharger la page pour tout réinitialiser visuellement
      window.location.reload()
      
      console.log(`✅ ${this.selectedDesign} complet réinitialisé`)
    },
    
    resetAllDesigns() {
      // Fermer le dropdown
      this.isResetDropdownOpen = false
      
      // Compter toutes les modifications
      const totalModifications = Object.keys(this.modifications).length
      
      // Confirmation renforcée (toujours afficher, même sans modifications)
      const message = totalModifications > 0
        ? `🚨 ATTENTION : Réinitialiser TOUS les designs !\n\n` +
          `Cela supprimera TOUTES les modifications sur les 7 designs (35 écrans).\n` +
          `Vous avez actuellement ${totalModifications} modification(s).\n\n` +
          `⚠️ Cette action est IRRÉVERSIBLE !\n\n` +
          `Êtes-vous absolument certain de vouloir continuer ?`
        : `🚨 Réinitialiser TOUS les designs ?\n\n` +
          `Cela réinitialisera les 7 designs (35 écrans).\n\n` +
          `Voulez-vous continuer ?`
      
      const confirm = window.confirm(message)
      
      if (!confirm) return
      
      // Double confirmation pour les actions critiques
      const doubleConfirm = window.confirm(
        `⚠️ Dernière confirmation\n\n` +
        `Vous êtes sur le point de TOUT réinitialiser.\n` +
        `Cliquez sur OK pour confirmer définitivement.`
      )
      
      if (!doubleConfirm) return
      
      // Réinitialiser tous les designs
      Object.keys(this.designConfigs).forEach(designId => {
        resetDesignState(designId)
      })
      
      // Vider l'état local
      this.modifications = {}
      
      // Recharger la page
      window.location.reload()
      
      console.log(`✅ Tous les designs ont été réinitialisés`)
    },
    
    async handleExportScreen() {
      if (!this.selectedDesign || !this.selectedScreenId) {
        alert('Aucun écran sélectionné')
        return
      }
      
      this.isExporting = true
      
      try {
        await exportScreen(this.selectedDesign, this.selectedScreenId)
        
        // Mise à jour du compteur (si Free)
        if (this.userPlan === 'free') {
          // Le compteur est déjà incrémenté dans export.js
          // On force juste un re-render pour mettre à jour l'affichage
          this.$forceUpdate()
        }
        
        // Feedback de succès
        const remaining = getRemainingExports()
        if (this.userPlan === 'free' && remaining <= 2) {
          alert(`✅ Export réussi !\n\n⚠️ Attention : il vous reste ${remaining} export(s) gratuit(s).`)
        } else {
          console.log('✅ Export réussi')
        }
      } catch (error) {
        console.error('❌ Erreur d\'export:', error)
        
        // Vérifier si c'est une erreur de quota
        if (error.message.startsWith('QUOTA_EXCEEDED:')) {
          this.openUpgradeModal('exportLimit')
        } else {
          alert(`Erreur lors de l'export : ${error.message}`)
        }
      } finally {
        this.isExporting = false
      }
    },
    
    async handleExportAllScreens() {
      if (!this.selectedDesign) {
        alert('Aucun design sélectionné')
        return
      }
      
      this.isExporting = true
      
      try {
        const config = this.designConfigs[this.selectedDesign]
        await exportAllScreens(this.selectedDesign, config)
        
        // Feedback de succès
        console.log('✅ Export de tous les écrans réussi')
      } catch (error) {
        console.error('❌ Erreur d\'export:', error)
        alert(`Erreur lors de l'export : ${error.message}`)
      } finally {
        this.isExporting = false
      }
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
    },
    
    restoreAllDesigns() {
      // Restaurer tous les designs sauvegardés
      Object.keys(this.designConfigs).forEach(designId => {
        const savedState = loadDesignState(designId)
        
        if (!savedState) return
        
        // Pour chaque écran sauvegardé
        Object.keys(savedState).forEach(screenId => {
          const edits = savedState[screenId]
          const screenNum = screenId.replace('screen-', '')
          
          // Attendre que le DOM soit prêt
          this.$nextTick(() => {
            // Extraire le numéro du design (ex: 'design-1' -> '1')
            const designNum = designId.split('-')[1]
            // Sélecteur spécifique au design ET à l'écran
            const screenSelector = `.myScreen-design-${designNum}[data-screen="${screenNum}"]`
            const screenElement = document.querySelector(screenSelector)
            
            if (!screenElement) return
            
            // Trouver la config correspondante
            const config = this.designConfigs[designId]
            const screen = config.screens.find(s => s.id === screenId)
            
            if (!screen) return
            
            // Appliquer chaque modification
            Object.keys(edits).forEach(zoneId => {
              const edit = edits[zoneId]
              const zone = screen.editableZones.find(z => z.id === zoneId)
              
              if (!zone) return
              
              // Pour le background, si le sélecteur cible l'écran lui-même, appliquer directement
              let targetElement
              if (zone.type === 'background' && screenElement.matches(zone.selector)) {
                targetElement = screenElement
              } else {
                // Pour les autres zones, chercher l'élément à l'intérieur
                targetElement = screenElement.querySelector(zone.selector)
              }
              
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
                  
                  // Cas spécial : logo du Design 3 nécessite un width de 30%
                  if (designId === 'design-3' && zoneId === 'logo') {
                    targetElement.style.width = '30%'
                    targetElement.style.height = 'auto' // Maintenir le ratio
                  }
                }
              }
            })
            
            // Stocker dans modifications locales
            const key = `${designId}-${screenId}`
            this.modifications[key] = edits
          })
        })
      })
    }
  },

  mounted() {
    this.initDarkMode();
    
    // Charger le plan utilisateur
    this.userPlan = getUserPlan();
    console.log(`[App] Plan utilisateur: ${this.userPlan}`);
    
    // Restaurer les modifications sauvegardées
    this.$nextTick(() => {
      this.restoreAllDesigns();
    });
    
    // Fermer le dropdown si on clique ailleurs
    document.addEventListener('click', this.handleClickOutside);
  },
  
  beforeUnmount() {
    // Nettoyer le listener
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>
