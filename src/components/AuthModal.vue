<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
    @click.self="handleClose"
  >
    <div class="relative w-full max-w-md">
      <div class="relative rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700 md:px-6 md:py-4">
          <h3 class="text-xl font-medium text-gray-900 dark:text-white">{{ stepTitle }}</h3>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            @click="handleClose"
            aria-label="Fermer"
          >
            <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6m0 12L6 6" />
            </svg>
            <span class="sr-only">Fermer la modal</span>
          </button>
        </div>

        <div class="space-y-5 px-4 py-5 md:px-6 md:py-6">
          <!-- Étape 1 : Saisie email -->
          <div v-if="step === 'email'" class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Connectez-vous pour sauvegarder vos projets dans le cloud et y accéder depuis n'importe quel appareil.
            </p>

            <form class="space-y-4" @submit.prevent="handleSendMagicLink">
              <div class="space-y-2">
                <label for="email" class="block text-sm font-medium text-gray-900 dark:text-white">Votre email</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="votre@email.com"
                  required
                  :disabled="loading"
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-600/40"
                />
              </div>

              <p v-if="error" class="error-message">{{ error }}</p>

              <button type="submit" class="btn-primary w-full" :disabled="loading || !email">
                <span v-if="loading">Envoi en cours...</span>
                <span v-else>Envoyer le lien magique</span>
              </button>
            </form>

            <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <p class="font-semibold">Pas de mot de passe requis</p>
              <p class="mt-1 text-sm">Nous vous enverrons un lien de connexion sécurisé par email.</p>
            </div>
          </div>

          <!-- Étape 2 : Email envoyé -->
          <div v-else-if="step === 'sent'" class="space-y-3 text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">✉️</div>
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Magic link envoyé !</h3>
              <p class="text-sm text-gray-700 dark:text-gray-200">Vérifiez votre boîte mail <strong>{{ email }}</strong></p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Cliquez sur le lien, il expire dans 15 minutes.</p>
            </div>
            <button class="btn-secondary w-full" @click="resetForm">Utiliser un autre email</button>
          </div>

          <!-- Étape 3 : Migration en cours -->
          <div v-else-if="step === 'migrating'" class="space-y-3 text-center">
            <div class="mx-auto h-12 w-12">
              <div class="loader" aria-hidden="true"></div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Migration de vos données...</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">Vos projets locaux sont en cours de sauvegarde dans le cloud.</p>
          </div>

          <!-- Étape 4 : Succès -->
          <div v-else-if="step === 'success'" class="space-y-3 text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-xl text-green-600 dark:bg-green-900/40 dark:text-green-200">✅</div>
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Connexion réussie !</h3>
              <p class="text-sm text-gray-700 dark:text-gray-200">Bienvenue <strong>{{ userEmail }}</strong></p>
              <p v-if="migrationDone" class="text-sm text-gray-500 dark:text-gray-400">Vos projets ont été sauvegardés dans le cloud.</p>
            </div>
            <button class="btn-primary w-full" @click="handleClose">Continuer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService.js';
import syncService from '../services/syncService.js';

export default {
  name: 'AuthModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'success'],
  data() {
    return {
      step: 'email', // 'email' | 'sent' | 'migrating' | 'success'
      email: '',
      loading: false,
      error: null,
      userEmail: null,
      migrationDone: false,
    };
  },
  computed: {
    stepTitle() {
      switch (this.step) {
        case 'email':
          return 'Connexion';
        case 'sent':
          return 'Vérifiez votre email';
        case 'migrating':
          return 'Migration en cours';
        case 'success':
          return 'Bienvenue !';
        default:
          return 'Connexion';
      }
    },
  },
  methods: {
    async handleSendMagicLink() {
      if (!this.email) return;

      this.loading = true;
      this.error = null;

      try {
        await authService.sendMagicLink(this.email);
        this.step = 'sent';
      } catch (error) {
        this.error = error.message || 'Erreur lors de l\'envoi du magic link';
      } finally {
        this.loading = false;
      }
    },

    async handleMigration() {
      this.step = 'migrating';

      try {
        // Migration automatique si première connexion
        if (!syncService.hasMigrated()) {
          await syncService.migrateLocalData();
          this.migrationDone = true;
        } else {
          // Sinon, charger les données du cloud
          await syncService.loadCloudData();
          this.migrationDone = false;
        }

        this.userEmail = authService.getUserEmail();
        this.step = 'success';

        // Notifier le parent
        this.$emit('success', {
          email: this.userEmail,
          migrated: this.migrationDone,
        });
      } catch (error) {
        console.error('Erreur migration:', error);
        this.error = 'Erreur lors de la migration des données';
        this.step = 'email';
      }
    },

    resetForm() {
      this.step = 'email';
      this.email = '';
      this.error = null;
      this.loading = false;
    },

    handleClose() {
      if (this.loading || this.step === 'migrating') {
        return; // Ne pas fermer pendant le chargement
      }
      this.resetForm();
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.error-message {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.28);
}

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 0.75rem;
  border: 2px solid #4f46e5;
  background: white;
  color: #4f46e5;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #eef2ff;
}

.loader {
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  border: 4px solid #e5e7eb;
  border-top-color: #4f46e5;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
