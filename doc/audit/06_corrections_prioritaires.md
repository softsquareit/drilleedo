# Plan d'action — Corrections prioritaires

**Date :** 2026-04-01
**Projet :** Drilleedo v2

---

## Phase 0 — Urgences (Avant toute mise en production)

> Durée estimée : 2-3 heures

### Étape 1 : Supprimer l'exposition système (5 min)
```bash
rm public/info.php
```

### Étape 2 : Sécuriser les credentials (30 min)

```bash
# Vérifier que .env.local est dans .gitignore
grep "env.local" .gitignore

# Si absent, l'ajouter
echo ".env.local" >> .gitignore
echo ".env.local.php" >> .gitignore

# Changer immédiatement le mot de passe MySQL
mysql -u root -p
ALTER USER 'admin'@'localhost' IDENTIFIED BY 'NouveauMotDePasse_Fort_2026!';
FLUSH PRIVILEGES;

# Mettre à jour .env.local avec le nouveau mot de passe
```

### Étape 3 : Restreindre les headers CORS (15 min)

Dans `public/.htaccess`, remplacer :
```apache
# AVANT
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Headers "*"
Header set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PATCH"

# APRÈS
Header set Access-Control-Allow-Origin "https://www.drilleedo.ca"
Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
Header set Access-Control-Allow-Methods "POST, GET, OPTIONS"
```

### Étape 4 : Activer l'access control Symfony (1 heure)

Dans `config/packages/security.yaml`, décommenter et compléter :
```yaml
access_control:
    - { path: ^/admin, roles: ROLE_ADMIN }
    - { path: ^/professional, roles: ROLE_PROFESSIONAL }
    - { path: ^/individual, roles: ROLE_INDIVIDUAL }
    - { path: ^/company, roles: ROLE_COMPANY }
    - { path: ^/offer, roles: ROLE_USER }
    - { path: ^/request, roles: ROLE_USER }
```

### Étape 5 : Headers de sécurité HTTP (30 min)

Dans `public/.htaccess`, ajouter :
```apache
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

---

## Phase 1 — Sécurité critique (Semaine 1)

> Durée estimée : 8-10 heures

### 1.1 Valider les fichiers uploadés (2h)

Modifier `src/Service/FileUploader.php` pour ajouter :
- Liste blanche d'extensions autorisées
- Validation du MIME type réel (pas celui déclaré)
- Limite de taille
- Protection contre l'exécution dans le dossier uploads

Voir détails dans [01_securite.md](01_securite.md#sec-05-validation-insuffisante-des-fichiers-uploadés)

### 1.2 Corriger les comparaisons d'accès par référence (1h)

Dans tous les contrôleurs, remplacer :
```php
// AVANT (risqué)
if ($entity->getOwner() !== $this->getUser()) {

// APRÈS (sûr)
if ($entity->getOwner()->getId() !== $this->getUser()->getId()) {
```

Fichiers à corriger :
- `src/Controller/CompanyController.php`
- `src/Controller/ProfessionalController.php`
- `src/Controller/OfferController.php`
- `src/Controller/DirectRequestController.php`

### 1.3 Ajouter la validation de force de mot de passe (1h)

Dans les formulaires d'inscription :
```php
#[Assert\PasswordStrength(minScore: Assert\PasswordStrength::STRENGTH_MEDIUM)]
#[Assert\Length(min: 8)]
```

### 1.4 Rate limiting sur login et inscription (3h)

Configurer `framework.rate_limiter` et appliquer dans `RegistrationController` et `SecurityController`.

---

## Phase 2 — Performance (Semaine 2-3)

> Durée estimée : 12-16 heures

### 2.1 Corriger les N+1 queries (4h)

**Priorité 1 — Sitemap (impacte tous les crawlers) :**
```php
// SitemapController.php
// Remplacer findAll() par des requêtes légères avec DTOs
$professionals = $this->professionalRepository->findForSitemap();
```

**Priorité 2 — Pages de listing (HomeController) :**
```php
// Utiliser des jointures dans les repositories
public function findPaginatedWithRelations(int $page, array $criteria): Paginator
{
    return $this->createQueryBuilder('p')
        ->leftJoin('p.category', 'c')->addSelect('c')
        ->leftJoin('p.personalInfos', 'pi')->addSelect('pi')
        // ...
        ->getQuery();
}
```

**Priorité 3 — Dashboard admin :**
```php
// Regrouper les COUNT en une seule requête
$stats = $this->dashboardRepository->getStats();
```

### 2.2 Optimiser les assets (4h)

```bash
# Installer Webpack Encore
composer require symfony/webpack-encore-bundle
npm install @symfony/webpack-encore --save-dev
npm install sass-loader sass --save-dev
```

Objectifs :
- 1 fichier CSS bundlé (au lieu de 15+)
- 1 fichier JS bundlé (au lieu de 10+)
- Versioning automatique pour cache busting

### 2.3 Ajouter lazy loading images (2h)

Dans tous les templates avec images :
```twig
<img src="..." alt="..." loading="lazy" width="X" height="Y">
```

### 2.4 Cache sitemap (1h)

Voir [02_performance.md](02_performance.md#perf-08-sitemap-sans-cache)

### 2.5 Configurer Redis pour la production (2h)

```yaml
# config/packages/prod/framework.yaml
framework:
    cache:
        app: cache.adapter.redis
```

---

## Phase 3 — SEO et Qualité (Semaine 3-4)

> Durée estimée : 12-16 heures

### 3.1 Schema.org sur les profils (3h)
- LocalBusiness sur les pages profil professionnel
- LocalBusiness sur les pages profil entreprise
- Voir [05_seo.md](05_seo.md#seo-01-schemaorg-manquant-sur-les-pages-profil)

### 3.2 Schema.org Articles blog (2h)
- Article schema sur les détails d'articles
- Voir [05_seo.md](05_seo.md#seo-02-schemaorg-manquant-sur-les-articles-de-blog)

### 3.3 Breadcrumbs (3h)
- Créer le partial `_breadcrumbs.html.twig`
- Intégrer sur toutes les pages secondaires
- Voir [05_seo.md](05_seo.md#seo-03-breadcrumbs-manquants-navigation--schema)

### 3.4 Corriger les bugs identifiés (4h)
- BUG-01 : count() sur paginator
- BUG-04 : updatedAt manquant
- BUG-05 : File upload obligatoire en édition
- WARN-03 : Slug unique

### 3.5 robots.txt optimisé (30 min)
- Voir [05_seo.md](05_seo.md#seo-08-robotstxt-non-optimisé)

---

## Phase 4 — Refactoring et Tests (Mois 2)

> Durée estimée : 20-30 heures

### 4.1 Refactoring AdminController (8h)
Découper en 8-10 contrôleurs spécialisés dans `src/Controller/Admin/`

### 4.2 Mise en place des tests (10h)
- Tests fonctionnels pour les routes critiques
- Tests unitaires pour les services

### 4.3 Analyse statique (2h)
```bash
composer require --dev phpstan/phpstan
vendor/bin/phpstan analyse src/ --level=5
```

### 4.4 Documentation (4h)
- Documenter les entités et leurs relations
- Documenter les workflows métier (devis, demandes directes)

---

## Checklist de déploiement production

Avant tout déploiement en production, vérifier :

- [ ] `public/info.php` supprimé
- [ ] `.env.local` non versionné, credentials changés
- [ ] Headers CORS restreints
- [ ] Access control activé dans security.yaml
- [ ] Headers de sécurité HTTP ajoutés
- [ ] `APP_ENV=prod` configuré
- [ ] `APP_DEBUG=0` configuré
- [ ] Cache Doctrine configuré
- [ ] Sessions sécurisées (HTTPS, HttpOnly, SameSite)
- [ ] Logs d'erreur configurés (pas dans le navigateur)
- [ ] HTTPS forcé
- [ ] Dossier `var/` non accessible publiquement
- [ ] Dossier `uploads/` sans exécution PHP
- [ ] Sitemap soumis à Google Search Console
- [ ] robots.txt mis à jour

```bash
# Commandes de vérification pré-production
php bin/console lint:twig templates/
php bin/console lint:yaml config/
php bin/console doctrine:schema:validate
php bin/console security:check
php bin/console debug:router | grep -v "_profiler"
```

---

## Résumé des efforts estimés

| Phase | Description | Durée | Priorité |
|-------|-------------|-------|----------|
| Phase 0 | Urgences sécurité | 2-3h | IMMÉDIAT |
| Phase 1 | Sécurité critique | 8-10h | Semaine 1 |
| Phase 2 | Performance | 12-16h | Semaine 2-3 |
| Phase 3 | SEO + Bugs | 12-16h | Semaine 3-4 |
| Phase 4 | Refactoring + Tests | 20-30h | Mois 2 |
| **Total** | | **54-75h** | |

---

## Tableau de bord global

| Domaine | Score actuel | Score cible | Bloquant prod ? |
|---------|-------------|-------------|-----------------|
| Sécurité | 3/10 | 8/10 | OUI |
| Performance | 5/10 | 8/10 | NON |
| Qualité code | 6/10 | 8/10 | NON |
| SEO | 6/10 | 9/10 | NON |
| Tests | 0/10 | 7/10 | NON |
| **Global** | **4/10** | **8/10** | |
