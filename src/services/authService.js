/**
 * Service d'authentification
 * Gère la communication avec le backend pour l'authentification magic link
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const TOKEN_KEY = 'previewfaster_auth_token';

class AuthService {
  /**
   * Envoyer un magic link à l'email fourni
   * @param {string} email - L'email de l'utilisateur
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async sendMagicLink(email) {
    try {
      const response = await fetch(`${API_URL}/api/auth/send-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du magic link');
      }

      return data;
    } catch (error) {
      console.error('Erreur sendMagicLink:', error);
      throw error;
    }
  }

  /**
   * Vérifier un token magic link et obtenir le JWT
   * @param {string} token - Le token du magic link
   * @returns {Promise<{success: boolean, token: string, user: object}>}
   */
  async verifyMagicLink(token) {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Token invalide ou expiré');
      }

      // Sauvegarder le JWT
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }

      return data;
    } catch (error) {
      console.error('Erreur verifyMagicLink:', error);
      throw error;
    }
  }

  /**
   * Récupérer les informations de l'utilisateur connecté
   * @returns {Promise<object>} - Les infos utilisateur
   */
  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Si le token est invalide, le supprimer
        if (response.status === 401) {
          this.logout();
        }
        throw new Error(data.error || 'Erreur lors de la récupération des infos utilisateur');
      }

      return data;
    } catch (error) {
      console.error('Erreur getCurrentUser:', error);
      throw error;
    }
  }

  /**
   * Déconnecter l'utilisateur
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    // On garde les données locales au cas où l'utilisateur veut travailler hors ligne
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    // Vérifier si le token n'est pas expiré
    try {
      const payload = this.decodeToken(token);
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  }

  /**
   * Récupérer le token JWT
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Obtenir le header d'autorisation pour les requêtes API
   * @returns {object}
   */
  getAuthHeader() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * Décoder un JWT (sans vérification de signature)
   * @param {string} token - Le JWT à décoder
   * @returns {object} - Le payload décodé
   */
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erreur décodage token:', error);
      return null;
    }
  }

  /**
   * Récupérer l'email de l'utilisateur depuis le token
   * @returns {string|null}
   */
  getUserEmail() {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodeToken(token);
    return payload?.email || null;
  }

  /**
   * Récupérer l'ID de l'utilisateur depuis le token
   * @returns {string|null}
   */
  getUserId() {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodeToken(token);
    return payload?.userId || null;
  }
}

const authServiceInstance = new AuthService();

// Export default pour usage comme service
export default authServiceInstance;

// Exports nommés pour compatibilité
export const sendMagicLink = (email) => authServiceInstance.sendMagicLink(email);
export const verifyMagicLink = (token) => authServiceInstance.verifyMagicLink(token);
export const logout = () => authServiceInstance.logout();
export const isAuthenticated = () => authServiceInstance.isAuthenticated();
export const getAuthToken = () => authServiceInstance.getToken();
export const getCurrentUser = () => authServiceInstance.getCurrentUser();
export const getUserEmail = () => authServiceInstance.getUserEmail();
export const getUserId = () => authServiceInstance.getUserId();
