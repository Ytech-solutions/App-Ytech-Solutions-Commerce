# Ytech Solutions Commerce

[![Security Score](https://img.shields.io/badge/Security-9.5%2F10-brightgreen)](./SECURITY.md)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Dependencies](https://img.shields.io/badge/Dependencies-0%20Vulnerabilities-brightgreen)](#sécurité)

🛍️ **Plateforme e-commerce moderne et sécurisée** construite avec Next.js 16, TypeScript et PostgreSQL. Intégration complète de paiements, authentification multi-fournisseurs, et **durcissement sécurité avancé**.

---

## 📋 Table des Matières

- [🎯 Présentation](#-présentation)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🛡️ Sécurité](#️-sécurité)
- [🚀 Démarrage rapide](#-démarrage-rapide)
- [⚙️ Configuration](#️-configuration)
- [🏗️ Architecture](#️-architecture)
- [📊 Stack Technique](#-stack-technique)
- [🔧 Développement](#-développement)
- [📜 Licence](#-licence)

---

## 🎯 Présentation

Ytech Solutions Commerce est une **solution e-commerce complète** conçue pour les entreprises modernes, avec un focus particulier sur la sécurité et l'expérience utilisateur.

### 🎯 Objectifs principaux
- **Expérience client fluide** : parcours d'achat optimisé
- **Administration sécurisée** : gestion centralisée avec accès contrôlé
- **Scalabilité** : architecture moderne et performante
- **Sécurité maximale** : protection contre toutes les menaces web

### 🔄 Parcours utilisateur
1. **Découverte** : consultation des packs et services
2. **Commande** : processus d'achat simple et sécurisé
3. **Devis personnalisés** : demandes sur mesure
4. **Contact** : communication directe avec l'équipe
5. **Suivi** : espace personnel pour suivre les commandes

---

## ✨ Fonctionnalités

### 👤 Côté Client

#### 🛍️ **E-commerce**
- **Catalogue de packs** : présentation détaillée avec prix
- **Commande simple** : processus en quelques clics
- **Commandes multiples** : possibilité de commander plusieurs packs
- **Intégration Stripe** : paiements sécurisés

#### 📋 **Gestion des Devis**
- **Formulaire de devis** : demande personnalisée
- **Suivi en temps réel** : état des demandes
- **Historique** : consultation des devis précédents

#### 📧 **Communication**
- **Formulaire de contact** : envoi d'emails avec confirmation
- **Support intégré** : communication directe
- **Notifications** : alertes automatiques

#### 👤 **Espace Personnel**
- **Authentification multi-fournisseurs** : Email/MDP + Google OAuth
- **Profil utilisateur** : gestion des informations
- **Avatar dynamique** : importé depuis Google ou upload

### 🛡️ Côté Administration

#### 🎛️ **Dashboard Sécurisé**
- **Accès exclusif** : uniquement pour `jadisara33@gmail.com`
- **Routes protégées** : toutes les routes `/dashboard/*` sécurisées
- **Interface moderne** : design responsive et intuitif

#### 📊 **Gestion Complète**
- **Commandes** : validation et suivi
- **Devis** : traitement et réponse
- **Utilisateurs** : gestion des comptes
- **Analytics** : statistiques et rapports

---

## 🛡️ Sécurité

### 🔒 **Score de sécurité : 9.5/10**

Notre plateforme intègre **11 catégories de protections** pour une sécurité maximale :

#### 🎯 **Protections Actives**
- ✅ **Injection SQL** : Requêtes paramétrées + ESLint
- ✅ **XSS** : CSP complète + validation stricte  
- ✅ **CSRF** : SameSite cookies + CORS contrôlé
- ✅ **Clickjacking** : X-Frame-Options: DENY
- ✅ **Force brute** : Rate limiting intelligent
- ✅ **Man-in-the-Middle** : HSTS + SSL/TLS
- ✅ **Data exposure** : Headers sécurité complets
- ✅ **Payment fraud** : Stripe sécurisé + webhooks

#### 🛠️ **Implémentations Techniques**
- **NextAuth.js** : Sessions JWT avec cookies sécurisés
- **Rate limiting** : Multi-niveaux avec logging
- **Headers HTTP** : 13 headers de sécurité configurés
- **Validation Zod** : Schémas stricts pour toutes les données
- **Monitoring Sentry** : Surveillance en temps réel
- **0 vulnérabilité** : Audit dépendances propre

> 📋 **Pour le détail complet** : Voir [SECURITY.md](./SECURITY.md)

---

## 🚀 Démarrage rapide

### 📋 Prérequis

- **Node.js** 20+ et npm 9+
- **PostgreSQL** 15+ (ou équivalent compatible)
- **Git** pour le version control
- **Comptes externes** :
  - Google OAuth (Client ID/Secret)
  - Stripe (Clés de test/production)

### ⚡ Installation

```bash
# Clonage du projet
git clone <repository-url>
cd App-Ytech-Solutions-Commerce

# Installation des dépendances
npm install

# Configuration des variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés

# Démarrage en développement
npm run dev
```

### 🌐 Accès rapide

- **Application** : http://localhost:3000
- **Dashboard admin** : http://localhost:3000/dashboard (admin uniquement)
- **API docs** : http://localhost:3000/api (routes disponibles)

---

## ⚙️ Configuration

### 📄 Variables d'environnement

Créez un fichier `.env` à la racine :

```bash
# ===========================================
# 🗄️ Base de données PostgreSQL
# ===========================================
POSTGRES_USER="your_db_user"
POSTGRES_PASSWORD="your_secure_password"
POSTGRES_HOST="localhost"
POSTGRES_DATABASE="ytech_commerce"
POSTGRES_PORT="5432"

# ===========================================
# 🔐 Authentification NextAuth
# ===========================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-32-chars-min"

# ===========================================
# 🌐 Fournisseurs OAuth
# ===========================================
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ===========================================
# 💳 Paiement Stripe
# ===========================================
STRIPE_PUBLIC_KEY="pk_test_your_key"
STRIPE_SECRET_KEY="sk_test_your_secret"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# ===========================================
# 📧 Emails (SMTP)
# ===========================================
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_SECURE="false"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="Ytech Solutions <noreply@ytech-solutions.com>"
ADMIN_EMAIL="admin@ytech-solutions.com"

# ===========================================
# 📊 Monitoring Sentry
# ===========================================
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"

# ===========================================
# 🔧 Configuration
# ===========================================
NODE_ENV="development"
```

### 🗄️ **Setup Base de Données**

```sql
-- Créer la base de données
CREATE DATABASE ytech_commerce;

-- Créer l'utilisateur (si nécessaire)
CREATE USER ytech_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ytech_commerce TO ytech_user;
```

---

## 🏗️ Architecture

### 📁 **Structure du Projet**

```
src/
├── app/                    # App Router Next.js 13+
│   ├── (auth)/            # Routes d'authentification
│   ├── dashboard/         # Dashboard admin (protégé)
│   ├── api/              # Routes API
│   └── globals.css       # Styles globaux
├── components/           # Composants React réutilisables
│   ├── ui/              # Composants UI (shadcn/ui)
│   └── forms/           # Formulaires
├── lib/                 # Bibliothèques utilitaires
│   ├── auth.ts          # Configuration NextAuth
│   ├── db.ts            # Connexion PostgreSQL
│   ├── security.ts      # Utilitaires sécurité
│   └── rate-limiting.ts # Rate limiting
├── hooks/               # Hooks React personnalisés
├── types/               # Types TypeScript
└── middleware.ts        # Middleware Next.js (sécurité)
```

### 🔧 **Patterns Architecture**

- **App Router** : Next.js 13+ avec layouts et streaming
- **Server Components** : Optimisation performance
- **Middleware** : Sécurité et rate limiting
- **TypeScript strict** : Typage complet
- **Composants modulaires** : Architecture réutilisable

---

## 📊 Stack Technique

### 🎯 **Frontend**
- **Next.js 16** : React framework avec App Router
- **TypeScript 5.x** : Typage statique
- **Tailwind CSS 4.x** : Styling utilitaire
- **Framer Motion** : Animations fluides
- **Radix UI** : Composants accessibles
- **Lucide React** : Icônes modernes

### 🔧 **Backend**
- **Next.js API Routes** : Backend intégré
- **PostgreSQL** : Base de données principale
- **NextAuth.js 4** : Authentification complète
- **Prisma** : ORM (optionnel pour migrations)

### 🛡️ **Sécurité**
- **bcryptjs** : Hashage mots de passe
- **Helmet** : Headers sécurité
- **express-rate-limit** : Rate limiting
- **Zod** : Validation schémas
- **Sentry** : Monitoring erreurs

### 💳 **Intégrations**
- **Stripe** : Paiements sécurisés
- **Nodemailer** : Emails transactionnels
- **Google OAuth** : Authentification sociale
- **Supabase** : Services BDD additionnels

---

## 🔧 Développement

### 📝 **Scripts disponibles**

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build production
npm run start        # Serveur production

# Qualité
npm run lint         # ESLint
npm run type-check   # Vérification TypeScript

# Sécurité
npm audit            # Audit dépendances
npm audit --omit=dev # Production uniquement
```

### 🧪 **Tests et Qualité**

- **ESLint Security Plugin** : 18 règles sécurité activées
- **TypeScript strict** : Validation à la compilation
- **Audit dépendances** : 0 vulnérabilité en production
- **Headers sécurité** : Configuration CSP complète

### 🔄 **Déploiement**

#### 🐳 **Docker (Recommandé)**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### ☁️ **Vercel (Recommandé)**
```bash
# Installation CLI
npm i -g vercel

# Déploiement
vercel --prod
```

#### 🚀 **Autres plateformes**
- **Netlify** : Build statique + fonctions
- **AWS** : ECS ou Lambda
- **DigitalOcean** : App Platform

---

## 📜 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

### 📄 **Conditions d'utilisation**

- ✅ **Usage commercial** autorisé
- ✅ **Modification** autorisée  
- ✅ **Distribution** autorisée
- ✅ **Usage privé** autorisé

### ⚠️ **Responsabilité**

Le logiciel est fourni "tel quel", sans garantie d'aucune sorte. En cas d'utilisation en production, assurez-vous de :

1. **Configurer toutes les variables d'environnement**
2. **Activer SSL/TLS en production**
3. **Mettre à jour régulièrement les dépendances**
4. **Configurer les backups de base de données**

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

---

## 📞 Support

- **Email** : support@ytech-solutions.com
- **Documentation** : [SECURITY.md](./SECURITY.md)
- **Issues** : GitHub Issues

---

*Dernière mise à jour : Avril 2026*  
*Version : 1.0.0*  
*Plateforme : Next.js 16 + TypeScript + PostgreSQL*
