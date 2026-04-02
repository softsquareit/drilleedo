# Audit Performance - Drilleedo v2

**Date :** 2026-04-01

---

## Problèmes identifiés

---

### [PERF-01] Problème N+1 — findAll() sans eager loading

**Niveau :** ÉLEVÉ
**Fichiers affectés :** `src/Controller/AdminController.php`, `src/Controller/HomeController.php`, `src/Controller/SitemapController.php`

**Description :**
L'utilisation de `findAll()` charge toutes les entités en mémoire sans les relations. Lorsqu'ensuite on accède aux relations (ex: `$professional->getCategory()`), Doctrine génère une requête SQL par entité → problème N+1.

**Exemples concrets :**

```php
// AdminController.php ~ligne 208
$companies = $companyRepository->findAll();   // 1 requête → N entités
$categories = $categoryRepository->findAll(); // 1 requête → M entités

// SitemapController.php ligne 41, 49
$professionals = $professionalRepository->findAll(); // Charge TOUT en mémoire
$companies = $companyRepository->findAll();          // Idem
```

**Impact :** Avec 100 professionnels, cela peut générer 300+ requêtes SQL par page.

**Correction — Repositories avec JOIN :**

```php
// src/Repository/ProfessionalRepository.php
public function findAllWithRelations(): array
{
    return $this->createQueryBuilder('p')
        ->leftJoin('p.category', 'c')
        ->addSelect('c')
        ->leftJoin('p.personalInfos', 'pi')
        ->addSelect('pi')
        ->leftJoin('p.adress', 'a')
        ->addSelect('a')
        ->getQuery()
        ->getResult();
}

// Pour le sitemap (seulement les champs nécessaires)
public function findForSitemap(): array
{
    return $this->createQueryBuilder('p')
        ->select('p.id, p.slug, p.updatedAt')
        ->where('p.isActive = :active')
        ->setParameter('active', true)
        ->getQuery()
        ->getArrayResult(); // Tableau PHP, plus léger qu'un objet Doctrine
}
```

---

### [PERF-02] Requêtes COUNT multiples dans le dashboard admin

**Fichier :** `src/Controller/AdminController.php` (méthode dashboard)
**Niveau :** MOYEN

**Problème :** Le dashboard exécute 5+ requêtes `COUNT` séparées :
```php
$totalProfessionals = count($professionalRepository->findAll());
$totalCompanies = count($companyRepository->findAll());
$totalUsers = count($userRepository->findAll());
// etc.
```

**Correction — Une seule requête avec sous-requêtes :**
```php
// src/Repository/DashboardRepository.php (nouveau fichier)
public function getStats(): array
{
    $conn = $this->getEntityManager()->getConnection();
    $sql = "
        SELECT
            (SELECT COUNT(*) FROM user WHERE type = 'professional') as total_professionals,
            (SELECT COUNT(*) FROM user WHERE type = 'company') as total_companies,
            (SELECT COUNT(*) FROM user WHERE type = 'individual') as total_individuals,
            (SELECT COUNT(*) FROM quote_request WHERE status = 'pending') as pending_requests,
            (SELECT COUNT(*) FROM blog WHERE published = 1) as total_blogs
    ";
    return $conn->executeQuery($sql)->fetchAssociative();
}
```

---

### [PERF-03] Pagination incorrecte — count() sur résultats paginés

**Fichier :** `src/Controller/HomeController.php` (lignes ~105, ~150)
**Niveau :** MOYEN

```php
// Problème : count() sur un objet Pagerfanta retourne le nombre de la page courante
// et non le total
$professionals = $repository->findPaginated($page);
$count = count($professionals); // INCORRECT — retourne max items_per_page
```

**Correction :**
```php
// Pagerfanta expose getNbResults() pour le total
$paginator = $repository->findPaginated($page);
$totalCount = $paginator->getNbResults(); // Total réel
$currentPageItems = iterator_to_array($paginator); // Items de la page courante
```

---

### [PERF-04] Assets CSS/JS non optimisés

**Fichier :** `templates/base.html.twig`
**Niveau :** MOYEN

**Problème :** Chargement de 15+ fichiers CSS et 10+ fichiers JS séparément sans minification ni bundling :

```html
<!-- Exemple de ce qui est chargé -->
<link rel="stylesheet" href="{{ asset('assets/css/bootstrap.min.css') }}">
<link rel="stylesheet" href="{{ asset('assets/css/slick.css') }}">
<link rel="stylesheet" href="{{ asset('assets/css/font-awesome.min.css') }}">
<link rel="stylesheet" href="{{ asset('assets/css/feather.css') }}">
<link rel="stylesheet" href="{{ asset('assets/css/animate.css') }}">
<!-- + 10 autres fichiers CSS -->
```

**Impact :** ~15 requêtes HTTP supplémentaires par chargement de page.

**Correction — Intégrer Webpack Encore :**
```bash
composer require symfony/webpack-encore-bundle
npm install @symfony/webpack-encore --save-dev
npm install
```

```javascript
// webpack.config.js
const Encore = require('@symfony/webpack-encore');
Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/app.js')
    .addStyleEntry('styles', './assets/styles/app.scss')
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .cleanupOutputBeforeBuild()
    .enableSassLoader()
;
module.exports = Encore.getWebpackConfig();
```

---

### [PERF-05] Images non optimisées

**Dossier :** `public/uploads/`
**Niveau :** MOYEN

**Problèmes identifiés :**
- Images PNG/JPG uploadées sans compression
- Pas de format WebP proposé
- Pas d'attribut `loading="lazy"` sur les images hors viewport
- Pas de dimensions `width`/`height` définies (cause de Cumulative Layout Shift)

**Corrections :**

1. **Compression à l'upload :**
```php
// src/Service/ImageOptimizer.php (nouveau service)
use Imagine\Gd\Imagine;
use Imagine\Image\Box;

class ImageOptimizer
{
    private const MAX_WIDTH = 1200;
    private const MAX_HEIGHT = 800;

    public function resize(string $path): void
    {
        $imagine = new Imagine();
        $image = $imagine->open($path);
        $size = $image->getSize();

        if ($size->getWidth() > self::MAX_WIDTH || $size->getHeight() > self::MAX_HEIGHT) {
            $image->thumbnail(new Box(self::MAX_WIDTH, self::MAX_HEIGHT))
                  ->save($path, ['quality' => 85]);
        }
    }
}
```

2. **Lazy loading dans les templates :**
```twig
{# Avant #}
<img src="{{ asset(professional.photo) }}" alt="{{ professional.name }}">

{# Après #}
<img src="{{ asset(professional.photo) }}"
     alt="{{ professional.name }}"
     loading="lazy"
     width="300"
     height="200">
```

---

### [PERF-06] Requêtes LIKE sans index Full-Text

**Fichier :** `src/Repository/ProfessionalRepository.php`
**Niveau :** MOYEN

```php
// Recherche avec LIKE %keyword% — très lente sur grandes tables
->andWhere('p.name LIKE :q OR p.description LIKE :q')
->setParameter('q', '%' . $q . '%')
```

**Correction — Full-Text Search MySQL :**
```sql
-- Migration : ajouter index FULLTEXT
ALTER TABLE professional ADD FULLTEXT INDEX ft_search (name, description, city);
```

```php
// Repository avec MATCH AGAINST
public function searchByKeyword(string $q): array
{
    $conn = $this->getEntityManager()->getConnection();
    $sql = "
        SELECT p.*, MATCH(p.name, p.description, p.city) AGAINST (:q IN BOOLEAN MODE) as relevance
        FROM user p
        WHERE p.type = 'professional'
          AND MATCH(p.name, p.description, p.city) AGAINST (:q IN BOOLEAN MODE)
        ORDER BY relevance DESC
        LIMIT 50
    ";
    return $conn->executeQuery($sql, ['q' => $q . '*'])->fetchAllAssociative();
}
```

---

### [PERF-07] AdminController monolithique — impact mémoire

**Fichier :** `src/Controller/AdminController.php`
**Niveau :** MOYEN

Le fichier fait plus de **22 000 lignes**. Cela cause :
- Temps de compilation PHP plus long
- Difficultés de cache OPcache
- Maintenance complexe

**Correction — Diviser en sous-contrôleurs :**
```
src/Controller/Admin/
    DashboardController.php
    ProfessionalController.php
    CompanyController.php
    UserController.php
    BlogController.php       (existe déjà dans Dashboard/)
    CategoryController.php
    RequestController.php
    TestimonialController.php
```

---

### [PERF-08] Sitemap sans cache

**Fichier :** `src/Controller/SitemapController.php`
**Niveau :** FAIBLE-MOYEN

Le sitemap est regénéré à chaque requête en chargeant toutes les entités. Avec des milliers de professionnels/companies, c'est très coûteux.

**Correction :**
```php
use Symfony\Component\HttpKernel\Attribute\Cache;

#[Route('/sitemap.xml', name: 'sitemap')]
#[Cache(public: true, maxage: 3600, smaxage: 86400)] // Cache 1h navigateur, 24h CDN
public function index(): Response
{
    // Utiliser des DTOs légers plutôt que des entités complètes
    $professionals = $this->professionalRepository->findForSitemap();
    // ...
}
```

---

### [PERF-09] Sessions et cache non configurés pour la production

**Fichier :** `config/packages/framework.yaml`
**Niveau :** FAIBLE

**Recommandation :**
```yaml
# config/packages/prod/framework.yaml
framework:
    session:
        handler_id: 'redis://localhost'  # ou Memcached
        cookie_secure: true
        cookie_httponly: true
        cookie_samesite: 'lax'
    cache:
        app: cache.adapter.redis
        default_redis_provider: 'redis://localhost'
```

---

## Récapitulatif performance

| ID | Description | Impact | Effort | Priorité |
|----|-------------|--------|--------|----------|
| PERF-01 | N+1 queries findAll() | Critique sur prod | 4h | P1 |
| PERF-02 | COUNT multiples dashboard | Moyen | 2h | P2 |
| PERF-03 | count() sur paginator | Faible | 30 min | P2 |
| PERF-04 | Assets non bundlés | Moyen | 4h | P2 |
| PERF-05 | Images non optimisées | Moyen | 3h | P2 |
| PERF-06 | LIKE sans Full-Text | Élevé sur prod | 3h | P2 |
| PERF-07 | AdminController 22k lignes | Moyen | 8h | P3 |
| PERF-08 | Sitemap sans cache | Faible-Moyen | 1h | P3 |
| PERF-09 | Cache prod non configuré | Moyen | 2h | P3 |

---

## Métriques cibles après optimisation

| Métrique | Avant (estimé) | Cible |
|----------|----------------|-------|
| Requêtes SQL / page listing | 50-200 | < 10 |
| Temps de chargement page | 2-5s | < 1s |
| Score PageSpeed Mobile | ~40-60 | > 80 |
| Taille totale assets | ~2MB | < 500KB |
| Time To First Byte (TTFB) | ~500ms | < 200ms |
