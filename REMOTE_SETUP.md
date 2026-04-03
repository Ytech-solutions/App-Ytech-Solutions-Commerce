# 🌐 Configuration Complete - Serveur Distant

## 📋 **Processus Complet (Serveur BDD : 192.168.2.138)**

### 🎯 **Étape 1 : Sur le serveur PostgreSQL (192.168.2.138)**

#### 🔧 **Configuration PostgreSQL distante**

1. **Éditez postgresql.conf** :
```bash
# Sur le serveur 192.168.2.138
sudo nano /etc/postgresql/15/main/postgresql.conf

# Ajoutez/modifiez :
listen_addresses = '*'
port = 5432
```

2. **Éditez pg_hba.conf** :
```bash
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Ajoutez à la fin :
host    all             all             0.0.0.0/0               md5
```

3. **Redémarrez PostgreSQL** :
```bash
sudo systemctl restart postgresql
```

4. **Ouvrez le port dans le firewall** :
```bash
# Ubuntu/Debian
sudo ufw allow 5432/tcp

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --reload
```

### 🚀 **Étape 2 : Créer les tables sur le serveur distant**

#### 🪟 **Windows**
```cmd
# Double-cliquez sur
install-remote.bat

# Ou exécutez avec IP spécifique
install-remote.bat 192.168.2.138
```

#### 🍎 **macOS/Linux**
```bash
chmod +x install-remote.sh
./install-remote.sh 192.168.2.138
```

---

### ⚙️ **Étape 3 : Configuration .env (sur votre machine)**

Créez/modifiez votre fichier `.env` :

```bash
# ===========================================
# 🗄️ Base de données PostgreSQL (Serveur distant)
# ===========================================
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="votre_mot_de_passe_postgres"
POSTGRES_HOST="192.168.2.138"
POSTGRES_DATABASE="ytech_commerce"
POSTGRES_PORT="5432"

# ===========================================
# 🔐 Autres configurations
# ===========================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre_secret_key_32_caracteres_min"

# OAuth Google
GOOGLE_CLIENT_ID="votre_google_client_id"
GOOGLE_CLIENT_SECRET="votre_google_client_secret"

# Stripe
STRIPE_PUBLIC_KEY="pk_test_votre_cle"
STRIPE_SECRET_KEY="sk_test_votre_cle_secrete"

# Emails
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="votre_email@gmail.com"
EMAIL_PASS="votre_mot_de_passe_app"

NODE_ENV="development"
```

---

### 🧪 **Étape 4 : Tester la connexion**

```bash
# Test de connexion à la base distante
psql -h 192.168.2.138 -U postgres -d ytech_commerce -c "\dt"

# Si ça fonctionne, vous devriez voir vos 6 tables
```

---

### 🚀 **Étape 5 : Démarrer l'application**

```bash
# Installer les dépendances
npm install

# Démarrer le projet
npm run dev
```

---

## 🔧 **Dépannage**

### ❌ **Erreur de connexion ?**

1. **Vérifiez la connectivité** :
```bash
# Test de connexion réseau
ping 192.168.2.138

# Test du port PostgreSQL
telnet 192.168.2.138 5432
```

2. **Vérifiez les logs PostgreSQL** :
```bash
# Sur le serveur distant
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

3. **Vérifiez les permissions** :
```bash
# Sur le serveur distant
sudo -u postgres psql -c "\du"
```

### 🔒 **Sécurité recommandée**

1. **Créez un utilisateur dédié** :
```sql
-- Sur le serveur distant
CREATE USER ytech_app WITH PASSWORD 'mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE ytech_commerce TO ytech_app;
```

2. **Limitez les IP autorisées** dans pg_hba.conf :
```
# Au lieu de 0.0.0.0/0, utilisez votre IP spécifique
host    all             ytech_app        192.168.2.0/24           md5
```

---

## 🎯 **Résumé du workflow**

```
🌐 Serveur PostgreSQL (192.168.2.138)
        ↓
🔧 Configurer postgresql.conf + pg_hba.conf
        ↓
🚀 Exécuter install-remote.bat
        ↓
📊 6 tables créées + 4 packs par défaut
        ↓
⚙️ Configurer .env avec IP=192.168.2.138
        ↓
🧪 npm install
        ↓
🚀 npm run dev
        ↓
🌐 http://localhost:3000 ✨
```

---

## ✅ **Vérification finale**

Votre application fonctionne si :
- ✅ **6 tables** visibles dans PostgreSQL distant
- ✅ **4 packs** affichés sur le site
- ✅ **Connexion** utilisateur fonctionne
- ✅ **Commandes** s'enregistrent dans la BDD distante

**C'est la configuration parfaite pour production !** 🎉
