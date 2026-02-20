<template>
  <!-- Wrapper Tailwind pour toute la page -->
  <div class="bg-gray-100 dark:bg-gray-900">
    <!-- Navigation -->
    <LandingNav @open-auth-modal="openAuthModal" />
    
    <!-- Titre et description -->
    <main class="bg-gradient-to-b from-gray-50 via-white to-white py-12 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class=""><!--rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur dark:bg-gray-900/70-->
          <div class="mb-10">
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">L'atelier previewfast</p>
            <h1 class="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Previews prêtes en 3 étapes.</h1>
            <p class="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              Upload 5 à 10 captures, ajoutes tes textes, modifie la couleur, le dégradé ou l'image de fond et exporte instantanément 10 slides HD.
            </p>
          </div>

          <div class="grid gap-10 lg:grid-cols-[340px,1fr]">
            <div class="space-y-8">
              <div class="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Importer vos assets</h2>
                <ScreenshotUploader />
              </div>
            </div>
            <!-- Container du builder avec la structure CSS custom -->
            <div
              class="space-y-12 overflow-x-auto overflow-y-hidden transition-opacity duration-300"
              :class="assetsReady ? 'builder-loaded' : 'opacity-0 pointer-events-none'"
            >
                <section class="container-builder">
                <div id="previewfast-app">
                    <main class="hero" aria-labelledby="hero-title">
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

                <!-- Badge Plan + Bouton Upgrade (fixed en haut à droite) -->
                <div class="fixed bottom-4 left-4 z-40 flex items-center gap-3">
                <!-- Badge plan actuel -->
                
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

                <!-- Actions flottantes : un seul bouton qui ouvre une modale regroupant tout -->
                <div v-if="selectedDesign && selectedScreenId" class="actions-fab fixed inset-x-0 bottom-6 z-50 flex justify-center">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-2px] hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
                    @click="openActionsModal"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Actions (écran {{ selectedScreenId }})
                  </button>
                </div>

                <!-- Modale unique d'actions -->
                <div v-if="isActionsModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" @click.self="closeActionsModal">
                  <div class="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
                    <button
                      type="button"
                      class="absolute right-3 top-3 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
                      @click="closeActionsModal"
                      aria-label="Fermer la modale"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <header class="mb-6">
                      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">Actions rapides</p>
                      <h3 class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Écran {{ selectedScreenId }} · {{ selectedDesign }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Choisis une action pour l'écran sélectionné.</p>
                    </header>

                    <div class="grid gap-6 md:grid-cols-3">
                      <!-- Section Édition -->
                      <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60">
                        <div class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                          <span class="text-base">📝</span> Édition
                        </div>
                        <div class="space-y-2">
                          <button
                            class="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-sm font-medium text-gray-800 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
                            @click="triggerEdit"
                          >
                            <span>✏️ Modifier cet écran</span>
                            <span class="text-gray-400">↵</span>
                          </button>
                          <button
                            class="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-sm font-medium text-gray-800 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
                            @click="triggerDuplicate"
                          >
                            <span>📋 Dupliquer vers...</span>
                            <span class="text-gray-400">↵</span>
                          </button>
                          <button
                            class="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-sm font-medium text-gray-800 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
                            @click="triggerApplyAll"
                          >
                            <span>📱 Appliquer à tous (🔒 Pro)</span>
                            <span class="text-gray-400">↵</span>
                          </button>
                          <button
                            class="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-sm font-medium text-gray-800 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
                            @click="triggerPreset"
                          >
                            <span>🔖 Presets (🔒 Pro)</span>
                            <span class="text-gray-400">↵</span>
                          </button>
                        </div>
                      </div>

                      <!-- Section Export -->
                      <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60">
                        <div class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                          <span class="text-base">📤</span> Export
                        </div>
                        <div class="space-y-2">
                          <button
                            class="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-sm font-medium text-gray-800 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
                            @click="triggerExportScreen"
                            :disabled="isExporting"
                          >
                            <span>🖼️ Exporter cet écran</span>
                            <span class="text-gray-400">↵</span>
                          </button>
                          <button
                            class="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-sm font-medium text-gray-800 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
                            @click="triggerExportDesign"
                            :disabled="isExporting"
                          >
                            <span>📦 Exporter ce design (zip)</span>
                            <span class="text-gray-400">↵</span>
                          </button>
                          <button
                            class="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-sm font-medium text-gray-800 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
                            @click="triggerExportAll"
                          >
                            <span>🌍 Exporter tous (🔒 Pro)</span>
                            <span class="text-gray-400">↵</span>
                          </button>
                        </div>
                      </div>

                      <!-- Section Réinitialisation -->
                      <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/60">
                        <div class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                          <span class="text-base">🔄</span> Réinitialisation
                        </div>
                        <div class="space-y-2">
                          <button
                            class="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-sm font-medium text-gray-800 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
                            @click="triggerResetScreen"
                          >
                            <span>↩️ Cet écran uniquement</span>
                            <span class="text-gray-400">↵</span>
                          </button>
                          <button
                            class="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-sm font-medium text-gray-800 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
                            @click="triggerResetDesign"
                          >
                            <span>🎨 Ce design complet</span>
                            <span class="text-gray-400">↵</span>
                          </button>
                          <button
                            class="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-sm font-medium text-gray-800 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
                            @click="triggerResetAll"
                          >
                            <span>⚠️ Tous les designs</span>
                            <span class="text-gray-400">↵</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Modale d'édition -->
                <EditModal
                :isOpen="isEditModalOpen"
                :screenData="currentScreenData"
                :designConfig="selectedDesign ? designConfigs[selectedDesign] : null"
                :screenFontEdit="currentScreenFontEdit"
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
                
                <!-- Modal d'authentification -->
                <AuthModal
                :isOpen="isAuthModalOpen"
                @close="closeAuthModal"
                @success="handleAuthSuccess"
                />
                    </div> <!-- Close #previewfast-app -->
                </section>
            </div>
            <!-- Close container-builder -->
          </div>
        </div>
      </div>
    </main>

    <LandingNewsletter />
    <LandingFooter />
    
  </div> <!-- Close min-h-screen wrapper -->
</template>

<script>
// Import styles.css uniquement pour le Builder
import '/styles.css';

import Design1 from '../components/designs/Design1.vue';
import Design2 from '../components/designs/Design2.vue';
import Design3 from '../components/designs/Design3.vue';
import Design4 from '../components/designs/Design4.vue';
import Design5 from '../components/designs/Design5.vue';
import Design6 from '../components/designs/Design6.vue';
import Design7 from '../components/designs/Design7.vue';
import EditModal from '../components/EditModal.vue';
import DuplicateModal from '../components/DuplicateModal.vue';
import PresetModal from '../components/PresetModal.vue';
import UpgradeModal from '../components/UpgradeModal.vue';
import AuthModal from '../components/AuthModal.vue';
import BillingButton from '../components/BillingButton.vue';
import LandingNav from '../components/landing/LandingNav.vue';
import LandingNewsletter from '../components/landing/LandingNewsletter.vue';
import LandingFooter from '../components/landing/LandingFooter.vue';
import ScreenshotUploader from '../components/ScreenshotUploader.vue';


// Import du module de persistance
import { saveDesignState, loadDesignState, resetDesignState } from '../utils/persistence.js';

// Import du MODULE 11 : Export Service (couche métier)
import exportService from '../services/exportService.js';

// Import du MODULE 12 : Plan Guards + Toast System
import planGuards from '../utils/planGuards.js';
import toast, { initToastContainer } from '../utils/toast.js';

// Import du système de plans
import { getUserPlan, isPro, canExport, getRemainingExports, getExportCount } from '../utils/planManager.js';
import { canAccess } from '../utils/plans.config.js';

// Import des services d'authentification et de synchronisation
import authService from '../services/authService.js';
import syncService from '../services/syncService.js';

// Import des configs JSON
import design1Config from '../../configs/designs/design-1.json';
import design2Config from '../../configs/designs/design-2.json';
import design3Config from '../../configs/designs/design-3.json';
import design4Config from '../../configs/designs/design-4.json';
import design5Config from '../../configs/designs/design-5.json';
import design6Config from '../../configs/designs/design-6.json';
import design7Config from '../../configs/designs/design-7.json';

const SCREEN_FONT_KEY = '__screenFont__'
const FONT_LIBRARY = {
  inter: { googleFamily: 'Inter:wght@400;500;600;700', cssFamily: "'Inter', sans-serif" },
  manrope: { googleFamily: 'Manrope:wght@400;500;600;700;800', cssFamily: "'Manrope', sans-serif" },
  'playfair-display': { googleFamily: 'Playfair+Display:wght@400;500;600;700', cssFamily: "'Playfair Display', serif" },
  'cormorant-garamond': { googleFamily: 'Cormorant+Garamond:wght@400;500;600;700', cssFamily: "'Cormorant Garamond', serif" },
  montserrat: { googleFamily: 'Montserrat:wght@500;600;700;800', cssFamily: "'Montserrat', sans-serif" },
  'bebas-neue': { googleFamily: 'Bebas+Neue', cssFamily: "'Bebas Neue', sans-serif" },
  'dm-sans': { googleFamily: 'DM+Sans:wght@400;500;700', cssFamily: "'DM Sans', sans-serif" },
  poppins: { googleFamily: 'Poppins:wght@400;500;600;700', cssFamily: "'Poppins', sans-serif" },
  fredoka: { googleFamily: 'Fredoka:wght@400;500;600;700', cssFamily: "'Fredoka', sans-serif" },
  'baloo-2': { googleFamily: 'Baloo+2:wght@400;500;600;700', cssFamily: "'Baloo 2', cursive" }
}

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
    UpgradeModal,
    AuthModal,
    BillingButton,
    LandingNav,
    LandingNewsletter,
    LandingFooter,
    ScreenshotUploader
  },
  data() {
    return {
      selectedDesign: null,
      selectedScreenId: null,
      isEditModalOpen: false,
      isEditDropdownOpen: false, // État du dropdown d'édition
      isDuplicateModalOpen: false, // État de la modal de duplication
      isPresetModalOpen: false, // État de la modal des presets
      isUpgradeModalOpen: false, // État de la modal d'upgrade
      isAuthModalOpen: false, // État de la modal d'authentification
      upgradeFeature: null, // Fonctionnalité à débloquer
      isExporting: false, // État d'export
      exportQuotaInfo: null, // Informations sur le quota d'export
      isResetDropdownOpen: false, // État du dropdown de réinitialisation
      isActionsModalOpen: false, // Modale unique d'actions
      userPlan: 'free', // Plan utilisateur (free/pro)
      isAuthenticated: false, // État d'authentification
      userEmail: null, // Email de l'utilisateur connecté
      syncStatus: {
        isAuthenticated: false,
        hasMigrated: false,
        lastSyncTime: null,
        syncing: false,
      },
      syncDebounceTimer: null, // Timer pour debounce de sync
      assetsReady: false, // Contrôle l'affichage des maquettes quand tout est chargé
      designConfigs: {
        'design-1': design1Config,
        'design-2': design2Config,
        'design-3': design3Config,
        'design-4': design4Config,
        'design-5': design5Config,
        'design-6': design6Config,
        'design-7': design7Config
      },
      loadedGoogleFonts: {},
      modifications: {}, // Store des modifications locales
      planGuards: planGuards // Expose planGuards pour le template
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
    },

    currentScreenFontEdit() {
      if (!this.selectedDesign || !this.selectedScreenId) {
        return null
      }

      const key = this.modKey(this.selectedDesign, this.selectedScreenId)
      const localEdits = this.modifications[key] || {}
      if (localEdits[SCREEN_FONT_KEY]) {
        return localEdits[SCREEN_FONT_KEY]
      }

      const savedState = loadDesignState(this.selectedDesign)
      const screenId = `screen-${this.selectedScreenId}`
      return savedState?.[screenId]?.[SCREEN_FONT_KEY] || null
    }
  },
  methods: {
    modKey(designId, screenId) {
      return `${designId}-screen-${screenId}`
    },

    storageKey(designId) {
      return `previewfaster_design_${designId}`
    },

    persistDesignStateObject(designId, state) {
      const key = this.storageKey(designId)
      if (!state || Object.keys(state).length === 0) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(state))
      }
    },

    getFontConfig(fontKey) {
      return FONT_LIBRARY[fontKey] || null
    },

    ensureGoogleFontLoaded(fontKey) {
      const fontConfig = this.getFontConfig(fontKey)
      if (!fontConfig || !fontConfig.googleFamily) return

      if (this.loadedGoogleFonts[fontKey]) {
        return
      }

      const linkId = `google-font-${fontKey}`
      if (document.getElementById(linkId)) {
        this.loadedGoogleFonts = { ...this.loadedGoogleFonts, [fontKey]: true }
        return
      }

      const link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?family=${fontConfig.googleFamily}&display=swap`
      document.head.appendChild(link)
      this.loadedGoogleFonts = { ...this.loadedGoogleFonts, [fontKey]: true }
    },

    applyScreenFontToElement(screenElement, screenConfig, fontKey) {
      const fontConfig = this.getFontConfig(fontKey)
      if (!fontConfig || !screenElement || !screenConfig) return

      this.ensureGoogleFontLoaded(fontKey)

      const textZones = (screenConfig.editableZones || []).filter((zone) => zone.type === 'text')
      textZones.forEach((zone) => {
        const targetElement = screenElement.querySelector(zone.selector)
        if (targetElement) {
          targetElement.style.fontFamily = fontConfig.cssFamily
        }
      })
    },

    async waitForMockups() {
      const mockupImgs = Array.from(document.querySelectorAll("img[src*='/assets/mockup']"))
      if (!mockupImgs.length) {
        this.assetsReady = true
        return
      }

      const pending = mockupImgs
        .filter((img) => !img.complete)
        .map((img) => new Promise((resolve) => {
          img.onload = () => resolve()
          img.onerror = () => resolve()
        }))

      if (pending.length === 0) {
        this.assetsReady = true
        return
      }

      const timeout = new Promise((resolve) => setTimeout(resolve, 800))
      await Promise.race([Promise.all(pending), timeout])
      this.assetsReady = true
    },

    async loadExportQuota() {
      try {
        this.exportQuotaInfo = await exportService.getExportQuota()
      } catch (error) {
        console.error('Erreur lors du chargement du quota:', error)
      }
    },
    
    handleClickOutside(event) {
      // Fermer le dropdown de réinitialisation si on clique en dehors
      if (this.isResetDropdownOpen) {
        const resetDropdown = document.querySelector('[data-dropdown="reset"]')?.closest('.relative')
        if (resetDropdown && !resetDropdown.contains(event.target)) {
          this.isResetDropdownOpen = false
        }
      }
      
      // Fermer le dropdown d'édition si on clique en dehors
      if (this.isEditDropdownOpen) {
        const editDropdown = document.querySelector('[data-dropdown="edit"]')?.closest('.relative')
        if (editDropdown && !editDropdown.contains(event.target)) {
          this.isEditDropdownOpen = false
        }
      }
    },

    openActionsModal() {
      this.isActionsModalOpen = true
    },

    closeActionsModal() {
      this.isActionsModalOpen = false
    },
    
    handleScreenSelection(designId, screenNum) {
      this.selectedDesign = designId
      this.selectedScreenId = screenNum
    },

    triggerEdit() {
      this.closeActionsModal()
      this.openEditModal()
    },

    triggerDuplicate() {
      this.closeActionsModal()
      this.handleDuplicateClick()
    },

    triggerApplyAll() {
      this.closeActionsModal()
      if (!planGuards.canApplyToAllScreens()) {
        this.openUpgradeModal('applyToAllScreens')
        return
      }
      // S'il n'y a pas d'édition en cours, on avertit simplement.
      toast.info('Appliquer à tous nécessite des modifications sur un écran source.')
    },

    triggerPreset() {
      this.closeActionsModal()
      this.openPresetModal()
    },

    triggerExportScreen() {
      this.closeActionsModal()
      this.handleExportScreen()
    },

    triggerExportDesign() {
      this.closeActionsModal()
      this.handleExportAllScreens()
    },

    triggerExportAll() {
      this.closeActionsModal()
      this.openUpgradeModal('exportAllDesigns')
    },

    triggerResetScreen() {
      this.closeActionsModal()
      this.resetCurrentScreen()
    },

    triggerResetDesign() {
      this.closeActionsModal()
      this.resetCurrentDesign()
    },

    triggerResetAll() {
      this.closeActionsModal()
      this.resetAllDesigns()
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
      // ⛔ Guard: Vérifier le plan avant d'ouvrir la création de preset
      if (!planGuards.canCreateDesignPreset()) {
        return
      }
      
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
        toast.error('Preset invalide')
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
      
      // Synchroniser avec le cloud si authentifié
      this.debouncedSync()
      
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
      
      // ⛔ Guard: Vérifier le plan avant d'appliquer le preset à tout le design
      if (!planGuards.canApplyToAllScreens()) {
        return
      }
      
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
      
      // ⛔ Guard: Vérifier le plan avant de dupliquer
      if (!planGuards.canDuplicateScreen()) {
        return
      }
      
      // Récupérer l'état source
      const sourceKey = this.modKey(this.selectedDesign, this.selectedScreenId)
      const sourceState = this.modifications[sourceKey] || loadDesignState(this.selectedDesign)?.[`screen-${this.selectedScreenId}`]
      
      if (!sourceState) {
        toast.warning('Aucune modification à dupliquer')
        return
      }
      
      // Copier l'état vers la cible
      const targetKey = this.modKey(this.selectedDesign, targetScreen)
      this.modifications[targetKey] = { ...sourceState }
      
      // Sauvegarder dans localStorage
      const screenId = `screen-${targetScreen}`
      saveDesignState(this.selectedDesign, screenId, sourceState)
      
      // Synchroniser avec le cloud si authentifié
      this.debouncedSync()
      
      // Fermer la modal
      this.closeDuplicateModal()
      
      // Recharger la page pour appliquer visuellement
      window.location.reload()
      
      console.log(`✅ Écran ${this.selectedScreenId} dupliqué vers écran ${targetScreen}`)
    },
    
    applyChanges(edits) {
      // Stocker les modifications
      const key = this.modKey(this.selectedDesign, this.selectedScreenId)
      this.modifications[key] = edits
      
      // Appliquer les modifications au DOM
      this.applyModificationsToDOM(edits)
      
      // Sauvegarder automatiquement dans localStorage
      if (this.selectedDesign && this.selectedScreenId) {
        const screenId = `screen-${this.selectedScreenId}`
        saveDesignState(this.selectedDesign, screenId, edits)
      }
      
      // Synchroniser avec le cloud si authentifié
      this.debouncedSync()
    },
    
    applyChangesToAll(edits) {
      if (!this.selectedDesign) return
      
      // ⛔ Guard: Vérifier le plan avant "Appliquer à tous"
      if (!planGuards.canApplyToAllScreens()) {
        return
      }
      
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
          const zoneExists = zoneId === SCREEN_FONT_KEY || screen.editableZones.some(z => z.id === zoneId)
          if (zoneExists) {
            compatibleEdits[zoneId] = edits[zoneId]
          }
        })
        
        // Si des éditions compatibles existent, les sauvegarder
        if (Object.keys(compatibleEdits).length > 0) {
          const key = this.modKey(this.selectedDesign, screenNum)
          
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
      
      // Synchroniser avec le cloud si authentifié
      this.debouncedSync()
      
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

      if (edits[SCREEN_FONT_KEY]?.type === 'screen-font' && edits[SCREEN_FONT_KEY]?.value) {
        this.applyScreenFontToElement(screenElement, this.currentScreenData, edits[SCREEN_FONT_KEY].value)
      }
      
      Object.keys(edits).forEach(zoneId => {
        if (zoneId === SCREEN_FONT_KEY) {
          return
        }

        const edit = edits[zoneId]
        const zone = this.currentScreenData.editableZones.find(z => z.id === zoneId)
        
        if (!zone) {
          console.warn(`[App] Zone not found: ${zoneId}`)
          return
        }

        if (zone.type === 'image' && zone.id.toLowerCase().includes('mockup')) {
          console.warn(`[App] Modification ignorée sur mockup: ${zoneId}`)
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
      const key = this.modKey(this.selectedDesign, this.selectedScreenId)
      const legacyKey = `${this.selectedDesign}_screen-${this.selectedScreenId}`

      // Supprimer de l'état local
      if (this.modifications[key]) {
        delete this.modifications[key]
      }
      if (this.modifications[legacyKey]) {
        delete this.modifications[legacyKey]
      }
      
      // Supprimer du localStorage
      const savedState = loadDesignState(this.selectedDesign)
      const screenKey = `screen-${this.selectedScreenId}`
      if (savedState && savedState[screenKey]) {
        delete savedState[screenKey]
        this.persistDesignStateObject(this.selectedDesign, savedState)
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
      const warningText = totalModifications > 0
        ? `🚨 Réinitialiser TOUS les designs : ${totalModifications} modification(s) seront supprimées.`
        : '🚨 Réinitialiser TOUS les designs (35 écrans).'

      toast.warning(warningText, {
        duration: 8000,
        action: 'Confirmer',
        onAction: () => this.performResetAllDesigns()
      })
    },

    performResetAllDesigns() {
      Object.keys(this.designConfigs).forEach(designId => {
        resetDesignState(designId)
      })

      this.modifications = {}
      window.location.reload()
      console.log(`✅ Tous les designs ont été réinitialisés`)
    },
    
    /**
     * 🎯 MODULE 11 : Export d'un écran unique
     * Utilise la couche métier exportService
     */
    async handleExportScreen() {
      if (!this.selectedDesign || !this.selectedScreenId) {
        toast.warning('Veuillez sélectionner un écran avant d\'exporter')
        return
      }
      
      this.isExporting = true
      let progressMessage = ''
      
      try {
        // Appel de la couche métier centralisée
        const result = await exportService.requestExport({
          type: exportService.EXPORT_TYPE.SINGLE,
          designId: this.selectedDesign,
          screenId: this.selectedScreenId,
          onProgress: (progress) => {
            // Feedback visuel en temps réel
            progressMessage = progress.message
            console.log(`[App] Export progress: ${progress.status} - ${progress.message}`)
            
            if (progress.status === exportService.EXPORT_STATUS.QUOTA_EXCEEDED) {
              // Quota dépassé : ouvrir la modal d'upgrade
              this.openUpgradeModal('exportLimit')
            }
          }
        })
        
        // Mise à jour de l'affichage du compteur
        this.$forceUpdate()
        
        // Feedback de succès adapté
        const quota = exportService.getExportQuota()
        let message = '✅ Export réussi !'
        
        if (!quota.unlimited && quota.remaining !== null) {
          if (quota.remaining === 0) {
            message += '\n\n🚫 Vous avez atteint la limite de 5 exports gratuits.'
            message += '\n💎 Passez PRO pour des exports illimités en HD !'
            
            // Ouvrir automatiquement la modal d'upgrade
            setTimeout(() => this.openUpgradeModal('exportLimit'), 500)
          } else if (quota.remaining <= 2) {
            message += `\n\n⚠️ Attention : il vous reste ${quota.remaining} export(s) gratuit(s).`
          } else {
            message += `\n\n📊 Exports restants : ${quota.remaining}/5`
          }
        }
        
        if (result.data.watermarkApplied) {
          message += '\n\n💧 Watermark appliqué (version FREE)'
        }
        
        toast.success(message.replace(/\n\n/g, ' - '))
        
        // Recharger le quota après l'export
        await this.loadExportQuota()
        
      } catch (error) {
        console.error('❌ Erreur d\'export:', error)
        
        // Gestion des erreurs avec messages clairs
        if (error.message.startsWith('QUOTA_EXCEEDED:')) {
          this.openUpgradeModal('exportLimit')
        } else {
          toast.error(`Erreur lors de l'export: ${error.message}`)
        }
      } finally {
        this.isExporting = false
      }
    },
    
    /**
     * 🎯 MODULE 11 : Export de tous les écrans d'un design
     * Utilise la couche métier exportService
     */
    async handleExportAllScreens() {
      if (!this.selectedDesign) {
        toast.warning('Veuillez sélectionner un design avant d\'exporter')
        return
      }
      
      this.isExporting = true
      
      try {
        const config = this.designConfigs[this.selectedDesign]
        
        // Appel de la couche métier centralisée
        const result = await exportService.requestExport({
          type: exportService.EXPORT_TYPE.ALL,
          designId: this.selectedDesign,
          designConfig: config,
          onProgress: (progress) => {
            console.log(`[App] Export all progress: ${progress.status} - ${progress.message}`)
            
            if (progress.status === exportService.EXPORT_STATUS.QUOTA_EXCEEDED) {
              this.openUpgradeModal('exportLimit')
            }
          }
        })
        
        // Mise à jour de l'affichage
        this.$forceUpdate()
        
        // Feedback de succès
        const quota = exportService.getExportQuota()
        let message = `✅ Export réussi !\n\n${result.data.screenCount} écran(s) exporté(s) en ZIP`
        
        if (result.data.watermarkApplied) {
          message += '\n\n💧 Watermarks appliqués (version FREE)'
        }
        
        if (!quota.unlimited && quota.remaining !== null) {
          message += `\n\n📊 Exports restants : ${quota.remaining}/5`
        }
        
        toast.success(message.replace(/\n\n/g, ' - '))
        
        // Recharger le quota après l'export
        await this.loadExportQuota()
        
      } catch (error) {
        console.error('❌ Erreur d\'export:', error)
        
        if (error.message.startsWith('QUOTA_EXCEEDED:')) {
          this.openUpgradeModal('exportLimit')
        } else {
          toast.error(`Erreur lors de l'export: ${error.message}`)
        }
      } finally {
        this.isExporting = false
      }
    },
    
    // ============================================
    // MÉTHODES D'AUTHENTIFICATION
    // ============================================
    
    async initAuth() {
      // Vérifier si on est sur la page de vérification magic link
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        // On est dans le callback du magic link
        await this.verifyMagicLinkToken(token);
        return;
      }
      
      // Sinon, vérifier si l'utilisateur est déjà authentifié
      this.isAuthenticated = authService.isAuthenticated();
      
      if (this.isAuthenticated) {
        this.userEmail = authService.getUserEmail();
        this.syncStatus = syncService.getSyncStatus();
        
        // Charger les données du cloud au démarrage
        try {
          await syncService.loadCloudData();
          this.syncStatus = syncService.getSyncStatus();
          console.log('✅ Données chargées depuis le cloud');
        } catch (error) {
          console.error('Erreur chargement cloud:', error);
          // Continuer même si erreur (mode hors ligne)
        }
      }
    },
    
    async verifyMagicLinkToken(token) {
      try {
        // Afficher un message de chargement (on pourrait aussi afficher une modal)
        console.log('🔐 Vérification du magic link...');
        
        // Vérifier le token
        const result = await authService.verifyMagicLink(token);
        
        if (!result.success) {
          throw new Error('Token invalide');
        }
        
        // Migration automatique si première connexion
        let migrationDone = false;
        if (!syncService.hasMigrated()) {
          console.log('📦 Migration des données locales...');
          await syncService.migrateLocalData();
          migrationDone = true;
        } else {
          // Sinon, charger les données du cloud
          await syncService.loadCloudData();
        }
        
        // Mettre à jour l'état
        this.isAuthenticated = true;
        this.userEmail = authService.getUserEmail();
        this.syncStatus = syncService.getSyncStatus();

        window.dispatchEvent(new CustomEvent('auth-updated'));
        
        // Nettoyer l'URL (retirer le token)
        window.history.replaceState({}, document.title, '/atelier');
        
        // Afficher un message de succès
        const message = migrationDone 
          ? '✅ Connexion réussie ! Vos projets ont été (ou vont être désormais) sauvegardés dans le cloud.'
          : '✅ Connexion réussie ! Vos données ont été chargées (ou vont l\'être désormais).';
        
        toast.success(message.replace(/\n/g, ' - '));
        
        // Pas de reload automatique pour conserver le toast et rester sur /atelier
      } catch (error) {
        console.error('❌ Erreur vérification magic link:', error);
        toast.error('Erreur de connexion : ' + error.message);
        
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, '/atelier');
      }
    },
    
    openAuthModal() {
      this.isAuthModalOpen = true;
    },

    handleOpenAuthEvent() {
      this.openAuthModal();
    },
    
    closeAuthModal() {
      this.isAuthModalOpen = false;
    },
    
    async handleAuthSuccess(data) {
      console.log('✅ Authentification réussie:', data);
      
      // Mettre à jour l'état
      this.isAuthenticated = true;
      this.userEmail = data.email;
      this.syncStatus = syncService.getSyncStatus();

      window.dispatchEvent(new CustomEvent('auth-updated'));
      
      // Fermer la modal
      this.closeAuthModal();
      
      // Recharger la page pour appliquer les données du cloud
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    
    async handleLogout() {
      if (!confirm('Voulez-vous vraiment vous déconnecter ? Vos données locales seront conservées.')) {
        return;
      }
      
      authService.logout();
      this.isAuthenticated = false;
      this.userEmail = null;
      this.syncStatus = { isSyncing: false, lastSyncTime: null };
      this.isUserMenuOpen = false;
      
      toast.success('Déconnecté avec succès');
    },
    
    /**
     * Vérifier si on revient de Stripe Checkout (success ou canceled)
     */
    checkStripeReturn() {
      const urlParams = new URLSearchParams(window.location.search);
      
      // Success
      if (urlParams.has('session_id')) {
        const sessionId = urlParams.get('session_id');
        console.log(`[Stripe] Retour de checkout (session: ${sessionId})`)
        
        // Afficher un message de succès
        toast.success('🎉 Abonnement activé ! Votre statut sera mis à jour dans quelques instants.', { duration: 5000 })
        
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname)
        
        // Recharger après 3 secondes pour récupérer le nouveau statut
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      }
      
      // Canceled
      if (urlParams.has('canceled') && urlParams.get('canceled') === 'true') {
        console.log('[Stripe] Checkout annulé')
        toast.warning('Paiement annulé. Vous pouvez réessayer à tout moment.')
        
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    },
    
    async handleLogout() {
      if (!confirm('Voulez-vous vraiment vous déconnecter ? Vos données locales seront conservées.')) {
        return;
      }
      
      authService.logout();
      this.isAuthenticated = false;
      this.userEmail = null;
      this.syncStatus = { isSyncing: false, lastSyncTime: null };
      
      toast.success('Déconnexion réussie');
    },
    
    formatSyncTime(timestamp) {
      if (!timestamp) return 'jamais';
      
      const now = Date.now();
      const diff = now - timestamp;
      
      if (diff < 60000) return 'à l\'instant';
      if (diff < 3600000) return `il y a ${Math.floor(diff / 60000)} min`;
      if (diff < 86400000) return `il y a ${Math.floor(diff / 3600000)} h`;
      return `il y a ${Math.floor(diff / 86400000)} j`;
    },
    
    /**
     * Synchronisation avec debounce (2 secondes)
     * Évite de bombarder le serveur à chaque modification
     */
    debouncedSync() {
      // Ne rien faire si non authentifié
      if (!this.isAuthenticated) return;
      
      // Annuler le timer précédent
      if (this.syncDebounceTimer) {
        clearTimeout(this.syncDebounceTimer);
      }
      
      // Lancer un nouveau timer
      this.syncDebounceTimer = setTimeout(async () => {
        try {
          console.log('[App] 🔄 Synchronisation avec le cloud...');
          await syncService.syncProjects();
          this.syncStatus = syncService.getSyncStatus();
          console.log('[App] ✅ Synchronisation réussie');
        } catch (error) {
          console.error('[App] ❌ Erreur synchronisation:', error);
        }
      }, 2000); // 2 secondes de délai
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

            if (edits[SCREEN_FONT_KEY]?.type === 'screen-font' && edits[SCREEN_FONT_KEY]?.value) {
              this.applyScreenFontToElement(screenElement, screen, edits[SCREEN_FONT_KEY].value)
            }
            
            // Appliquer chaque modification
            Object.keys(edits).forEach(zoneId => {
              if (zoneId === SCREEN_FONT_KEY) {
                return
              }

              const edit = edits[zoneId]
              const zone = screen.editableZones.find(z => z.id === zoneId)
              
              if (!zone) return

              if (zone.type === 'image' && zone.id.toLowerCase().includes('mockup')) {
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
              
              if (!targetElement) return
              
              // Appliquer selon le type
              if (zone.type === 'background') {
                if (edit.type === 'color' || edit.type === 'gradient') {
                  targetElement.style.background = edit.value
                  targetElement.style.backgroundImage = ''
                } else if (edit.type === 'backgroundImage-url' || edit.type === 'backgroundImage-upload' || edit.type === 'backgroundImage') {
                  if (edit.value) {
                    targetElement.style.backgroundImage = `url(${edit.value})`
                    targetElement.style.backgroundSize = 'cover'
                    targetElement.style.backgroundPosition = 'center'
                    targetElement.style.backgroundRepeat = 'no-repeat'
                  } else {
                    targetElement.style.backgroundImage = ''
                  }
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
            const modKey = this.modKey(designId, screenNum)
            this.modifications[modKey] = edits
          })
        })
      })
    }
  },

  mounted() {
    // MODULE 12 : Initialiser le conteneur de toasts
    initToastContainer();
    
    // Écouter les événements d'upgrade depuis les guards
    window.addEventListener('open-upgrade-modal', (event) => {
      const feature = event.detail?.feature
      this.openUpgradeModal(feature)
    });

    window.addEventListener('open-auth-modal', this.handleOpenAuthEvent)
    
    // Charger le plan utilisateur
    this.userPlan = getUserPlan();
    console.log(`[App] Plan utilisateur: ${this.userPlan}`);
    
    // MODULE 11 & 12 : Charger le quota d'export
    this.loadExportQuota();
    
    // Initialiser l'authentification
    this.initAuth();
    
    // Vérifier si on revient de Stripe Checkout (success)
    this.checkStripeReturn();
    
    // Restaurer les modifications sauvegardées
    this.$nextTick(() => {
      this.restoreAllDesigns();
      this.waitForMockups();
    });
    
    // Fermer le dropdown si on clique ailleurs
    document.addEventListener('click', this.handleClickOutside);
  },
  
  beforeUnmount() {
    // Nettoyer le listener
    window.removeEventListener('open-auth-modal', this.handleOpenAuthEvent)
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>

<style scoped>
.actions-fab {
  animation: fab-slide-up 0.35s ease-out;
}

.builder-loaded {
  opacity: 1;
}

@keyframes fab-slide-up {
  from {
    transform: translateY(16px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
