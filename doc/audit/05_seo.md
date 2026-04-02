# Audit SEO - Drilleedo v2

**Date :** 2026-04-01

---

## Points forts SEO existants

- JSON-LD Organization + WebSite avec SearchAction dans `base.html.twig`
- Open Graph meta tags (og:title, og:description, og:image)
- Twitter Card configuré
- Canonical URL support
- `SitemapController` pour générer le sitemap.xml
- `LocalSeoController` pour les pages SEO locales
- Meta description et keywords dans le head
- Favicon configuré
- Langue (`lang="fr"`) spécifiée
- URLs avec slugs pour les professionnels et entreprises

---

## Problèmes SEO identifiés

---

### [SEO-01] Schema.org manquant sur les pages profil

**Fichiers :** `templates/home/professional.html.twig`, `templates/home/company.html.twig`
**Impact :** ÉLEVÉ

Les pages de profil professionnel/entreprise ne contiennent pas de données structurées JSON-LD. Ce sont pourtant les pages les plus indexables et les plus susceptibles d'apparaître dans les rich snippets Google.

**Correction — Schema LocalBusiness :**
```twig
{# templates/home/professional.html.twig #}
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "{{ professional.name|e('js') }}",
    "description": "{{ professional.description|e('js') }}",
    "image": "{{ absolute_url(asset('uploads/logos/' ~ professional.logo)) }}",
    "telephone": "{{ professional.phone|e('js') }}",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "{{ professional.city|e('js') }}",
        "addressRegion": "QC",
        "addressCountry": "CA"
    },
    "url": "{{ url('professional_show', {slug: professional.slug}) }}",
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "{{ professional.averageRating }}",
        "reviewCount": "{{ professional.reviewCount }}"
    },
    "openingHours": [
        {% for hours in professional.openingHours ?? [] %}
            "{{ hours|e('js') }}"{% if not loop.last %},{% endif %}
        {% endfor %}
    ],
    "priceRange": "{{ professional.priceRange|e('js') }}"
}
</script>
```

---

### [SEO-02] Schema.org manquant sur les articles de blog

**Fichier :** `templates/home/ideas-details.html.twig`
**Impact :** ÉLEVÉ

Les articles de blog sans données structurées perdent l'opportunité d'apparaître comme rich snippets (article avec date, auteur, image).

**Correction — Schema Article :**
```twig
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{{ blog.title|e('js') }}",
    "description": "{{ blog.excerpt|e('js') }}",
    "image": "{{ absolute_url(asset('uploads/blogs/' ~ blog.image)) }}",
    "datePublished": "{{ blog.createdAt|date('c') }}",
    "dateModified": "{{ blog.updatedAt|date('c') }}",
    "author": {
        "@type": "Person",
        "name": "{{ blog.author.name|e('js') }}"
    },
    "publisher": {
        "@type": "Organization",
        "name": "Drilleedo",
        "logo": {
            "@type": "ImageObject",
            "url": "{{ absolute_url(asset('assets/images/logo.png')) }}"
        }
    },
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "{{ url('blog_show', {slug: blog.slug}) }}"
    }
}
</script>
```

---

### [SEO-03] Breadcrumbs manquants (navigation + Schema)

**Fichiers :** Toutes les pages secondaires
**Impact :** ÉLEVÉ

Les pages de catégorie, profil, blog n'ont pas de fil d'Ariane. Google utilise les breadcrumbs pour comprendre la structure du site.

**Correction — Composant Twig réutilisable :**
```twig
{# templates/partials/_breadcrumbs.html.twig #}
{% macro render(items) %}
<nav aria-label="breadcrumb">
    <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
        {% for item in items %}
        <li class="breadcrumb-item {% if loop.last %}active{% endif %}"
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem">
            {% if not loop.last %}
                <a href="{{ item.url }}" itemprop="item">
                    <span itemprop="name">{{ item.label }}</span>
                </a>
            {% else %}
                <span itemprop="name">{{ item.label }}</span>
            {% endif %}
            <meta itemprop="position" content="{{ loop.index }}">
        </li>
        {% endfor %}
    </ol>
</nav>
{% endmacro %}
```

**Utilisation :**
```twig
{# Sur la page d'un professionnel #}
{% from 'partials/_breadcrumbs.html.twig' import render %}
{{ render([
    {label: 'Accueil', url: path('home')},
    {label: professional.category.name, url: path('professionals', {category: professional.category.slug})},
    {label: professional.name, url: '#'},
]) }}
```

---

### [SEO-04] Meta descriptions non dynamiques sur certaines pages

**Fichiers :** `templates/home/professionals.html.twig`, `templates/home/companies.html.twig`
**Impact :** MOYEN

Les pages de listing n'ont pas de meta description unique qui reflète les filtres actifs (ville, catégorie).

**Correction :**
```twig
{# Dans le controller, passer la meta description #}
// HomeController.php
$metaDescription = 'Trouvez les meilleurs professionnels';
if ($city) {
    $metaDescription .= ' à ' . $city;
}
if ($category) {
    $metaDescription .= ' spécialisés en ' . $category->getName();
}
$metaDescription .= ' au Québec. Comparez les profils, avis et tarifs.';

return $this->render('home/professionals.html.twig', [
    'metaDescription' => $metaDescription,
    // ...
]);
```

```twig
{# Dans la template — remplacer le bloc meta #}
{% block meta_description %}{{ metaDescription }}{% endblock %}
```

---

### [SEO-05] Sitemap incomplet et sans priorités

**Fichier :** `src/Controller/SitemapController.php`
**Impact :** MOYEN

Le sitemap actuel :
- Charge toutes les entités en mémoire (performance)
- N'inclut pas les priorités ni les fréquences de changement
- Ne distingue pas les pages statiques des pages dynamiques

**Correction :**
```php
// SitemapController.php
public function index(): Response
{
    $urls = [];

    // Pages statiques (haute priorité)
    $staticPages = [
        ['route' => 'home', 'priority' => '1.0', 'changefreq' => 'daily'],
        ['route' => 'professionals', 'priority' => '0.9', 'changefreq' => 'daily'],
        ['route' => 'companies', 'priority' => '0.9', 'changefreq' => 'daily'],
        ['route' => 'about', 'priority' => '0.5', 'changefreq' => 'monthly'],
        ['route' => 'contact', 'priority' => '0.5', 'changefreq' => 'monthly'],
    ];

    foreach ($staticPages as $page) {
        $urls[] = [
            'loc' => $this->generateUrl($page['route'], [], UrlGeneratorInterface::ABSOLUTE_URL),
            'lastmod' => date('Y-m-d'),
            'changefreq' => $page['changefreq'],
            'priority' => $page['priority'],
        ];
    }

    // Professionnels (DTOs légers, pas les entités complètes)
    $professionals = $this->professionalRepository->findForSitemap();
    foreach ($professionals as $professional) {
        $urls[] = [
            'loc' => $this->generateUrl('professional_show', ['slug' => $professional['slug']], UrlGeneratorInterface::ABSOLUTE_URL),
            'lastmod' => $professional['updatedAt']?->format('Y-m-d') ?? date('Y-m-d'),
            'changefreq' => 'weekly',
            'priority' => '0.8',
        ];
    }

    $response = new Response(
        $this->renderView('sitemap/index.xml.twig', ['urls' => $urls]),
        200,
        ['Content-Type' => 'application/xml']
    );
    $response->setPublic()->setMaxAge(86400); // Cache 24h
    return $response;
}
```

---

### [SEO-06] Images sans attribut alt descriptif

**Fichiers :** Plusieurs templates
**Impact :** MOYEN

```twig
{# Problème #}
<img src="{{ asset(professional.photo) }}" alt="photo">

{# Correction #}
<img src="{{ asset(professional.photo) }}"
     alt="{{ professional.name }} - {{ professional.category.name }} à {{ professional.city }}"
     loading="lazy"
     width="300" height="300">
```

---

### [SEO-07] URLs canoniques non définies sur les pages avec filtres

**Fichiers :** `templates/home/professionals.html.twig`
**Impact :** MOYEN

Les pages avec paramètres GET (`?city=montreal&category=plomberie&page=2`) créent du contenu dupliqué. L'URL canonique doit pointer vers la version "propre".

```twig
{# Dans le <head> #}
<link rel="canonical" href="{{ url('professionals') }}{% if category %}?category={{ category.slug }}{% endif %}">
```

---

### [SEO-08] robots.txt non optimisé

**Fichier :** `public/robots.txt`
**Impact :** FAIBLE

```txt
# Avant (basique)
User-agent: *
Disallow:

# Après (optimisé)
User-agent: *
Disallow: /admin/
Disallow: /login
Disallow: /register
Disallow: /individual/
Disallow: /professional/dashboard
Disallow: /company/
Disallow: /offer/
Disallow: /_profiler/
Disallow: /_wdt/
Disallow: /api/

Allow: /professional/*/profile   # Si les profils publics ont ce chemin
Allow: /sitemap.xml

Sitemap: https://www.drilleedo.ca/sitemap.xml

# Google Image Bot
User-agent: Googlebot-Image
Allow: /uploads/logos/
Allow: /uploads/banners/
Allow: /uploads/projects/
Disallow: /uploads/quote_requests/
Disallow: /uploads/offers/
```

---

### [SEO-09] Hreflang manquant pour le bilinguisme

**Fichier :** `templates/base.html.twig`
**Impact :** MOYEN (si le site est bilingue fr/en)

Si le site supporte le français et l'anglais (locale `en_CA` détectée dans la config), les balises hreflang sont nécessaires.

```twig
{# Dans le <head> #}
<link rel="alternate" hreflang="fr-CA" href="{{ url(app.request.attributes.get('_route'), app.request.attributes.get('_route_params')|merge({'_locale': 'fr'})) }}">
<link rel="alternate" hreflang="en-CA" href="{{ url(app.request.attributes.get('_route'), app.request.attributes.get('_route_params')|merge({'_locale': 'en'})) }}">
<link rel="alternate" hreflang="x-default" href="{{ url('home') }}">
```

---

### [SEO-10] Performance Core Web Vitals

**Impact :** ÉLEVÉ (facteur de ranking Google depuis 2021)

Les Core Web Vitals sont directement liés aux problèmes de performance identifiés :

| Métrique | Problème associé | Correction |
|----------|-----------------|------------|
| LCP (Largest Contentful Paint) | Images non optimisées | WebP + lazy loading + preload hero image |
| CLS (Cumulative Layout Shift) | Images sans dimensions | Ajouter `width` et `height` sur toutes les images |
| FID/INP (Interactivity) | JavaScript trop lourd | Bundler et différer les scripts non critiques |
| TTFB | Requêtes N+1 | Optimiser les requêtes DB |

**Préchargement de l'image principale (hero) :**
```twig
{# Dans base.html.twig — uniquement sur la homepage #}
{% if app.request.attributes.get('_route') == 'home' %}
<link rel="preload"
      as="image"
      href="{{ asset('assets/images/hero-banner.webp') }}"
      type="image/webp">
{% endif %}
```

---

## Récapitulatif SEO

| ID | Description | Impact | Effort | Priorité |
|----|-------------|--------|--------|----------|
| SEO-01 | Schema LocalBusiness sur profils | Élevé | 3h | P1 |
| SEO-02 | Schema Article sur blog | Élevé | 2h | P1 |
| SEO-03 | Breadcrumbs | Élevé | 3h | P1 |
| SEO-10 | Core Web Vitals | Élevé | 8h | P1 |
| SEO-04 | Meta descriptions dynamiques | Moyen | 2h | P2 |
| SEO-05 | Sitemap complet + cache | Moyen | 3h | P2 |
| SEO-06 | Alt attributes images | Moyen | 2h | P2 |
| SEO-07 | Canonical URL filtres | Moyen | 2h | P2 |
| SEO-08 | robots.txt optimisé | Faible | 30 min | P3 |
| SEO-09 | Hreflang bilingue | Moyen | 2h | P3 |
