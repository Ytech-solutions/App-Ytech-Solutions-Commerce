#!/bin/bash

# 🌐 Installation Base de Données - Adapté à vos configurations
# Usage: ./install-configured.sh

# Variables de configuration (adaptées à votre .env)
DB_NAME="ytechdb"
DB_USER="prismauser"
DB_PASSWORD="ytech"
DB_HOST="192.168.2.138"
DB_PORT="5432"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Couleurs pour une meilleure lisibilité
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🛍️  Ytech Solutions Commerce - Installation Base de Données"
echo "=================================================="
echo ""
echo "📋 Configuration :"
echo "   Base de données : $DB_NAME"
echo "   Utilisateur    : $DB_USER"
echo "   Serveur        : $DB_HOST:$DB_PORT"
echo "   Dossier projet : $SCRIPT_DIR"
echo ""

# Fonction pour vérifier la connexion PostgreSQL
check_connection() {
    echo -e "${YELLOW}🔍 Test de connexion au serveur PostgreSQL...${NC}"
    
    if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "SELECT version();" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Connexion réussie au serveur PostgreSQL${NC}"
        return 0
    else
        echo -e "${RED}❌ Impossible de se connecter au serveur PostgreSQL${NC}"
        echo ""
        echo -e "${YELLOW}🔧 Vérifications à effectuer :${NC}"
        echo "   1. Le serveur PostgreSQL est-il démarré sur $DB_HOST ?"
        echo "   2. Le port $DB_PORT est-il ouvert dans le firewall ?"
        echo "   3. L'utilisateur '$DB_USER' existe-t-il ?"
        echo "   4. Le mot de passe est-il correct ?"
        echo ""
        echo -e "${YELLOW}📋 Test de connexion manuel :${NC}"
        echo "   psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres"
        return 1
    fi
}

# Fonction pour créer la base de données
create_database() {
    echo -e "${YELLOW}🗄️  Création de la base de données $DB_NAME...${NC}"
    
    if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Base de données créée avec succès${NC}"
    else
        echo -e "${GREEN}✅ La base de données '$DB_NAME' existe déjà${NC}"
    fi
}

# Fonction pour créer les tables
create_tables() {
    echo -e "${YELLOW}🏗️  Création des tables...${NC}"
    
    # Créer la fonction trigger (nécessaire pour updated_at)
    echo "   🔧 Création de la fonction trigger..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS \$\$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        \$\$ language 'plpgsql';
    " 2>/dev/null
    
    # Liste des fichiers SQL à exécuter dans l'ordre
    local sql_files=(
        "users-schema.sql"
        "packs-schema.sql" 
        "pack-orders-schema.sql"
        "schema.sql"
        "contact-messages-schema.sql"
        "password-reset-schema.sql"
    )
    
    local success_count=0
    local total_count=${#sql_files[@]}
    
    for file in "${sql_files[@]}"; do
        echo "   📄 Exécution de $file..."
        if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$SCRIPT_DIR/lib/$file" >/dev/null 2>&1; then
            echo -e "   ${GREEN}✅ $file${NC}"
            ((success_count++))
        else
            echo -e "   ${RED}❌ $file${NC}"
        fi
    done
    
    echo ""
    echo -e "${GREEN}📊 Tables créées : $success_count/$total_count${NC}"
    
    if [ $success_count -eq $total_count ]; then
        return 0
    else
        return 1
    fi
}

# Fonction pour vérifier l'installation
verify_installation() {
    echo -e "${YELLOW}🔍 Vérification de l'installation...${NC}"
    
    # Compter les tables
    local table_count=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    
    echo -e "${GREEN}✅ $table_count tables créées${NC}"
    
    # Afficher les tables
    echo ""
    echo -e "${YELLOW}📋 Tables disponibles :${NC}"
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt" | head -10
    
    # Vérifier les données des packs
    echo ""
    echo -e "${YELLOW}📦 Packs par défaut :${NC}"
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT name, price, highlighted FROM packs LIMIT 5;" 2>/dev/null || echo "   (Aucune donnée de packs)"
}

# Fonction pour afficher les prochaines étapes
next_steps() {
    echo ""
    echo -e "${GREEN}🎉 Installation terminée avec vos configurations !${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Résumé de votre configuration :${NC}"
    echo "   🗄️  Base de données : $DB_NAME"
    echo "   👤 Utilisateur      : $DB_USER"
    echo "   🌐 Serveur          : $DB_HOST:$DB_PORT"
    echo "   📧 Email admin      : jadisara33@gmail.com"
    echo "   🔐 Google OAuth     : Configuré"
    echo ""
    echo -e "${YELLOW}🚀 Maintenant exécutez :${NC}"
    echo "   npm install"
    echo "   npm run dev"
    echo ""
    echo -e "${GREEN}🌐 Votre site sera prêt sur http://localhost:3000${NC}"
}

# Programme principal
main() {
    # Vérifier la connexion
    if ! check_connection; then
        exit 1
    fi
    
    # Créer la base de données
    create_database
    
    # Créer les tables
    if ! create_tables; then
        echo -e "${RED}❌ Erreur lors de la création des tables${NC}"
        exit 1
    fi
    
    # Vérifier l'installation
    verify_installation
    
    # Afficher les prochaines étapes
    next_steps
}

# Exécuter le programme principal
main
