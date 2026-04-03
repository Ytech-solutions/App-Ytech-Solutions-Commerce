#!/bin/bash

# 🌐 Installation Base de Données - Serveur Distant
# Usage: ./install-remote.sh [IP_DU_SERVEUR]

# Variables
DB_SERVER_IP=${1:-"192.168.2.138"}
DB_NAME="ytech_commerce"
DB_USER="postgres"
DB_PORT="5432"

echo "🌐 Installation sur serveur distant : $DB_SERVER_IP"
echo "================================================"

# Test de connexion au serveur distant
echo "🔍 Test de connexion au serveur PostgreSQL..."
pg_isready -h $DB_SERVER_IP -p $DB_PORT

if [ $? -ne 0 ]; then
    echo "❌ Impossible de se connecter au serveur PostgreSQL sur $DB_SERVER_IP:$DB_PORT"
    echo ""
    echo "🔧 Vérifications à effectuer :"
    echo "   1. Le serveur PostgreSQL est-il démarré sur $DB_SERVER_IP ?"
    echo "   2. Le port $DB_PORT est-il ouvert dans le firewall ?"
    echo "   3. postgresql.conf autorise-t-il les connexions distantes ?"
    echo "   4. pg_hba.conf configure-t-il votre IP ?"
    echo ""
    echo "📋 Configuration postgresql.conf :"
    echo "   listen_addresses = '*'"
    echo ""
    echo "📋 Configuration pg_hba.conf (à ajouter) :"
    echo "   host    all             all             0.0.0.0/0               md5"
    exit 1
fi

echo "✅ Connexion réussie au serveur PostgreSQL"
echo ""

# Création de la base de données
echo "🗄️  Création de la base de données $DB_NAME..."
psql -h $DB_SERVER_IP -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "✅ Base de données déjà existante"

# Création de la fonction trigger
echo "🔧 Création de la fonction trigger..."
psql -h $DB_SERVER_IP -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS \$\$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
\$\$ language 'plpgsql';
" 2>/dev/null

# Création des tables
echo "🏗️  Création des tables..."

# Liste des fichiers SQL
sql_files=(
    "lib/users-schema.sql"
    "lib/packs-schema.sql" 
    "lib/pack-orders-schema.sql"
    "lib/schema.sql"
    "lib/contact-messages-schema.sql"
    "lib/password-reset-schema.sql"
)

for file in "${sql_files[@]}"; do
    echo "   📄 $file..."
    if psql -h $DB_SERVER_IP -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$file" >/dev/null 2>&1; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file"
    fi
done

# Vérification
echo ""
echo "🔍 Vérification de l'installation..."
psql -h $DB_SERVER_IP -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt"

echo ""
echo "🎉 Installation terminée sur le serveur distant !"
echo ""
echo "🔧 Configuration .env pour votre application :"
echo "   POSTGRES_HOST=\"$DB_SERVER_IP\""
echo "   POSTGRES_DATABASE=\"$DB_NAME\""
echo "   POSTGRES_USER=\"$DB_USER\""
echo "   POSTGRES_PASSWORD=\"votre_mot_de_passe\""
echo "   POSTGRES_PORT=\"$DB_PORT\""
