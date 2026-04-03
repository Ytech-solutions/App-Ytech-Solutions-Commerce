@echo off
REM Script d'installation automatique de la base de données pour Windows
REM Usage: setup-database.bat

echo 🗄️ Installation de la base de données Ytech Solutions Commerce...

REM Variables (modifiez selon votre configuration)
set DB_NAME=ytech_commerce
set DB_USER=postgres
set DB_HOST=localhost
set DB_PORT=5432

REM Vérifier si PostgreSQL est installé
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL n'est pas installé ou pas dans le PATH
    echo 📥 Veuillez installer PostgreSQL depuis https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo ✅ PostgreSQL est installé

REM Créer la base de données
echo 📊 Création de la base de données %DB_NAME%...
createdb -h %DB_HOST% -p %DB_PORT% -U %DB_USER% %DB_NAME% 2>nul || echo 📊 Base de données déjà existante

REM Créer la fonction trigger pour updated_at
echo 🔧 Création de la fonction trigger...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END; $$ language 'plpgsql';"

REM Exécuter chaque schéma
echo 👥 Création table users...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f lib/users-schema.sql

echo 📦 Création table packs...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f lib/packs-schema.sql

echo 🛒 Création table pack_orders...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f lib/pack-orders-schema.sql

echo 📋 Création table devis...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f lib/schema.sql

echo 📧 Création table contact_messages...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f lib/contact-messages-schema.sql

echo 🔐 Création table password_reset_tokens...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f lib/password-reset-schema.sql

echo.
echo 🎉 Base de données installée avec succès !
echo.
echo 📊 Tables créées :
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "\dt"

echo.
echo ✅ Installation terminée !
echo 🔧 Configurez maintenant votre fichier .env avec les informations de la base de données
echo.
pause
