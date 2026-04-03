# 🚀 Installation Ultra-Rapide - Guide Complet

## 📋 Instructions (Super Simple)

### 🪟 **Pour Windows (Recommandé)**
1. **Double-cliquez sur** `install.bat`
2. **Attendez 30 secondes**
3. **C'est fini !** ✨

### 🍎 **Pour macOS/Linux**
```bash
# Rendez le script exécutable
chmod +x install.sh

# Exécutez-le
./install.sh
```

---

## 🎯 **Ce que font les scripts automatiquement**

### ✅ **Vérifications**
- PostgreSQL installé ?
- Base de données existe ?

### 🗄️ **Création**
- Base de données `ytech_commerce`
- Fonction trigger `updated_at`
- **6 tables** avec données par défaut

### 📊 **Tables créées**
1. `users` - Utilisateurs et authentification
2. `packs` - **4 packs par défaut** (Starter, Business, E-commerce, Enterprise)
3. `pack_orders` - Commandes de packs
4. `devis` - Demandes de devis
5. `contact_messages` - Messages de contact
6. `password_reset_tokens` - Tokens de réinitialisation

---

## 🔧 **Après l'installation**

### 1. **Configurer .env**
```bash
# Copiez le fichier d'exemple
cp .env.example .env

# Éditez avec vos informations
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="votre_mot_de_passe_postgres"
POSTGRES_DATABASE="ytech_commerce"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
```

### 2. **Installer les dépendances**
```bash
npm install
```

### 3. **Démarrer le projet**
```bash
npm run dev
```

---

## 🎉 **Résultat**

En **moins de 2 minutes**, vous aurez :
- ✅ Base de données complète
- ✅ 4 packs de démonstration
- ✅ Site e-commerce fonctionnel
- ✅ URL : http://localhost:3000

---

## 🚨 **Si problème**

### PostgreSQL non trouvé ?
```bash
# Windows : Installez depuis
https://www.postgresql.org/download/windows/

# macOS
brew install postgresql

# Linux
sudo apt install postgresql postgresql-contrib
```

### Mot de passe PostgreSQL ?
```bash
# Sous Windows, utilisez
psql -U postgres

# Sous macOS/Linux
sudo -u postgres psql
```

---

## 📞 **Support**

Si vous rencontrez un problème :
1. Vérifiez que PostgreSQL est installé
2. Vérifiez que PostgreSQL est dans le PATH (Windows)
3. Redémarrez votre terminal
4. Contactez-moi ! 😊

---

**C'est la méthode la plus simple et rapide !** 🚀
