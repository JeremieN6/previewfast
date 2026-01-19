/**
 * Service d'envoi d'emails
 * 
 * En développement: affiche les emails dans la console
 * En production: utilise SMTP via Nodemailer
 */

import nodemailer from 'nodemailer'

const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'console'
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply-previewfast@sassify.fr'

/**
 * Créer un transporteur email selon l'environnement
 */
function createTransporter() {
  if (EMAIL_SERVICE === 'console') {
    // Mode développement: logger dans la console
    return {
      sendMail: async (options) => {
        console.log('\n' + '='.repeat(80))
        console.log('📧 EMAIL SIMULÉ (MODE DEV)')
        console.log('='.repeat(80))
        console.log(`De: ${options.from}`)
        console.log(`À: ${options.to}`)
        console.log(`Sujet: ${options.subject}`)
        console.log('-'.repeat(80))
        console.log(options.text || options.html)
        console.log('='.repeat(80) + '\n')
        return { messageId: 'dev-' + Date.now() }
      }
    }
  }
  
  // Mode production: SMTP réel
  const port = parseInt(process.env.SMTP_PORT) || 587
  const secure = process.env.SMTP_SECURE
    ? String(process.env.SMTP_SECURE).toLowerCase() === 'true'
    : port === 465

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

const transporter = createTransporter()

/**
 * Envoyer un magic link par email
 */
export async function sendMagicLinkEmail(email, magicLink) {
  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject: '🔐 Votre lien de connexion PreviewFast',
    text: `
Bonjour,

Vous avez demandé à vous connecter à PreviewFast.

Cliquez sur ce lien pour vous connecter :
${magicLink}

Ce lien est valide pendant 15 minutes.

Si vous n'avez pas demandé cette connexion, ignorez cet email.

Cordialement,
L'équipe PreviewFast
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>🔐 Votre lien de connexion</h2>
    <p>Bonjour,</p>
    <p>Vous avez demandé à vous connecter à <strong>PreviewFast</strong>.</p>
    <p style="margin: 30px 0;">
      <a href="${magicLink}" class="button">Se connecter à PreviewFast</a>
    </p>
    <p style="font-size: 14px; color: #666;">
      Ou copiez ce lien dans votre navigateur :<br>
      <code style="background: #f5f5f5; padding: 8px; display: inline-block; margin-top: 5px; word-break: break-all;">${magicLink}</code>
    </p>
    <p style="font-size: 14px; color: #666;">
      ⏱️ Ce lien est valide pendant <strong>15 minutes</strong>.
    </p>
    <div class="footer">
      <p>Si vous n'avez pas demandé cette connexion, ignorez cet email.</p>
      <p>L'équipe PreviewFast</p>
    </div>
  </div>
</body>
</html>
    `
  }
  
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`[Email] ✅ Email envoyé: ${info.messageId}`)
    return info
  } catch (error) {
    console.error('[Email] ❌ Erreur d\'envoi:', error)
    throw error
  }
}
