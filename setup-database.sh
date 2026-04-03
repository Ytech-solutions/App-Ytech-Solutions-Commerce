#!/bin/bash

# Script d'installation automatique de la base de données
# Usage: ./setup-database.sh

echo "🗄️ Installation de la base de données Ytech Solutions Commerce..."

# Variables (modifiez selon votre configuration)
DB_NAME="ytech_commerce"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Vérifier si PostgreSQL est en cours d'exécution
if ! pg_isready -h $DB_HOST -p $DB_PORT; then
    echo "❌ PostgreSQL n'est pas en cours d'exécution"
    exit 1
fi

echo "✅ PostgreSQL est en cours d'exécution"

# Créer la base de données si elle n'existe pas
echo "📊 Création de la base de données $DB_NAME..."
createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME 2>/dev/null || echo "📊 Base de données déjà existante"

# Exécuter les scripts SQL dans le bon ordre
echo "🔧 Création des tables..."

psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << 'EOF'
-- Fonction trigger pour updated_at (doit être créée en premier)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
EOF

# Exécuter chaque schéma
echo "👥 Création table users..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f lib/users-schema.sql

echo "📦 Création table packs..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f lib/packs-schema.sql

echo "🛒 Création table pack_orders..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f lib/pack-orders-schema.sql

echo "📋 Création table devis..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f lib/schema.sql

echo "📧 Création table contact_messages..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f lib/contact-messages-schema.sql

echo "🔐 Création table password_reset_tokens..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f lib/password-reset-schema.sql

echo "🎉 Base de données installée avec succès !"

# Vérifier les tables créées
echo ""
echo "📊 Tables créées :"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt"

echo ""
echo "✅ Installation terminée !"
echo "🔧 Configurez maintenant votre fichier .env avec les informations de la base de données"
