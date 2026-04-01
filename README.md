# Ytech Solutions Commerce

[![Security Status](https://img.shields.io/badge/Security-Score%209%2F10-green)](./SECURITY.md)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

Plateforme e-commerce moderne (Next.js App Router) avec authentification, fonctionnalités packs/devis, intégration paiement et **durcissement sécurité** (headers, rate limiting, sessions sécurisées).

## Table des Matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Sécurité (points forts)](#sécurité-points-forts)
- [Démarrage rapide](#démarrage-rapide)
- [Configuration](#configuration)
- [Licence](#licence)

---

## Présentation

Ytech Solutions Commerce est une application Next.js construite autour de :
- **Parcours client**: commande de packs, demandes de devis, contact
- **Authentification**: email/mot de passe + Google OAuth (NextAuth)
- **Administration**: accès dashboard **réservé à l’admin** (`jadisara33@gmail.com`)

---

## Fonctionnalités

### Côté client
- **Packs**: consultation + commande (y compris commandes multiples)
- **Devis**: création et suivi des demandes
- **Contact**: formulaire avec envoi d’emails
- **Compte**: connexion/déconnexion + avatar (Google ou credentials)

### Côté admin
- **Dashboard**: routes `/dashboard/*` protégées (admin only)
- **Gestion**: actions admin disponibles via routes API dédiées

---

## Sécurité (points forts)

- **Sessions sécurisées**: NextAuth (JWT) + cookies HTTPOnly/`secure` en production (`lib/auth.ts`)
- **Contrôle d’accès serveur**: `/dashboard/*` autorisé uniquement pour `jadisara33@gmail.com` (`middleware.ts`)
- **Durcissement HTTP**: HSTS, CSP durcie, anti-clickjacking, anti-MIME sniffing, COOP/CORP (`next.config.js` + `middleware.ts`)
- **Rate limiting**: protections API/auth/formulaires (`middleware.ts`, `lib/api-security.ts`, `lib/rate-limiting.ts`)
- **Chaîne de dépendances**: `npm audit --omit=dev` à **0 vulnérabilité** (prod)

Pour le détail technique des protections activées, voir `SECURITY.md`.

---

## Démarrage rapide

### 📋 Prérequis

- **Node.js** 20+ et npm 9+
- **PostgreSQL** 15+ ou équivalent
- **Git** pour le version control

### ⚡ Installation

```bash
npm install
npm run dev
```

## Configuration

```bash
# Database (PostgreSQL)
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
```

## Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

*Dernière mise à jour : Avril 2026*
