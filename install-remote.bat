@echo off
REM 🌐 Installation Base de Données - Serveur Distant Windows
REM Usage: install-remote.bat [IP_DU_SERVEUR]

title Ytech Solutions Commerce - Installation Serveur Distant

set DB_SERVER_IP=%1
if "%DB_SERVER_IP%"=="" set DB_SERVER_IP=192.168.2.138

set DB_NAME=ytech_commerce
set DB_USER=postgres
set DB_PORT=5432

echo.
echo 🌐 Installation sur serveur distant : %DB_SERVER_IP%
echo =================================================
echo.

REM Test de connexion au serveur distant
echo 🔍 Test de connexion au serveur PostgreSQL...
pg_isready -h %DB_SERVER_IP% -p %DB_PORT% >nul 2>&1

if %errorlevel% neq 0 (
    echo.
    echo ❌ Impossible de se connecter au serveur PostgreSQL sur %DB_SERVER_IP%:%DB_PORT%
    echo.
    echo 🔧 Vérifications à effectuer :
    echo    1. Le serveur PostgreSQL est-il démarré sur %DB_SERVER_IP% ?
    echo    2. Le port %DB_PORT% est-il ouvert dans le firewall ?
    echo    3. postgresql.conf autorise-t-il les connexions distantes ?
    echo    4. pg_hba.conf configure-t-il votre IP ?
    echo.
    echo 📋 Configuration postgresql.conf :
    echo    listen_addresses = '*'
    echo.
    echo 📋 Configuration pg_hba.conf (à ajouter) :
    echo    host    all             all             0.0.0.0/0               md5
    echo.
    pause
    exit /b 1
)

echo ✅ Connexion réussie au serveur PostgreSQL
echo.

REM Création de la base de données
echo 🗄️  Création de la base de données %DB_NAME%...
psql -h %DB_SERVER_IP% -p %DB_PORT% -U %DB_USER% -c "CREATE DATABASE %DB_NAME%;" >nul 2>&1
if %errorlevel% neq 0 echo ✅ Base de données déjà existante

REM Création de la fonction trigger
echo 🔧 Création de la fonction trigger...
psql -h %DB_SERVER_IP% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END; $$ language 'plpgsql';" >nul 2>&1

REM Création des tables
echo 🏗️  Création des tables...

echo    📄 users-schema.sql...
psql -h %DB_SERVER_IP% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "lib\users-schema.sql" >nul 2>&1
if %errorlevel% equ 0 echo    ✅ users-schema.sql

echo    📄 packs-schema.sql...
psql -h %DB_SERVER_IP% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "lib\packs-schema.sql" >nul 2>&1
if %errorlevel% equ 0 echo    ✅ packs-schema.sql

echo    📄 pack-orders-schema.sql...
psql -h %DB_SERVER_IP% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "lib\pack-orders-schema.sql" >nul 2>&1
if %errorlevel% equ 0 echo    ✅ pack-orders-schema.sql

echo    📄 schema.sql...
psql -h %DB_SERVER_IP% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "lib\schema.sql" >nul 2>&1
if %errorlevel% equ 0 echo    ✅ schema.sql

echo    📄 contact-messages-schema.sql...
psql -h %DB_SERVER_IP% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "lib\contact-messages-schema.sql" >nul 2>&1
if %errorlevel% equ 0 echo    ✅ contact-messages-schema.sql

echo    📄 password-reset-schema.sql...
psql -h %DB_SERVER_IP% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "lib\password-reset-schema.sql" >nul 2>&1
if %errorlevel% equ 0 echo    ✅ password-reset-schema.sql

echo.
echo 🔍 Vérification de l'installation...
psql -h %DB_SERVER_IP% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "\dt"

echo.
echo 🎉 Installation terminée sur le serveur distant !
echo.
echo 🔧 Configuration .env pour votre application :
echo    POSTGRES_HOST="%DB_SERVER_IP%"
echo    POSTGRES_DATABASE="%DB_NAME%"
echo    POSTGRES_USER="%DB_USER%"
echo    POSTGRES_PASSWORD="votre_mot_de_passe"
echo    POSTGRES_PORT="%DB_PORT%"
echo.
pause
