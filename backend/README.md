# Previewfast Backend

Backend minimal pour Previewfast avec authentification magic link et synchronisation des données.

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Copier le fichier .env
cp .env.example .env

# Démarrer le serveur
npm run dev
```

Le serveur démarre sur **http://localhost:3001**

## 📚 API Endpoints

### Authentification

#### `POST /auth/send-link`
Envoyer un magic link par email

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Magic link envoyé. Vérifiez votre boîte mail.",
  "expiresIn": "15 minutes"
}
```

#### `GET /auth/verify?token=xxx`
Vérifier le magic link et obtenir un JWT

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "plan": "free",
    "exportCount": 0,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### `GET /auth/me`
Obtenir les informations de l'utilisateur connecté (nécessite JWT)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "plan": "free",
  "exportCount": 0,
  "stripeCustomerId": null,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### Données utilisateur

#### `POST /api/user/data`
Sauvegarder les données complètes (migration)

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "projects": {
    "design-1": {
      "screen-1": { "title": { "value": "Mon app", "type": "text" } }
    }
  },
  "presets": {
    "design-1": [
      { "id": "preset_123", "name": "Dark theme", "values": {} }
    ]
  },
  "plan": "free",
  "exportCount": 3
}
```

#### `GET /api/user/data`
Récupérer toutes les données

**Response:**
```json
{
  "user": { ... },
  "projects": { ... },
  "presets": { ... }
}
```

#### `PUT /api/user/plan`
Mettre à jour le plan

**Body:**
```json
{
  "plan": "pro"
}
```

#### `POST /api/user/export`
Incrémenter le compteur d'exports

**Response:**
```json
{
  "success": true,
  "exportCount": 4
}
```

## 🗄️ Base de données

SQLite utilisé en développement. La structure est prête pour PostgreSQL en production.

### Tables

- **users**: Identité utilisateur (id, email, plan, export_count, stripe_customer_id)
- **user_data**: Données clé-valeur (projets, presets)
- **magic_tokens**: Tokens temporaires pour l'auth

## 📧 Emails

En mode développement (`EMAIL_SERVICE=console`), les emails sont affichés dans la console.

En production, configurez un serveur SMTP dans le `.env`.

## 🔐 Sécurité

- JWT avec expiration 30 jours
- Magic links valides 15 minutes
- Tokens à usage unique
- Nettoyage automatique des tokens expirés

## 🧪 Tests

```bash
# Health check
curl http://localhost:3001/health

# Envoyer un magic link
curl -X POST http://localhost:3001/auth/send-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 🚀 Production

1. Changer `JWT_SECRET` (générer avec `openssl rand -hex 32`)
2. Configurer SMTP pour les emails
3. Utiliser PostgreSQL au lieu de SQLite
4. Ajouter HTTPS
5. Configurer les CORS pour le domaine de production
