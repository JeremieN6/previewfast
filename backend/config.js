/**
 * Configuration des variables d'environnement
 * Ce fichier DOIT être importé en premier dans server.js
 * pour garantir que process.env est peuplé avant les autres imports
 */
import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envLocalPath = join(__dirname, '.env.local')
const envPath = join(__dirname, '.env')

// Charger .env.local en priorité, sinon .env
if (existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath })
  console.log('[Config] ✅ Variables chargées depuis .env.local')
} else if (existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log('[Config] ✅ Variables chargées depuis .env')
} else {
  console.warn('[Config] ⚠️ Aucun fichier .env ou .env.local trouvé')
}

// Exporter pour satisfaire ESM
export default {}
