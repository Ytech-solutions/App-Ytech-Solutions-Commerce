@echo off
REM 🚀 Installation Ultra-Rapide de la Base de Données Windows
REM Usage: double-cliquez sur install.bat

title Ytech Solutions Commerce - Installation Base de Données

echo.
echo 🛍️  Ytech Solutions Commerce - Installation Base de Données
echo ==================================================
echo.

REM Variables de configuration
set DB_NAME=ytech_commerce
set DB_USER=postgres
set SCRIPT_DIR=%~dp0

echo 📋 Configuration :
echo    Base de donnees : %DB_NAME%
echo    Utilisateur    : %DB_USER%
echo    Dossier projet : %SCRIPT_DIR%
echo.

REM Vérifier si PostgreSQL est installé
echo 🔍 Verification de PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ PostgreSQL n'est pas installé ou pas dans le PATH
    echo.
    echo 📥 Installation requise :
    echo    • Windows : https://www.postgresql.org/download/windows/
    echo    • Cochez "Add PostgreSQL to PATH" pendant l'installation
    echo.
    pause
    exit /b 1
)

echo ✅ PostgreSQL est installe
echo.

REM Créer la base de données
echo 🗄️  Creation de la base de donnees...
createdb %DB_NAME% >nul 2>&1
if %errorlevel% neq 0 (
    echo ✅ La base de donnees '%DB_NAME%' existe deja
) else (
    echo ✅ Base de donnees creee avec succes
)
echo.

REM Créer la fonction trigger
echo 🔧 Creation de la fonction trigger...
psql -d %DB_NAME% -c "CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END; $$ language 'plpgsql';" >nul 2>&1

REM Compteur de succès
set success=0
set total=6

REM Créer les tables une par une
echo 🏗️  Creation des tables...
echo.

echo    📄 Execution de users-schema.sql...
psql -d %DB_NAME% -f "%SCRIPT_DIR%lib\users-schema.sql" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ users-schema.sql
    set /a success+=1
) else (
    echo    ❌ users-schema.sql
)

echo    📄 Execution de packs-schema.sql...
psql -d %DB_NAME% -f "%SCRIPT_DIR%lib\packs-schema.sql" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ packs-schema.sql
    set /a success+=1
) else (
    echo    ❌ packs-schema.sql
)

echo    📄 Execution de pack-orders-schema.sql...
psql -d %DB_NAME% -f "%SCRIPT_DIR%lib\pack-orders-schema.sql" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ pack-orders-schema.sql
    set /a success+=1
) else (
    echo    ❌ pack-orders-schema.sql
)

echo    📄 Execution de schema.sql...
psql -d %DB_NAME% -f "%SCRIPT_DIR%lib\schema.sql" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ schema.sql
    set /a success+=1
) else (
    echo    ❌ schema.sql
)

echo    📄 Execution de contact-messages-schema.sql...
psql -d %DB_NAME% -f "%SCRIPT_DIR%lib\contact-messages-schema.sql" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ contact-messages-schema.sql
    set /a success+=1
) else (
    echo    ❌ contact-messages-schema.sql
)

echo    📄 Execution de password-reset-schema.sql...
psql -d %DB_NAME% -f "%SCRIPT_DIR%lib\password-reset-schema.sql" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ password-reset-schema.sql
    set /a success+=1
) else (
    echo    ❌ password-reset-schema.sql
)

echo.
echo 📊 Tables creees : %success%/%total%
echo.

REM Vérification finale
echo 🔍 Verification de l'installation...
psql -d %DB_NAME% -c "\dt" 2>nul
if %errorlevel% equ 0 (
    echo.
    echo ✅ Installation terminee avec succes !
) else (
    echo.
    echo ❌ Erreur lors de la verification
    pause
    exit /b 1
)

REM Afficher les packs par défaut
echo.
echo 📦 Packs par defaut :
psql -d %DB_NAME% -c "SELECT name, price, highlighted FROM packs LIMIT 5;" 2>nul

echo.
echo 🎉 Installation terminee !
echo.
echo 🔧 Prochaines etapes :
echo    1. Configurez votre fichier .env :
echo       POSTGRES_USER="%DB_USER%"
echo       POSTGRES_PASSWORD="votre_mot_de_passe"
echo       POSTGRES_DATABASE="%DB_NAME%"
echo       POSTGRES_HOST="localhost"
echo       POSTGRES_PORT="5432"
echo.
echo    2. Installez les dependances :
echo       npm install
echo.
echo    3. Demarrez le projet :
echo       npm run dev
echo.
echo 🚀 Votre projet sera pret sur http://localhost:3000
echo.
pause
