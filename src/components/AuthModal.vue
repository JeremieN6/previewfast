<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal">
      <div class="modal-header">
        <h2>{{ stepTitle }}</h2>
        <button class="close-button" @click="handleClose" aria-label="Fermer">×</button>
      </div>

      <div class="modal-body">
        <!-- Étape 1 : Saisie email -->
        <div v-if="step === 'email'" class="auth-step">
          <p class="description">
            Connectez-vous pour sauvegarder vos projets dans le cloud et y accéder depuis n'importe quel appareil.
          </p>

          <form @submit.prevent="handleSendMagicLink">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="votre@email.com"
                required
                :disabled="loading"
                autofocus
              />
            </div>

            <div v-if="error" class="error-message">
              {{ error }}
            </div>

            <button type="submit" class="btn-primary" :disabled="loading || !email">
              <span v-if="loading">Envoi en cours...</span>
              <span v-else>Envoyer le lien magique</span>
            </button>
          </form>

          <div class="info-box">
            <p><strong>Pas de mot de passe requis</strong></p>
            <p>Nous vous enverrons un lien de connexion sécurisé par email.</p>
          </div>
        </div>

        <!-- Étape 2 : Email envoyé -->
        <div v-else-if="step === 'sent'" class="auth-step success-step">
          <div class="success-icon">✉️</div>
          <h3>Magic link envoyé !</h3>
          <p class="success-message">
            Vérifiez votre boîte mail <strong>{{ email }}</strong>
          </p>
          <p class="hint">
            Cliquez sur le lien dans l'email pour vous connecter.<br>
            Le lien expire dans <strong>15 minutes</strong>.
          </p>

          <button class="btn-secondary" @click="resetForm">
            Utiliser un autre email
          </button>
        </div>

        <!-- Étape 3 : Migration en cours -->
        <div v-else-if="step === 'migrating'" class="auth-step">
          <div class="loading-spinner"></div>
          <h3>Migration de vos données...</h3>
          <p>Vos projets locaux sont en cours de sauvegarde dans le cloud.</p>
        </div>

        <!-- Étape 4 : Succès -->
        <div v-else-if="step === 'success'" class="auth-step success-step">
          <div class="success-icon">✅</div>
          <h3>Connexion réussie !</h3>
          <p class="success-message">
            Bienvenue <strong>{{ userEmail }}</strong>
          </p>
          <p v-if="migrationDone" class="hint">
            Vos projets ont été sauvegardés dans le cloud.
          </p>

          <button class="btn-primary" @click="handleClose">
            Continuer
          </button>
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-button:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 2rem 1.5rem;
}

.auth-step {
  text-align: center;
}

.description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.form-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  margin-top: 1rem;
}

.btn-secondary:hover {
  background: #f8f9ff;
}

.info-box {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9ff;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #555;
}

.info-box p {
  margin: 0.5rem 0;
}

.success-step {
  padding: 1rem 0;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-step h3 {
  color: #333;
  margin-bottom: 1rem;
}

.success-message {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1rem;
}

.hint {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
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
