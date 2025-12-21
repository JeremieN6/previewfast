/**
 * Service d'authentification - Magic Link uniquement
 * 
 * Workflow:
 * 1. User entre son email
 * 2. Génération d'un token unique
 * 3. Envoi du magic link par email
 * 4. User clique sur le lien
 * 5. Token validé → JWT généré
 * 6. User connecté
 */

import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import db from './database.js'
import { sendMagicLinkEmail } from './emailService.js'

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'
const MAGIC_LINK_EXPIRY_MINUTES = 15
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

/**
 * Générer un token aléatoire sécurisé
 */
function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Créer ou récupérer un utilisateur
 */
function getOrCreateUser(email) {
  // Vérifier si l'utilisateur existe
  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  
  if (existingUser) {
    return existingUser
  }
  
  // Créer un nouvel utilisateur
  const userId = crypto.randomUUID()
  
  db.prepare(`
    INSERT INTO users (id, email, plan, export_count)
    VALUES (?, ?, 'free', 0)
  `).run(userId, email)
  
  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId)
  
  console.log(`[Auth] ✅ Nouvel utilisateur créé: ${email}`)
  
  return newUser
}

/**
 * Envoyer un magic link à l'utilisateur
 */
export async function sendMagicLink(email) {
  try {
    // Valider l'email
    if (!email || !email.includes('@')) {
      throw new Error('Email invalide')
    }
    
    // Créer ou récupérer l'utilisateur
    const user = getOrCreateUser(email)
    
    // Générer un token unique
    const token = generateToken()
    
    // Calculer la date d'expiration
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + MAGIC_LINK_EXPIRY_MINUTES)
    
    // Stocker le token dans la DB
    db.prepare(`
      INSERT INTO magic_tokens (token, email, expires_at)
      VALUES (?, ?, ?)
    `).run(token, email, expiresAt.toISOString())
    
    // Construire le magic link
    const magicLink = `${FRONTEND_URL}/auth/verify?token=${token}`
    
    // Envoyer l'email
    await sendMagicLinkEmail(email, magicLink)
    
    console.log(`[Auth] Magic link envoyé à ${email}`)
    
    return {
      success: true,
      message: 'Magic link envoyé. Vérifiez votre boîte mail.',
      expiresIn: `${MAGIC_LINK_EXPIRY_MINUTES} minutes`
    }
  } catch (error) {
    console.error('[Auth] Erreur lors de l\'envoi du magic link:', error)
    throw error
  }
}

/**
 * Vérifier un magic link et générer un JWT
 */
export function verifyMagicLink(token) {
  try {
    // Récupérer le token de la DB
    const magicToken = db.prepare(`
      SELECT * FROM magic_tokens 
      WHERE token = ? AND used = 0 AND expires_at > datetime('now')
    `).get(token)
    
    if (!magicToken) {
      throw new Error('Token invalide ou expiré')
    }
    
    // Marquer le token comme utilisé
    db.prepare('UPDATE magic_tokens SET used = 1 WHERE token = ?').run(token)
    
    // Récupérer l'utilisateur
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(magicToken.email)
    
    if (!user) {
      throw new Error('Utilisateur introuvable')
    }
    
    // Générer un JWT
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        plan: user.plan
      },
      JWT_SECRET,
      { expiresIn: '30d' } // Token valide 30 jours
    )
    
    console.log(`[Auth] ✅ Utilisateur connecté: ${user.email}`)
    
    return {
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        exportCount: user.export_count,
        createdAt: user.created_at
      }
    }
  } catch (error) {
    console.error('[Auth] Erreur lors de la vérification du token:', error)
    throw error
  }
}

/**
 * Middleware pour vérifier le JWT
 */
export function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' })
    }
    
    const token = authHeader.substring(7)
    
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Ajouter les infos utilisateur à la requête
    req.user = decoded
    
    next()
  } catch (error) {
    console.error('[Auth] JWT invalide:', error)
    return res.status(401).json({ error: 'Token invalide' })
  }
}

/**
 * Obtenir les informations complètes de l'utilisateur
 */
export function getUserInfo(userId) {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId)
  
  if (!user) {
    throw new Error('Utilisateur introuvable')
  }
  
  return {
    id: user.id,
    email: user.email,
    plan: user.plan,
    exportCount: user.export_count,
    stripeCustomerId: user.stripe_customer_id,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  }
}
