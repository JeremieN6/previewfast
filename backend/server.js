/**
 * Serveur backend PreviewFaster
 * 
 * Fonctionnalités:
 * - Auth magic link
 * - Stockage des données utilisateur
 * - Sync localStorage → cloud
 * - Gestion du plan Free/Pro
 * - Intégration Stripe (abonnement Pro)
 * 
 * Port: 3001 (frontend sur 3000)
 */

// IMPORTANT: Charger config.js en PREMIER pour peupler process.env
// avant que les autres modules (stripeService, etc.) ne s'initialisent
import './config.js'

import express from 'express'
import cors from 'cors'
import db from './database.js'
import { sendMagicLink, verifyMagicLink, verifyJWT, getUserInfo } from './authService.js'
import { saveUserData, getUserData, updateUserPlan, incrementUserExportCount } from './userDataService.js'
import stripeService from './stripeService.js'
import webhookHandler from './webhookHandler.js'

const app = express()
const PORT = process.env.PORT || 3001

// ============================================================================
// MIDDLEWARE SPÉCIAL POUR WEBHOOKS STRIPE
// Les webhooks Stripe nécessitent le body brut, pas du JSON parsé
// ============================================================================
app.post('/stripe/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature']
  
  try {
    // Vérifier la signature et parser l'événement
    const event = webhookHandler.verifyWebhookSignature(req.body, signature)
    
    // Traiter l'événement
    const result = await webhookHandler.handleWebhookEvent(event)
    
    res.json(result)
  } catch (error) {
    console.error('[Webhook] Erreur:', error)
    return res.status(400).json({ error: error.message })
  }
})

// ============================================================================
// MIDDLEWARE STANDARD (APRÈS LES WEBHOOKS)
// ============================================================================
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
 * POST /api/auth/send-link
 * Envoyer un magic link à l'utilisateur (namespace API)
 */
app.post('/api/auth/send-link', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email requis' })
    }

    const result = await sendMagicLink(email)

    res.json(result)
  } catch (error) {
    console.error('[API] Erreur /api/auth/send-link:', error)
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
 * GET /api/auth/verify?token=xxx
 * Vérifier le magic link et retourner un JWT (namespace API)
 */
app.get('/api/auth/verify', (req, res) => {
  try {
    const { token } = req.query

    if (!token) {
      return res.status(400).json({ error: 'Token requis' })
    }

    const result = verifyMagicLink(token)

    res.json(result)
  } catch (error) {
    console.error('[API] Erreur /api/auth/verify:', error)
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

/**
 * GET /api/auth/me
 * Obtenir les informations de l'utilisateur connecté (namespace API)
 */
app.get('/api/auth/me', verifyJWT, (req, res) => {
  try {
    const userInfo = getUserInfo(req.user.userId)
    res.json(userInfo)
  } catch (error) {
    console.error('[API] Erreur /api/auth/me:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================================
// ROUTES STRIPE
// ============================================================================

/**
 * POST /stripe/create-checkout-session
 * Créer une session Stripe Checkout pour l'upgrade PRO
 * Protégé par JWT
 */
app.post('/stripe/create-checkout-session', verifyJWT, async (req, res) => {
  try {
    const userId = req.user.userId
    const email = req.user.email
    
    console.log(`[Stripe] Création checkout session pour user ${userId}`)
    
    // Créer la session Checkout
    const checkoutUrl = await stripeService.createCheckoutSession(userId, email)
    
    res.json({ 
      success: true, 
      url: checkoutUrl 
    })
  } catch (error) {
    console.error('[Stripe] Erreur création checkout:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /stripe/create-portal-session
 * Créer une session Stripe Billing Portal
 * Protégé par JWT
 */
app.post('/stripe/create-portal-session', verifyJWT, async (req, res) => {
  try {
    const userId = req.user.userId
    
    console.log(`[Stripe] Création portal session pour user ${userId}`)
    
    // Créer la session Portal
    const portalUrl = await stripeService.createBillingPortalSession(userId)
    
    res.json({ 
      success: true, 
      url: portalUrl 
    })
  } catch (error) {
    console.error('[Stripe] Erreur création portal:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /stripe/subscription-info
 * Récupérer les informations d'abonnement de l'utilisateur
 * Protégé par JWT
 */
app.get('/stripe/subscription-info', verifyJWT, (req, res) => {
  try {
    const userId = req.user.userId
    
    const subscriptionInfo = stripeService.getUserSubscriptionInfo(userId)
    
    res.json({ 
      success: true, 
      subscription: subscriptionInfo 
    })
  } catch (error) {
    console.error('[Stripe] Erreur récupération subscription info:', error)
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
// MODULE 11 : EXPORT TRACKING
// ============================================================================

/**
 * POST /api/exports/log
 * Logger un export effectué par l'utilisateur
 */
app.post('/api/exports/log', verifyJWT, async (req, res) => {
  try {
    const { designId, type, screenId, plan, timestamp } = req.body
    const userId = req.user.userId
    
    console.log(`[Exports] Log export: user=${userId}, design=${designId}, type=${type}`)
    
    // Incrémenter le compteur d'exports si FREE
    if (plan === 'free') {
      await incrementUserExportCount(userId)
    }
    
    // Vous pouvez ajouter une table exports_log si vous voulez tracker l'historique
    // Pour l'instant, on se contente d'incrémenter le compteur
    
    res.json({
      success: true,
      message: 'Export loggé avec succès'
    })
  } catch (error) {
    console.error('[Exports] Erreur log:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/exports/quota
 * Obtenir le quota d'exports de l'utilisateur
 */
app.get('/api/exports/quota', verifyJWT, async (req, res) => {
  try {
    const userId = req.user.userId
    const userInfo = getUserInfo(userId)
    
    if (!userInfo) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' })
    }
    
    const isPro = userInfo.plan === 'pro'
    const limit = 5
    const remaining = isPro ? null : Math.max(0, limit - userInfo.exportCount)
    
    res.json({
      plan: userInfo.plan,
      unlimited: isPro,
      exportCount: userInfo.exportCount,
      remaining,
      limit: isPro ? null : limit,
      canExport: isPro || userInfo.exportCount < limit
    })
  } catch (error) {
    console.error('[Exports] Erreur quota:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============================================================================
// NEWSLETTER
// ============================================================================

/**
 * POST /newsletter/subscribe
 * Inscription à la newsletter
 * Body: { email: string }
 */
app.post('/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({ error: 'Email requis' })
    }
    
    // Valider le format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Format email invalide' })
    }
    
    // Insérer dans la base de données
    const stmt = db.prepare(`
      INSERT INTO newsletter (email, subscribed_at, active)
      VALUES (?, datetime('now'), 1)
    `)
    
    try {
      stmt.run(email.toLowerCase())
      console.log(`[Newsletter] Nouvelle inscription: ${email}`)
      
      res.json({
        success: true,
        message: 'Votre email a bien été ajouté à la newsletter'
      })
    } catch (dbError) {
      if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ 
          error: 'Cet email est déjà inscrit à la newsletter' 
        })
      }
      throw dbError
    }
    
  } catch (error) {
    console.error('[Newsletter] Erreur:', error)
    res.status(500).json({ error: 'Erreur lors de l\'inscription' })
  }
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
