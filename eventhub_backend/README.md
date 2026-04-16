# EventHub API
API REST pour la gestion d'événements, construite avec Express.js, TypeScript et MongoDB (via Mongoose).
## 🚀 Technologies

- **Node.js** avec **TypeScript**
- **Express.js** - Framework web
- **MongoDB** avec **Mongoose** - Base de données
- **JWT** - Authentification
- **TOTP/2FA** - Authentification à deux facteurs
- **Swagger** - Documentation API
## 📋 Prérequis

- Node.js (v18 ou supérieur)
- Docker et Docker Compose
- npm ou yarn

## 🛠️ Installation

1. Cloner le projet

```bash
git clone <repository-url>
cd eventhub-dev2
```

2. Installer les dépendances

```bash
npm install
```

3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Base de données MongoDB
MONGO_URI="mongodb://localhost:27017/eventhub"

# Secret pour la signature des tokens JWT
JWT_SECRET="your-secret-key-here"

# Port du serveur (optionnel, défaut: 8000)
PORT=8000
```

4. Démarrer la base de données MongoDB (si vous utilisez Docker) :

```bash
docker run -d --name eventhub-mongo -p 27017:27017 mongo
```

5. Créer un utilisateur, ensuite en faisant `npm run seed` 100 évènements seront créés pour cet utilisateur.

6. Peupler la base de données avec les évènements

```bash
npm run seed
```

## 🏃 Démarrage

Démarrer le serveur de développement :

```bash
npm run dev
```

L'API sera accessible sur `http://localhost:8000`

## 📚 Documentation API

Une fois le serveur démarré, la documentation Swagger est disponible sur :

```
http://localhost:8000/api-docs
```

## 📁 Structure du projet

```
src/
├── api/              # Controllers, routes, middlewares
├── application/      # Use cases (logique métier)
├── domain/           # Entités et interfaces
├── infrastructure/    # Repositories, Prisma, containers
└── tests/            # Tests unitaires
```

## 🔑 Endpoints principaux

### Authentification

- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `GET /api/v1/auth/me` - Informations utilisateur connecté
- `POST /api/v1/auth/logout` - Déconnexion

### Authentification à deux facteurs (2FA)

- `GET /api/v1/a2f/qr-code` - Générer QR Code pour activation 2FA
- `POST /api/v1/auth/enable-2fa` - Activer la 2FA
- `POST /api/v1/auth/disable-2fa` - Désactiver la 2FA
- `POST /api/v1/auth/verify-2fa` - Vérifier code TOTP lors de la connexion
- `POST /api/v1/auth/verify-backup-code` - Utiliser un code de récupération

### Événements

- `GET /api/v1/events` - Liste des événements
- `GET /api/v1/events/:id` - Détails d'un événement
- `POST /api/v1/events` - Créer un événement (authentifié)
- `PATCH /api/v1/events/:id` - Modifier un événement (authentifié)
- `DELETE /api/v1/events/:id` - Supprimer un événement (authentifié)
- `GET /api/v1/event-categories` - Liste des catégories
- `GET /api/v1/event-categories/:id` - Détails d'une catégorie

## 🧪 Tests

Exécuter les tests :

```bash
npm test
```

## 📝 Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Compile TypeScript
- `npm run type-check` - Vérifie les types TypeScript
- `npm run seed` - Peuple la base de données
- `npm test` - Lance les tests
- `npm run swagger:generate` - Génère la documentation Swagger
- `npm run swagger:validate` - Valide la documentation Swagger

## 🔐 Authentification à deux facteurs (2FA)

L'API supporte l'authentification à deux facteurs basée sur TOTP (Time-based One-Time Password).

**Fonctionnalités :**

- Génération de QR Code pour configuration avec applications d'authentification (Google Authenticator, Authy, etc.)
- Codes de récupération sécurisés (hashés avec bcrypt)
- Rate limiting pour protéger contre les attaques par force brute
- Validation côté serveur obligatoire

**Activation :**

1. L'utilisateur authentifié récupère un QR Code via `/api/v1/a2f/qr-code`
2. Scan du QR Code avec une application d'authentification
3. Validation avec un code TOTP pour activer la 2FA
4. Sauvegarde des codes de récupération fournis

**Connexion avec 2FA activée :**

1. Authentification classique (email/password)
2. Si 2FA activée, un `tempToken` est retourné
3. Vérification avec code TOTP ou code de récupération
4. Obtention du token JWT final

## 🗄️ Base de données

La base de données utilisée est **MongoDB**. La connexion est configurée dans `src/api/config/mongoose.config.ts` et utilise la variable d'environnement `MONGO_URI`.
