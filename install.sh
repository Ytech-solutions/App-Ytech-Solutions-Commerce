#!/bin/bash

# 🚀 Installation Ultra-Rapide de la Base de Données
# Usage: ./install.sh

echo "🛍️  Ytech Solutions Commerce - Installation Base de Données"
echo "=================================================="

# Couleurs pour une meilleure lisibilité
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables de configuration
DB_NAME="ytech_commerce"
DB_USER="postgres"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "${YELLOW}📋 Configuration :${NC}"
echo "   Base de données : $DB_NAME"
echo "   Utilisateur    : $DB_USER"
echo "   Dossier projet : $SCRIPT_DIR"
echo ""

# Fonction pour vérifier si PostgreSQL est installé
check_postgresql() {
    if command -v psql &> /dev/null; then
        echo -e "${GREEN}✅ PostgreSQL est installé${NC}"
        return 0
    else
        echo -e "${RED}❌ PostgreSQL n'est pas installé${NC}"
        echo -e "${YELLOW}📥 Installation requise :${NC}"
        echo "   • Windows : https://www.postgresql.org/download/windows/"
        echo "   • macOS   : brew install postgresql"
        echo "   • Linux   : sudo apt install postgresql"
        return 1
    fi
}

# Fonction pour créer la base de données
create_database() {
    echo -e "${YELLOW}🗄️  Création de la base de données...${NC}"
    
    # Vérifier si la base existe déjà
    if psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
        echo -e "${GREEN}✅ La base de données '$DB_NAME' existe déjà${NC}"
    else
        createdb "$DB_NAME" && echo -e "${GREEN}✅ Base de données créée avec succès${NC}" || {
            echo -e "${RED}❌ Erreur lors de la création de la base de données${NC}"
            return 1
        }
    fi
}

# Fonction pour créer les tables
create_tables() {
    echo -e "${YELLOW}🏗️  Création des tables...${NC}"
    
    # Créer la fonction trigger (nécessaire pour updated_at)
    echo "   🔧 Création de la fonction trigger..."
    psql -d "$DB_NAME" -c "
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
        if psql -d "$DB_NAME" -f "$SCRIPT_DIR/lib/$file" >/dev/null 2>&1; then
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
    local table_count=$(psql -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    
    echo -e "${GREEN}✅ $table_count tables créées${NC}"
    
    # Afficher les tables
    echo ""
    echo -e "${YELLOW}📋 Tables disponibles :${NC}"
    psql -d "$DB_NAME" -c "\dt" | head -10
    
    # Vérifier les données des packs
    echo ""
    echo -e "${YELLOW}📦 Packs par défaut :${NC}"
    psql -d "$DB_NAME" -c "SELECT name, price, highlighted FROM packs LIMIT 5;" 2>/dev/null || echo "   (Aucune donnée de packs)"
}

# Fonction pour afficher les prochaines étapes
next_steps() {
    echo ""
    echo -e "${GREEN}🎉 Installation terminée avec succès !${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Prochaines étapes :${NC}"
    echo "   1. Configurez votre fichier .env :"
    echo "      POSTGRES_USER=\"$DB_USER\""
    echo "      POSTGRES_PASSWORD=\"votre_mot_de_passe\""
    echo "      POSTGRES_DATABASE=\"$DB_NAME\""
    echo "      POSTGRES_HOST=\"localhost\""
    echo "      POSTGRES_PORT=\"5432\""
    echo ""
    echo "   2. Installez les dépendances :"
    echo "      npm install"
    echo ""
    echo "   3. Démarrez le projet :"
    echo "      npm run dev"
    echo ""
    echo -e "${GREEN}🚀 Votre projet sera prêt sur http://localhost:3000${NC}"
}

# Programme principal
main() {
    # Vérifier PostgreSQL
    if ! check_postgresql; then
        exit 1
    fi
    
    # Créer la base de données
    if ! create_database; then
        exit 1
    fi
    
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
