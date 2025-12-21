/**
 * Base de données SQLite pour PreviewFaster
 * 
 * Structure:
 * - users: identité utilisateur minimale
 * - user_data: stockage clé-valeur des données utilisateur (projets, presets, etc.)
 * 
 * Pas de gestion d'abonnements ici (prévu pour Module 10 avec Stripe)
 */

import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite')

// Ouvrir la connexion
const db = new Database(dbPath, { verbose: console.log })

/**
 * Initialiser le schéma de la base de données
 */
export function initDatabase() {
  console.log('[DB] Initialisation de la base de données...')
  
  // Table des utilisateurs
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      plan TEXT DEFAULT 'free' CHECK(plan IN ('free', 'pro')),
      stripe_customer_id TEXT DEFAULT NULL,
      export_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // Table des données utilisateur (format clé-valeur flexible)
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      data_type TEXT NOT NULL CHECK(data_type IN ('project', 'preset', 'settings')),
      data_key TEXT NOT NULL,
      data_value TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, data_type, data_key)
    )
  `)
  
  // Index pour améliorer les performances
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_data_type ON user_data(data_type);
  `)
  
  // Table des tokens magic link (temporaires)
  db.exec(`
    CREATE TABLE IF NOT EXISTS magic_tokens (
      token TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      used BOOLEAN DEFAULT 0,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // Nettoyer les tokens expirés (routine)
  db.exec(`
    DELETE FROM magic_tokens 
    WHERE expires_at < datetime('now') OR used = 1
  `)
  
  console.log('[DB] ✅ Base de données initialisée')
}

/**
 * Obtenir l'instance de la base de données
 */
export function getDatabase() {
  return db
}

/**
 * Fermer la connexion (pour les tests ou l'arrêt propre)
 */
export function closeDatabase() {
  db.close()
  console.log('[DB] Connexion fermée')
}

// Initialiser au démarrage
initDatabase()

export default db
