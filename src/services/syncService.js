/**
 * Service de synchronisation
 * Gère la migration localStorage → cloud et la synchronisation bidirectionnelle
 */

import authService from './authService.js';
import { getDesigns, saveDesigns } from '../utils/designsStore.js';
import { getAllPresets, saveAllPresets } from '../utils/presets.js';
import { getUserPlan, setUserPlan, getExportCount } from '../utils/planManager.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const MIGRATION_KEY = 'previewfaster_has_migrated';

class SyncService {
  constructor() {
    this.syncing = false;
    this.lastSyncTime = null;
  }

  /**
   * Vérifier si la migration a déjà été effectuée
   * @returns {boolean}
   */
  hasMigrated() {
    return localStorage.getItem(MIGRATION_KEY) === 'true';
  }

  /**
   * Marquer la migration comme effectuée
   */
  markMigrated() {
    localStorage.setItem(MIGRATION_KEY, 'true');
  }

  /**
   * Migration : Envoyer toutes les données localStorage vers le cloud
   * Cette fonction est appelée lors de la première connexion
   * @returns {Promise<boolean>} - True si migration réussie
   */
  async migrateLocalData() {
    if (!authService.isAuthenticated()) {
      throw new Error('Non authentifié');
    }

    if (this.hasMigrated()) {
      console.log('Migration déjà effectuée');
      return true;
    }

    try {
      // Récupérer toutes les données locales
      const designs = getDesigns();
      const presets = getAllPresets();
      const plan = getUserPlan();
      const exportCount = getExportCount();

      // Envoyer vers le backend
      const response = await fetch(`${API_URL}/api/user/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify({
          projects: designs,
          presets: presets,
          plan: plan,
          exportCount: exportCount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la migration');
      }

      // Marquer comme migré
      this.markMigrated();
      this.lastSyncTime = Date.now();

      console.log('Migration réussie vers le cloud');
      return true;
    } catch (error) {
      console.error('Erreur migration:', error);
      throw error;
    }
  }

  /**
   * Charger les données depuis le cloud et les écrire en localStorage
   * Utilisé lors de la connexion sur un nouveau device
   * @param {boolean} force - Forcer le téléchargement même si déjà migré
   * @returns {Promise<object>} - Les données chargées
   */
  async loadCloudData(force = false) {
    if (!authService.isAuthenticated()) {
      throw new Error('Non authentifié');
    }

    try {
      const response = await fetch(`${API_URL}/api/user/data`, {
        headers: {
          ...authService.getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement des données');
      }

      // Écrire dans localStorage (écrase les données locales)
      if (data.projects) {
        saveDesigns(data.projects);
      }

      if (data.presets) {
        saveAllPresets(data.presets);
      }

      // Mettre à jour le plan depuis le serveur (source de vérité)
      if (data.user?.plan) {
        setUserPlan(data.user.plan);
      }

      this.lastSyncTime = Date.now();

      console.log('Données chargées depuis le cloud');
      return data;
    } catch (error) {
      console.error('Erreur loadCloudData:', error);
      throw error;
    }
  }

  /**
   * Synchroniser les projets (designs) vers le cloud
   * Appelé après chaque modification de projet
   * @returns {Promise<boolean>}
   */
  async syncProjects() {
    if (!authService.isAuthenticated()) {
      return false; // Pas d'erreur, on travaille juste hors ligne
    }

    if (this.syncing) {
      return false; // Éviter les syncs concurrents
    }

    try {
      this.syncing = true;

      const designs = getDesigns();
      const presets = getAllPresets();
      const plan = getUserPlan();
      const exportCount = getExportCount();

      const response = await fetch(`${API_URL}/api/user/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify({
          projects: designs,
          presets: presets,
          plan: plan,
          exportCount: exportCount,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la synchronisation');
      }

      this.lastSyncTime = Date.now();
      return true;
    } catch (error) {
      console.error('Erreur syncProjects:', error);
      return false;
    } finally {
      this.syncing = false;
    }
  }

  /**
   * Synchroniser les presets vers le cloud
   * @returns {Promise<boolean>}
   */
  async syncPresets() {
    // Utilise la même logique que syncProjects car on envoie tout d'un coup
    return this.syncProjects();
  }

  /**
   * Mettre à jour le plan sur le serveur
   * @param {string} plan - 'free' ou 'pro'
   * @returns {Promise<boolean>}
   */
  async syncPlan(plan) {
    if (!authService.isAuthenticated()) {
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/plan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour du plan');
      }

      return true;
    } catch (error) {
      console.error('Erreur syncPlan:', error);
      return false;
    }
  }

  /**
   * Incrémenter le compteur d'exports sur le serveur
   * @returns {Promise<number|null>} - Le nouveau compteur ou null si échec
   */
  async syncExportCount() {
    if (!authService.isAuthenticated()) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/export`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la synchronisation des exports');
      }

      return data.exportCount;
    } catch (error) {
      console.error('Erreur syncExportCount:', error);
      return null;
    }
  }

  /**
   * Synchronisation complète (projets + presets + plan + exports)
   * Utilisé après la migration ou lors d'un refresh explicite
   * @returns {Promise<boolean>}
   */
  async syncAll() {
    return this.syncProjects();
  }

  /**
   * Obtenir le statut de la synchronisation
   * @returns {object}
   */
  getSyncStatus() {
    return {
      isAuthenticated: authService.isAuthenticated(),
      hasMigrated: this.hasMigrated(),
      lastSyncTime: this.lastSyncTime,
      syncing: this.syncing,
    };
  }
}

export default new SyncService();
