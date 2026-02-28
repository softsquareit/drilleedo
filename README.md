# Drilleedo v2 - Symfony 7.4 Professional Project

Ce projet est une installation propre et stable de Symfony 7.4, optimisée pour un usage professionnel.

## Prérequis

- PHP 8.2+ (PHP 8.4 recommandé)
- Composer
- MySQL/MariaDB

## Installation locale

1. **Cloner le projet**
   ```bash
   # Si non déjà présent
   git clone <votre-repo> drilledov2
   cd drilledov2
   ```

2. **Configuration de l'environnement**
   Le fichier `.env.local` est déjà configuré avec vos paramètres MySQL :
   ```env
   DATABASE_URL="mysql://root:622280@localhost:3306/drilleedov2?serverVersion=8.0&charset=utf8mb4"
   ```

3. **Installer les dépendances**
   ```bash
   php composer.phar install
   ```
   *(Note: Utilisez `composer install` si composer est installé globalement)*

4. **Créer la base de données**
   ```bash
   php bin/console doctrine:database:create --if-not-exists
   ```

5. **Lancer le serveur**

   **Via Symfony CLI (Recommandé) :**
   ```bash
   symfony server:start
   ```

   **Via le serveur PHP intégré :**
   ```bash
   php -S localhost:8000 -t public
   ```

## Structure Professionnelle

- `src/Controller/` : Controller d'accueil premium inclus.
- `templates/` : Templates Twig avec intégration Tailwind CSS.
- `public/` : Point d'entrée optimisé.
- `.env.local` : Configuration sécurisée pour le développement local.

## Bonnes Pratiques Appliquées

- Architecture conforme aux standards Symfony.
- Utilisation de `webapp-pack` pour un outillage complet.
- Configuration MySQL robuste.
- Design responsive et moderne.
