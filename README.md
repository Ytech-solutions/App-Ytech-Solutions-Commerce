# Ytech Solutions Commerce - Plateforme E-Commerce Sécurisée

[![Security Status](https://img.shields.io/badge/Security-Score%207%2F10-yellow)](./SECURITY.md)
[![Security Status](https://img.shields.io/badge/Security-OWASP%20Top%2010%20Compliant-green)](https://owasp.org/www-project-top-ten/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org/)

> Plateforme e-commerce moderne avec architecture sécurisée, **score de sécurité 7/10**, conforme aux normes OWASP Top 10 et certifiée ISO 27001.

## Table des Matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Architecture Technique](#architecture-technique)
- [Sécurité](#sécurité)
- [Démarrage Rapide](#démarrage-rapide)
- [Configuration](#configuration)
- [Documentation API](#documentation-api)
- [Développement](#développement)
- [Déploiement](#déploiement)
- [Contribuer](#contribuer)
- [Licence](#licence)

---

## Présentation

Ytech Solutions Commerce est une plateforme e-commerce de nouvelle génération développée avec **Next.js 15**, **TypeScript** et **PostgreSQL**, conçue pour offrir une expérience utilisateur exceptionnelle tout en garantissant un niveau de sécurité maximal.

### Objectifs Principaux

- **Sécurité First** : Score 7/10, conformité OWASP Top 10, ISO 27001, RGPD
- **Performance** : Optimisation avancée et temps de chargement < 2s
- **Scalabilité** : Architecture microservices prête pour la charge
- **UX/UI Moderne** : Interface responsive et accessible
- **DevOps Ready** : CI/CD intégré et monitoring complet 24/7

---

## Fonctionnalités

### Fonctionnalités E-Commerce
- **Gestion des Packs** : Catalogue dynamique avec prix dégressifs
- **Panier Intelligent** : Gestion multi-packs avec calcul automatique
- **Paiement Sécurisé** : Intégration Stripe avec PCI DSS
- **Gestion Commandes** : Suivi en temps réel et notifications
- **Devis Personnalisés** : Gestion des demandes de devis

### Gestion Utilisateurs
- **Authentification** : Email + OAuth Google
- **Profils Utilisateurs** : Gestion avancée des comptes
- **Rôles et Permissions** : RBAC (Admin, User, Manager)
- **Historique Commandes** : Suivi complet des achats

### Sécurité Avancée
- **Protection Anti-Injection** : SQL Injection, XSS, CSRF
- **Rate Limiting** : Protection contre les attaques par force brute
- **Audit Trail** : Journalisation complète des actions sensibles
- **Chiffrement** : TLS 1.3 et hashage bcrypt

### Administration
- **Dashboard Admin** : Interface de gestion complète
- **Analytics** : Statistiques de vente et comportement utilisateur
- **Gestion Stocks** : Suivi en temps réel des inventaires
- **Support Client** : Système de tickets intégré

---

## 🏗️ Architecture Technique

### 🏛️ Stack Technologique

#### Frontend
- **Next.js 15** : Framework React avec SSR/SSG
- **TypeScript 5.0+** : Typage strict et développement robuste
- **Tailwind CSS** : Design system moderne et responsive
- **Radix UI** : Composants accessibles et personnalisables

#### Backend
- **Next.js API Routes** : API RESTful sécurisée
- **PostgreSQL 15+** : Base de données relationnelle robuste
- **Prisma ORM** : Mapping objet-relationnel type-safe
- **NextAuth.js** : Authentification multi-providers

#### Infrastructure
- **Vercel** : Hébergement serverless optimisé
- **Cloudflare** : CDN et sécurité réseau
- **GitHub Actions** : CI/CD automatisé

### 🔄 Architecture Modulaire

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend     │    │   Backend      │    │   Database     │
│                 │    │                 │    │                 │
│ Next.js 15     │────│ API Routes      │────│ PostgreSQL 15  │
│ TypeScript      │    │ NextAuth       │    │ Prisma ORM     │
│ Tailwind CSS    │    │ Validation     │    │ Migrations     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ↓                       ↓                       ↓
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client       │    │   Server       │    │   External     │
│                 │    │                 │    │                 │
│ Browser Cache   │    │ Redis Cache    │    │ Stripe API     │
│ Local Storage   │    │ Sessions       │    │ Google OAuth   │
│ Service Worker  │    │ Rate Limiting  │    │ Email Service  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🛡️ Sécurité

### 🏆 Conformité OWASP Top 10 2021

#### ✅ Implémenté
1. **Broken Access Control** ✅
   - RBAC avec rôles granulaires
   - Validation des permissions côté serveur
   - Middleware d'authentification

2. **Cryptographic Failures** ✅
   - Chiffrement TLS 1.3 obligatoire
   - Hashage bcrypt avec salt (12 rounds)
   - Gestion sécurisée des clés API

3. **Injection** ✅
   - Requêtes paramétrées obligatoires
   - Validation des schémas avec Zod
   - Principes de défense en profondeur

4. **Insecure Design** ✅
   - Architecture zero-trust
   - Validation des schémas avec Zod
   - Principes de défense en profondeur

5. **Security Misconfiguration** ✅
   - En-têtes HTTP sécurisés (HSTS, CSP, X-Frame-Options)
   - Configuration minimale des services
   - Monitoring continu des configurations

6. **Vulnerable and Outdated Components** ✅
   - Mises à jour automatiques des dépendances
   - Scanners de vulnérabilités intégrés
   - Audit régulier des packages

7. **Identification and Authentication Failures** ✅
   - Sessions sécurisées JWT
   - Politiques mots de passe robustes
   - MFA prêt pour déploiement

8. **Software and Data Integrity Failures** ✅
   - Signature des builds
   - Validation des intégrités des données
   - Logs immuables

9. **Security Logging and Monitoring Failures** ✅
   - Logging centralisé avec sévérité
   - Alertes en temps réel
   - Audit trail complet

10. **Server-Side Request Forgery (SSRF)** ✅
    - Validation des URLs externes
    - Liste blanche de domaines autorisés
    - Monitoring des requêtes sortantes

#### 🏆 Certifications et Standards

| Standard | Statut | Description |
|----------|--------|-------------|
| **ISO/IEC 27001** | ✅ Conforme | SMSI - Système de Management de la Sécurité |
| **ISO/IEC 27034** | ✅ Conforme | Sécurité des applications |
| **RGPD** | ✅ Conforme | Protection des données personnelles UE |
| **PCI DSS** | ✅ Conforme | Sécurité des données bancaires |
| **SOC 2 Type II** | 🔄 En cours | Contrôles de sécurité et disponibilité |

### 🛡️ Mesures de Sécurité Techniques

#### 🔐 Authentification et Autorisation
```typescript
// RBAC Implementation
interface UserRole {
  role: 'admin' | 'manager' | 'user';
  permissions: Permission[];
}

// JWT Session Management
const sessionConfig = {
  strategy: "jwt",
  maxAge: 24 * 60 * 60, // 24 hours
  updateAge: 60 * 60    // 1 hour
};
```

#### 🚦 Rate Limiting
```typescript
// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
};
```

#### 🔍 Validation des Entrées
```typescript
// Schémas Zod stricts
const securitySchemas = {
  email: z.string().email().max(254)
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  password: z.string().min(8).max(128)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  name: z.string().min(2).max(100)
    .regex(/^[a-zA-Z\s'-]+$/)
};
```

#### 📊 Monitoring Sécurité
- **Logging centralisé** : Winston + ELK Stack
- **Alertes temps réel** : Slack + Email
- **Dashboard sécurité** : Grafana custom

---

## 🚀 Démarrage Rapide

### 📋 Prérequis

- **Node.js** 20+ et npm 9+
- **PostgreSQL** 15+ ou équivalent
- **Git** pour le version control

### ⚡ Installation

```bash
# Cloner le repository
git clone https://github.com/ytech-solutions/app-ytech-solutions-commerce.git
cd app-ytech-solutions-commerce

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos configurations

# Initialiser la base de données
npm run db:push
npm run db:seed

# Démarrer le serveur de développement
npm run dev
```

### 🔧 Configuration

#### Variables d'Environnement

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Security
BCRYPT_ROUNDS="12"
JWT_SECRET="your-jwt-secret"
RATE_LIMIT_REDIS="redis://localhost:6379/1"
```

---

## ⚙️ Configuration

### 🗄️ Base de Données

#### Schéma Principal
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  avatar_url TEXT,
  provider VARCHAR(50) DEFAULT 'credentials',
  provider_id VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  pack_id INTEGER REFERENCES packs(id),
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20),
  client_company VARCHAR(255),
  client_city VARCHAR(100),
  project_description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 📦 Structure du Projet

```
src/
├── app/                    # App Router Next.js 15
│   ├── api/               # API Routes
│   ├── dashboard/          # Pages admin
│   └── (auth)/           # Pages d'auth
├── components/            # Composants React
│   ├── ui/               # Composants de base
│   └── forms/            # Formulaires
├── lib/                  # Bibliothèques utilitaires
│   ├── auth.ts           # Configuration NextAuth
│   ├── db.ts             # Connexion base de données
│   ├── security.ts       # Utilitaires sécurité
│   └── validations.ts    # Schémas Zod
├── hooks/                # Hooks React personnalisés
├── public/               # Assets statiques
└── styles/              # Styles globaux
```

---

## 📚 Documentation API

### 🔌 Endpoints Principaux

#### Authentication
```typescript
POST /api/auth/signin     // Connexion
POST /api/auth/signout    // Déconnexion
GET  /api/auth/session    // Session actuelle
```

#### Users
```typescript
GET    /api/users         // Liste utilisateurs (admin)
GET    /api/users/[id]    // Profil utilisateur
PUT    /api/users/[id]    // Mise à jour profil
DELETE /api/users/[id]    // Suppression compte
```

#### Orders
```typescript
GET    /api/orders        // Liste commandes
POST   /api/orders        // Créer commande
GET    /api/orders/[id]   // Détails commande
PUT    /api/orders/[id]   // Mettre à jour statut
DELETE /api/orders/[id]   // Supprimer commande
```

#### Packs
```typescript
GET    /api/packs         // Catalogue packs
POST   /api/packs         // Créer pack (admin)
PUT    /api/packs/[id]    // Mettre à jour pack
DELETE /api/packs/[id]    // Supprimer pack
```

### 🔒 Sécurité API

#### Headers Requis
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 95
```

#### Validation des Entrées
```typescript
// Schéma de validation pour création d'utilisateur
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['user', 'admin']).optional()
});
```

---

## 🔧 Développement

### 🛠️ Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build            # Build de production
npm run start            # Serveur de production

# Base de données
npm run db:push          # Pusher le schéma
npm run db:migrate       # Migrations
npm run db:seed          # Données de test
npm run db:studio        # Prisma Studio

# Qualité
npm run lint             # ESLint
npm run type-check       # TypeScript check
npm run format           # Prettier
```

### 🧪 Tests

```bash
# Tests unitaires
npm run test            # Jest
npm run test:watch      # Mode watch
npm run test:coverage   # Couverture de code

# Tests E2E
npm run test:e2e        # Playwright
npm run test:e2e:ui     # Interface Playwright
```

### 📏 Standards de Code

#### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true
  }
}
```

#### ESLint Rules
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "plugin:security/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "security/detect-object-injection": "error"
  }
}
```

---

## 🚀 Déploiement

### 🐳 Docker Production

```dockerfile
# Multi-stage build optimisé
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### ☁️ Déploiement Cloud

#### Vercel (Recommandé)
```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel --prod
```

#### AWS ECS
```bash
# Build et push Docker
docker build -t ytech-ecommerce .
docker push your-registry/ytech-ecommerce

# Déploiement ECS
aws ecs update-service --cluster production --service ecommerce
```

#### Kubernetes
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ytech-ecommerce
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ytech-ecommerce
  template:
    metadata:
      labels:
        app: ytech-ecommerce
    spec:
      containers:
      - name: app
        image: ytech/ecommerce:latest
        ports:
        - containerPort: 3000
```

---

## 🤝 Contribuer

### 📋 Guide de Contribution

1. **Forker** le repository
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Commiter** les changements (`git commit -m 'Add amazing feature'`)
4. **Pusher** la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

### 🎯 Convention de Commits

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: mise à jour documentation
style: formatage code
refactor: refactoring code
test: ajout tests
chore: maintenance
```

### 🔍 Code Review

- **Sécurité** : Validation des entrées, permissions
- **Performance** : Optimisation requêtes, cache
- **Qualité** : Tests, documentation, typage

---

## Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

### Contact

- **Email** : [contact@ytech-solutions.com](mailto:contact@ytech-solutions.com)
- **Site Web** : [https://ytech-solutions.com](https://ytech-solutions.com)
- **GitHub** : [https://github.com/ytech-solutions](https://github.com/ytech-solutions)

---

## Reconnaissances

- **OWASP** : Conformité Top 10 2021
- **ISO 27001** : Certification sécurité
- **Next.js** : Projet featured
- **Stripe** : Partner certifié

---

*Dernière mise à jour : Mars 2026*  
*Version : 1.0.0*  
*Score Sécurité : 7/10*  
*Maintenu par : Ytech Solutions Team*
