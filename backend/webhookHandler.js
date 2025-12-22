/**
 * Gestionnaire de webhooks Stripe
 * 
 * Gestion idempotente et sécurisée des événements Stripe
 * Tous les changements de statut utilisateur passent PAR ICI UNIQUEMENT
 */

import Stripe from 'stripe'
import { getDatabase } from './database.js'
import stripeService from './stripeService.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

/**
 * Vérifier et parser un événement webhook Stripe
 * @param {string} body - Body brut de la requête
 * @param {string} signature - Header stripe-signature
 * @returns {object} Événement Stripe vérifié
 */
export function verifyWebhookSignature(body, signature) {
  if (!WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET non configuré')
  }
  
  try {
    const event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET)
    return event
  } catch (err) {
    console.error('[Webhook] ❌ Signature invalide:', err.message)
    throw new Error('Signature webhook invalide')
  }
}

/**
 * Enregistrer un événement webhook pour idempotence
 * @param {string} eventId - ID de l'événement Stripe
 * @returns {boolean} True si nouveau, False si déjà traité
 */
function markEventAsProcessed(eventId) {
  const db = getDatabase()
  
  // Vérifier si déjà traité
  const existing = db.prepare('SELECT event_id FROM webhook_events WHERE event_id = ?').get(eventId)
  
  if (existing) {
    console.log(`[Webhook] Événement ${eventId} déjà traité (skip)`)
    return false
  }
  
  // Marquer comme traité
  db.prepare(`
    INSERT INTO webhook_events (event_id, processed_at) 
    VALUES (?, CURRENT_TIMESTAMP)
  `).run(eventId)
  
  return true
}

/**
 * Créer la table des événements webhook si elle n'existe pas
 */
export function initWebhookEventsTable() {
  const db = getDatabase()
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS webhook_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT UNIQUE NOT NULL,
      processed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // Nettoyer les anciens événements (> 30 jours)
  db.exec(`
    DELETE FROM webhook_events 
    WHERE processed_at < datetime('now', '-30 days')
  `)
  
  console.log('[Webhook] Table webhook_events initialisée')
}

/**
 * Traiter un événement webhook Stripe
 * @param {object} event - Événement Stripe
 */
export async function handleWebhookEvent(event) {
  const eventId = event.id
  const eventType = event.type
  
  console.log(`[Webhook] 📨 Reçu: ${eventType} (${eventId})`)
  
  // Vérifier idempotence
  if (!markEventAsProcessed(eventId)) {
    return { received: true, processed: false, reason: 'already_processed' }
  }
  
  try {
    switch (eventType) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
        
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object)
        break
        
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object)
        break
        
      default:
        console.log(`[Webhook] Type ${eventType} non géré (ignoré)`)
    }
    
    console.log(`[Webhook] ✅ ${eventType} traité avec succès`)
    return { received: true, processed: true }
    
  } catch (error) {
    console.error(`[Webhook] ❌ Erreur traitement ${eventType}:`, error)
    throw error
  }
}

/**
 * Gérer checkout.session.completed
 * L'utilisateur a payé avec succès
 */
async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata?.userId
  const subscriptionId = session.subscription
  
  if (!userId) {
    console.warn('[Webhook] checkout.session.completed sans userId')
    return
  }
  
  console.log(`[Webhook] Checkout complété pour user ${userId}, subscription ${subscriptionId}`)
  
  // Récupérer les détails de l'abonnement
  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    stripeService.updateUserSubscriptionStatus(userId, subscription)
  }
}

/**
 * Gérer customer.subscription.created / updated
 * Synchroniser le statut de l'abonnement
 */
async function handleSubscriptionUpdated(subscription) {
  const userId = subscription.metadata?.userId
  
  if (!userId) {
    // Tenter de trouver l'utilisateur par customer_id
    const db = getDatabase()
    const user = db.prepare('SELECT id FROM users WHERE stripe_customer_id = ?')
      .get(subscription.customer)
    
    if (!user) {
      console.warn('[Webhook] subscription.updated sans userId trouvable')
      return
    }
    
    stripeService.updateUserSubscriptionStatus(user.id, subscription)
  } else {
    stripeService.updateUserSubscriptionStatus(userId, subscription)
  }
}

/**
 * Gérer customer.subscription.deleted
 * Downgrade vers FREE
 */
async function handleSubscriptionDeleted(subscription) {
  stripeService.handleSubscriptionDeleted(subscription.id)
}

/**
 * Gérer invoice.payment_succeeded
 * Confirmation de paiement
 */
async function handleInvoicePaymentSucceeded(invoice) {
  stripeService.handleInvoicePaymentSucceeded(invoice)
}

/**
 * Gérer invoice.payment_failed
 * Échec de paiement
 */
async function handleInvoicePaymentFailed(invoice) {
  stripeService.handleInvoicePaymentFailed(invoice)
}

export default {
  verifyWebhookSignature,
  handleWebhookEvent,
  initWebhookEventsTable,
}
