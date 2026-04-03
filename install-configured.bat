@echo off
REM 🌐 Installation Base de Données - Adapté à vos configurations
REM Usage: install-configured.bat

title Ytech Solutions Commerce - Installation Base de Données

REM Variables de configuration (adaptées à votre .env)
set DB_NAME=ytechdb
set DB_USER=prismauser
set DB_PASSWORD=ytech
set DB_HOST=192.168.2.138
set DB_PORT=5432
set SCRIPT_DIR=%~dp0

echo.
echo 🛍️  Ytech Solutions Commerce - Installation Base de Données
echo ==================================================
echo.
echo 📋 Configuration :
echo    Base de donnees : %DB_NAME%
echo    Utilisateur    : %DB_USER%
echo    Serveur        : %DB_HOST%:%DB_PORT%
echo    Dossier projet : %SCRIPT_DIR%
echo.

REM Vérifier si PostgreSQL est accessible
echo 🔍 Test de connexion au serveur PostgreSQL %DB_HOST%:%DB_PORT%...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "SELECT version();" >nul 2>&1

if %errorlevel% neq 0 (
    echo.
    echo ❌ Impossible de se connecter au serveur PostgreSQL
    echo.
    echo 🔧 Vérifications à effectuer :
    echo    1. Le serveur PostgreSQL est-il démarré sur %DB_HOST% ?
    echo    2. Le port %DB_PORT% est-il ouvert dans le firewall ?
    echo    3. L'utilisateur '%DB_USER%' existe-t-il ?
    echo    4. Le mot de passe est-il correct ?
    echo.
    echo 📋 Test de connexion manuel :
    echo    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres
    echo.
    pause
    exit /b 1
)

echo ✅ Connexion réussie au serveur PostgreSQL
echo.

REM Créer la base de données
echo 🗄️  Création de la base de données %DB_NAME%...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "CREATE DATABASE %DB_NAME%;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ✅ La base de données '%DB_NAME%' existe déjà
) else (
    echo ✅ Base de données créée avec succès
)
echo.

REM Créer la fonction trigger
echo 🔧 Création de la fonction trigger...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END; $$ language 'plpgsql';" >nul 2>&1

REM Compteur de succès
set success=0
set total=6

REM Créer les tables une par une
echo 🏗️  Création des tables...
echo.

echo    📄 Execution de users-schema.sql...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "%SCRIPT_DIR%lib\users-schema.sql" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ users-schema.sql
    set /a success+=1
) else (
    echo    ❌ users-schema.sql
)

echo    📄 Execution de packs-schema.sql...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "%SCRIPT_DIR%lib\packs-schema.sql" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ packs-schema.sql
    set /a success+=1
) else (
    echo    ❌ packs-schema.sql
)

echo    📄 Execution de pack-orders-schema.sql...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "%SCRIPT_DIR%lib\pack-orders-schema.sql" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ pack-orders-schema.sql
    set /a success+=1
) else (
    echo    ❌ pack-orders-schema.sql
)

echo    📄 Execution de schema.sql...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "%SCRIPT_DIR%lib\schema.sql" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ schema.sql
    set /a success+=1
) else (
    echo    ❌ schema.sql
)

echo    📄 Execution de contact-messages-schema.sql...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "%SCRIPT_DIR%lib\contact-messages-schema.sql" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ contact-messages-schema.sql
    set /a success+=1
) else (
    echo    ❌ contact-messages-schema.sql
)

echo    📄 Execution de password-reset-schema.sql...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "%SCRIPT_DIR%lib\password-reset-schema.sql" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ password-reset-schema.sql
    set /a success+=1
) else (
    echo    ❌ password-reset-schema.sql
)

echo.
echo 📊 Tables créées : %success%/%total%
echo.

REM Vérification finale
echo 🔍 Vérification de l'installation...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "\dt" 2>nul
if %errorlevel% equ 0 (
    echo.
    echo ✅ Installation terminée avec succès !
) else (
    echo.
    echo ❌ Erreur lors de la vérification
    pause
    exit /b 1
)

REM Afficher les packs par défaut
echo.
echo 📦 Packs par défaut :
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT name, price, highlighted FROM packs LIMIT 5;" 2>nul

echo.
echo 🎉 Installation terminée avec vos configurations !
echo.
echo 🔧 Résumé de votre configuration :
echo    🗄️  Base de données : %DB_NAME%
echo    👤 Utilisateur      : %DB_USER%
echo    🌐 Serveur          : %DB_HOST%:%DB_PORT%
echo    📧 Email admin      : jadisara33@gmail.com
echo    🔐 Google OAuth     : Configuré
echo.
echo 🚀 Maintenant exécutez :
echo    npm install
echo    npm run dev
echo.
echo 🌐 Votre site sera prêt sur http://localhost:3000
echo.
pause
