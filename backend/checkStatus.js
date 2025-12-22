/**
 * Script pour vérifier le statut d'un utilisateur dans la base de données
 */
import { getDatabase } from './database.js'

const db = getDatabase()

// Récupérer tous les utilisateurs
const users = db.prepare(`
  SELECT 
    id,
    email,
    plan,
    subscription_status,
    subscription_id,
    current_period_end,
    stripe_customer_id
  FROM users
`).all()

console.log('\n=== UTILISATEURS DANS LA BASE ===\n')
users.forEach(user => {
  console.log(`📧 Email: ${user.email}`)
  console.log(`   Plan: ${user.plan}`)
  console.log(`   Subscription Status: ${user.subscription_status || 'N/A'}`)
  console.log(`   Subscription ID: ${user.subscription_id || 'N/A'}`)
  console.log(`   Period End: ${user.current_period_end || 'N/A'}`)
  console.log(`   Stripe Customer: ${user.stripe_customer_id || 'N/A'}`)
  console.log('---')
})

// Vérifier les derniers événements webhook
console.log('\n=== DERNIERS ÉVÉNEMENTS WEBHOOK ===\n')
const webhooks = db.prepare(`
  SELECT 
    event_id,
    event_type,
    processed_at
  FROM webhook_events
  ORDER BY processed_at DESC
  LIMIT 10
`).all()

webhooks.forEach(wh => {
  console.log(`📨 ${wh.event_type}`)
  console.log(`   ID: ${wh.event_id}`)
  console.log(`   Traité: ${wh.processed_at}`)
  console.log('---')
})
