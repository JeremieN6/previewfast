/**
 * Serveur backend PreviewFaster
 * 
 * Fonctionnalités:
 * - Auth magic link
 * - Stockage des données utilisateur
 * - Sync localStorage → cloud
 * - Gestion du plan Free/Pro
 * 
 * Port: 3001 (frontend sur 3000)
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { sendMagicLink, verifyMagicLink, verifyJWT, getUserInfo } from './authService.js'
import { saveUserData, getUserData, updateUserPlan, incrementUserExportCount } from './userDataService.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// ============================================================================
// ROUTES D'AUTHENTIFICATION
// ============================================================================

/**
 * POST /auth/send-link
 * Envoyer un magic link à l'utilisateur
 * Body: { email: string }
 */
app.post('/auth/send-link', async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({ error: 'Email requis' })
    }
    
    const result = await sendMagicLink(email)
    
    res.json(result)
  } catch (error) {
    console.error('[API] Erreur /auth/send-link:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /auth/verify?token=xxx
 * Vérifier le magic link et retourner un JWT
 */
app.get('/auth/verify', (req, res) => {
  try {
    const { token } = req.query
    
    if (!token) {
      return res.status(400).json({ error: 'Token requis' })
    }
    
    const result = verifyMagicLink(token)
    
    res.json(result)
  } catch (error) {
    console.error('[API] Erreur /auth/verify:', error)
    res.status(401).json({ error: error.message })
  }
})

/**
 * GET /auth/me
 * Obtenir les informations de l'utilisateur connecté
 */
app.get('/auth/me', verifyJWT, (req, res) => {
  try {
    const userInfo = getUserInfo(req.user.userId)
    res.json(userInfo)
  } catch (error) {
    console.error('[API] Erreur /auth/me:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================================
// ROUTES DE DONNÉES UTILISATEUR
// ============================================================================

/**
 * POST /api/user/data
 * Sauvegarder les données complètes de l'utilisateur
 * Body: { projects, presets, plan, exportCount }
 */
app.post('/api/user/data', verifyJWT, (req, res) => {
  try {
    const userId = req.user.userId
    const data = req.body
    
    const result = saveUserData(userId, data)
    
    res.json(result)
  } catch (error) {
    console.error('[API] Erreur /api/user/data (POST):', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/user/data
 * Récupérer toutes les données de l'utilisateur
 */
app.get('/api/user/data', verifyJWT, (req, res) => {
  try {
    const userId = req.user.userId
    
    const data = getUserData(userId)
    
    res.json(data)
  } catch (error) {
    console.error('[API] Erreur /api/user/data (GET):', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * PUT /api/user/plan
 * Mettre à jour le plan utilisateur
 * Body: { plan: 'free' | 'pro' }
 */
app.put('/api/user/plan', verifyJWT, (req, res) => {
  try {
    const userId = req.user.userId
    const { plan } = req.body
    
    if (!plan) {
      return res.status(400).json({ error: 'Plan requis' })
    }
    
    const result = updateUserPlan(userId, plan)
    
    res.json(result)
  } catch (error) {
    console.error('[API] Erreur /api/user/plan:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/user/export
 * Incrémenter le compteur d'exports
 */
app.post('/api/user/export', verifyJWT, (req, res) => {
  try {
    const userId = req.user.userId
    
    const result = incrementUserExportCount(userId)
    
    res.json(result)
  } catch (error) {
    console.error('[API] Erreur /api/user/export:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================================
// ROUTES DE SANTÉ
// ============================================================================

/**
 * GET /health
 * Vérifier l'état du serveur
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// ============================================================================
// GESTION DES ERREURS 404
// ============================================================================

app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' })
})

// ============================================================================
// DÉMARRAGE DU SERVEUR
// ============================================================================

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(80))
  console.log(`🚀 Backend PreviewFaster démarré sur http://localhost:${PORT}`)
  console.log('='.repeat(80))
  console.log(`📝 Mode: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📧 Email: ${process.env.EMAIL_SERVICE || 'console'} mode`)
  console.log(`🗄️  Database: ${process.env.DB_PATH || 'database.sqlite'}`)
  console.log('='.repeat(80) + '\n')
})

// Gérer l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n[Server] Arrêt en cours...')
  process.exit(0)
})
