/**
 * Service Stripe pour PreviewFaster
 * 
 * Gestion des abonnements mensuels à 9,90€
 * - Checkout Session (upgrade FREE → PRO)
 * - Billing Portal (gestion abonnement)
 * - Webhooks (synchronisation statuts)
 * 
 * Règles:
 * - Pas de trial
 * - Downgrade à la fin de période payée uniquement
 * - Statut utilisateur géré UNIQUEMENT via webhooks
 */

import Stripe from 'stripe'
import { getDatabase } from './database.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

/**
 * Prix Stripe configurés
 * Ces IDs doivent être créés dans le Dashboard Stripe
 */
const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY, // ex: price_xxxxx
}

/**
 * Créer ou récupérer un Stripe Customer pour un utilisateur
 * @param {string} userId - ID utilisateur
 * @param {string} email - Email utilisateur
 * @returns {Promise<string>} Stripe Customer ID
 */
export async function getOrCreateStripeCustomer(userId, email) {
  const db = getDatabase()
  
  // Vérifier si l'utilisateur a déjà un customer_id
  const user = db.prepare('SELECT stripe_customer_id FROM users WHERE id = ?').get(userId)
  
  if (user?.stripe_customer_id) {
    console.log(`[Stripe] Customer existant: ${user.stripe_customer_id}`)
    return user.stripe_customer_id
  }
  
  // Créer un nouveau customer Stripe
  console.log(`[Stripe] Création d'un nouveau customer pour ${email}`)
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  })
  
  // Sauvegarder le customer_id
  db.prepare('UPDATE users SET stripe_customer_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(customer.id, userId)
  
  console.log(`[Stripe] ✅ Customer créé: ${customer.id}`)
  return customer.id
}

/**
 * Créer une Checkout Session pour l'upgrade PRO
 * @param {string} userId - ID utilisateur
 * @param {string} email - Email utilisateur
 * @returns {Promise<string>} URL de la Checkout Session
 */
export async function createCheckoutSession(userId, email) {
  // Vérifier que le prix est configuré
  if (!STRIPE_PRICES.PRO_MONTHLY) {
    throw new Error('STRIPE_PRICE_PRO_MONTHLY non configuré dans .env')
  }
  
  // Obtenir ou créer le customer Stripe
  const customerId = await getOrCreateStripeCustomer(userId, email)
  
  console.log(`[Stripe] Création Checkout Session pour user ${userId}`)
  
  // Créer la session Stripe Checkout
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: STRIPE_PRICES.PRO_MONTHLY,
        quantity: 1,
      },
    ],
    success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${FRONTEND_URL}/?canceled=true`,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  })
  
  console.log(`[Stripe] ✅ Checkout Session créée: ${session.id}`)
  return session.url
}

/**
 * Créer une session Billing Portal
 * @param {string} userId - ID utilisateur
 * @returns {Promise<string>} URL du Billing Portal
 */
export async function createBillingPortalSession(userId) {
  const db = getDatabase()
  
  // Récupérer le customer_id
  const user = db.prepare('SELECT stripe_customer_id FROM users WHERE id = ?').get(userId)
  
  if (!user?.stripe_customer_id) {
    throw new Error('Aucun customer Stripe trouvé pour cet utilisateur')
  }
  
  console.log(`[Stripe] Création Billing Portal pour user ${userId}`)
  
  // Créer la session portal
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `${FRONTEND_URL}/account`,
  })
  
  console.log(`[Stripe] ✅ Billing Portal créé: ${session.id}`)
  return session.url
}

/**
 * Gérer le statut d'un utilisateur basé sur l'abonnement Stripe
 * @param {string} userId - ID utilisateur
 * @param {object} subscription - Objet subscription Stripe
 */
export function updateUserSubscriptionStatus(userId, subscription) {
  const db = getDatabase()
  
  const subscriptionId = subscription.id
  const status = subscription.status
  
  // Convertir current_period_end (timestamp Unix) en ISO string, si disponible
  let currentPeriodEnd = null
  if (subscription.current_period_end) {
    currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()
  }
  
  // Déterminer le plan utilisateur
  let plan = 'free'
  if (status === 'active' || status === 'trialing') {
    plan = 'pro'
  }
  
  console.log(`[Stripe] Mise à jour subscription user ${userId}: ${status} → plan ${plan}`)
  
  // Mettre à jour la base de données
  db.prepare(`
    UPDATE users 
    SET 
      plan = ?,
      subscription_id = ?,
      subscription_status = ?,
      current_period_end = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(plan, subscriptionId, status, currentPeriodEnd, userId)
  
  console.log(`[Stripe] ✅ User ${userId} mis à jour`)
}

/**
 * Gérer la suppression d'un abonnement
 * @param {string} subscriptionId - ID subscription Stripe
 */
export function handleSubscriptionDeleted(subscriptionId) {
  const db = getDatabase()
  
  console.log(`[Stripe] Abonnement supprimé: ${subscriptionId}`)
  
  // Trouver l'utilisateur et downgrade
  const user = db.prepare('SELECT id FROM users WHERE subscription_id = ?').get(subscriptionId)
  
  if (!user) {
    console.warn(`[Stripe] Aucun utilisateur trouvé pour subscription ${subscriptionId}`)
    return
  }
  
  // Downgrade vers FREE
  db.prepare(`
    UPDATE users 
    SET 
      plan = 'free',
      subscription_id = NULL,
      subscription_status = NULL,
      current_period_end = NULL,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(user.id)
  
  console.log(`[Stripe] ✅ User ${user.id} downgrade vers FREE`)
}

/**
 * Gérer un paiement réussi
 * @param {object} invoice - Objet invoice Stripe
 */
export function handleInvoicePaymentSucceeded(invoice) {
  const customerId = invoice.customer
  const subscriptionId = invoice.subscription
  
  console.log(`[Stripe] Paiement réussi pour subscription ${subscriptionId}`)
  
  // Le statut sera mis à jour par customer.subscription.updated
  // On peut logger ou envoyer un email de confirmation ici si besoin
}

/**
 * Gérer un paiement échoué
 * @param {object} invoice - Objet invoice Stripe
 */
export function handleInvoicePaymentFailed(invoice) {
  const customerId = invoice.customer
  const subscriptionId = invoice.subscription
  
  console.error(`[Stripe] ❌ Paiement échoué pour subscription ${subscriptionId}`)
  
  // Le statut sera mis à jour par customer.subscription.updated
  // On peut envoyer un email d'alerte ici
}

/**
 * Récupérer les informations d'abonnement d'un utilisateur
 * @param {string} userId - ID utilisateur
 * @returns {object|null} Infos abonnement ou null
 */
export function getUserSubscriptionInfo(userId) {
  const db = getDatabase()
  
  const user = db.prepare(`
    SELECT 
      plan,
      subscription_id,
      subscription_status,
      current_period_end
    FROM users 
    WHERE id = ?
  `).get(userId)
  
  if (!user || !user.subscription_id) {
    return null
  }
  
  return {
    plan: user.plan,
    subscriptionId: user.subscription_id,
    status: user.subscription_status,
    currentPeriodEnd: user.current_period_end,
    isPro: user.plan === 'pro',
    isCanceled: user.subscription_status === 'canceled',
    willDowngrade: user.subscription_status === 'canceled' && user.plan === 'pro',
  }
}

export default {
  createCheckoutSession,
  createBillingPortalSession,
  getOrCreateStripeCustomer,
  updateUserSubscriptionStatus,
  handleSubscriptionDeleted,
  handleInvoicePaymentSucceeded,
  handleInvoicePaymentFailed,
  getUserSubscriptionInfo,
}
