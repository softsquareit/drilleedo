# Drilleedo — Design Reference Document
**Version 1.0 — Avril 2026 | UI/UX Expert Reference**

> Ce document est la référence officielle pour tout développement front-end sur la plateforme Drilleedo. Il couvre la charte graphique complète, les composants UI, les patterns de mise en page et les règles d'usage. À consulter avant toute création d'écran, section ou composant.

---

## Table des matières

1. [Brand Identity & Positionnement](#1-brand-identity--positionnement)
2. [Couleurs](#2-couleurs)
3. [Typographie](#3-typographie)
4. [Logo & Éléments de marque](#4-logo--éléments-de-marque)
5. [Iconographie](#5-iconographie)
6. [Espacement & Grille](#6-espacement--grille)
7. [Composants UI](#7-composants-ui)
   - [Boutons](#71-boutons)
   - [Cards](#72-cards)
   - [Card Professionnel](#73-card-professionnel)
   - [Formulaires & Inputs](#74-formulaires--inputs)
   - [Badges & Chips](#75-badges--chips)
   - [Avatars & Notes](#76-avatars--notes)
8. [Patterns de Sections](#8-patterns-de-sections)
   - [Hero Banner](#81-hero-banner)
   - [Section Contenu Split](#82-section-contenu-split)
   - [Strip de statistiques](#83-strip-de-statistiques)
   - [Section CTA](#84-section-cta)
   - [Trust Bar](#85-trust-bar)
9. [Effets Visuels & Textures](#9-effets-visuels--textures)
10. [Animations & Interactions](#10-animations--interactions)
11. [Responsive Design](#11-responsive-design)
12. [CSS Variables de Référence](#12-css-variables-de-référence)
13. [Règles & Anti-patterns](#13-règles--anti-patterns)

---

## 1. Brand Identity & Positionnement

### Mission
Simplifier les services à domicile en connectant instantanément les propriétaires avec des professionnels locaux de confiance. Expérience numérique rapide et intuitive.

### Vision
Devenir l'écosystème numérique de référence pour les projets résidentiels au Canada — là où qualité, transparence et commodité définissent l'expérience.

### Tagline officielle
> **"easy help, fast solutions"** *(toujours en minuscules, jamais modifié)*

### Personnalité de marque
| Attribut | Expression visuelle |
|---|---|
| Confiance & fiabilité | Bleu profond dominant, layouts équilibrés |
| Rapidité & efficacité | Orange action, CTAs proéminents, espacement aéré |
| Approche humaine | Photos authentiques de professionnels au travail |
| Professionnalisme | Typographie propre, icônes simples, hiérarchie claire |
| Accessibilité | Contrastes forts, tailles lisibles, labels explicites |

---

## 2. Couleurs

### 2.1 Couleurs primaires

| Nom | HEX | RGB | CMJN | Rôle |
|---|---|---|---|---|
| **Helper Blue** | `#00497F` | R:0 V:73 B:127 | C:100 M:72 Y:24 K:8 | Couleur principale — logos, titres, fonds hero, boutons primaires |
| **Action Sky** | `#3FA9F5` | R:63 V:169 B:245 | C:66 M:22 Y:0 K:0 | Accents, icônes, liens, gradients |
| **Toolbox Orange** | `#FF8A3D` | R:255 V:138 B:61 | C:0 M:56 Y:77 K:0 | CTAs principaux, badges urgents, highlights |

> **Note implémentation :** Dans le code actuel, `#1A3D6E` est utilisé pour le bleu foncé des fonds (plus sombre que `#00497F`). Acceptable pour les fonds de sections sombres, mais utiliser `#00497F` pour les éléments de marque officiels (logo, boutons, etc.).

### 2.2 Couleur neutre

| Nom | HEX | RGB | Rôle |
|---|---|---|---|
| **Wall White** | `#FFFBEB` | R:255 V:251 B:235 | Fonds clairs, arrière-plans de cartes, fond page |

### 2.3 Couleurs secondaires (badges, illustrations, icônes)

| Couleur | HEX approx. | Usage |
|---|---|---|
| Vert forêt | `#1A6B3A` | Success, validation, catégorie jardinage |
| Violet | `#5B2D8E` | Tags spéciaux, catégories premium |
| Brun/Terracotta | `#8B2E10` | Alertes, catégorie maçonnerie |
| Vert clair | `#22C55E` | Indicateurs positifs, en ligne |
| Lavande | `#A855F7` | Tags secondaires, décoration |
| Gris neutre | `#C0C0C0` | Textes désactivés, bordures légères |

### 2.4 Palette fonctionnelle (extensions UI)

```css
/* Fonds de pages */
--bg-page-light:   #F0F4F8;       /* Fond général clair */
--bg-page-blue:    #cde0f5;       /* Fond dégradé bleu clair (haut) */
--bg-section-alt:  #EEF4FF;       /* Fond de section alternée */

/* Textes */
--text-dark:       #0C1825;       /* Titres H1/H2 sur fond clair */
--text-body:       #475569;       /* Corps de texte standard */
--text-light:      #94A3B8;       /* Labels, captions, texte secondaire */

/* Bordures */
--border-light:    #E4EBF2;       /* Séparateurs, bordures de cartes */
--border-medium:   #CBD5E1;       /* Inputs, cartes interactives */

/* Overlays */
--overlay-dark:    rgba(12,24,37,.7);   /* Sur photos sombres */
--overlay-blue:    rgba(26,61,110,.5);  /* Teinture hero bleue */
```

### 2.5 Gradients canoniques

```css
/* Hero principal / Panneau professionnel */
--grad-hero-pro: linear-gradient(135deg, #00497F 0%, #3FA9F5 100%);

/* Hero sombre (About, pages intérieures) */
--grad-dark: linear-gradient(135deg, #0C1825 0%, #1A3D6E 55%, #1e4f8a 100%);

/* CTA final */
--grad-cta: linear-gradient(135deg, #1A3D6E 0%, #2662ab 60%, #3FA9F5 100%);

/* Fond page about */
--grad-page: linear-gradient(180deg, #cde0f5 0%, #daeaf9 25%, #e8f2fb 55%, #f2f7fd 100%);

/* Icônes bleues */
--grad-ico-blue: linear-gradient(135deg, #1A3D6E, #2e6db4);
--grad-ico-sky:  linear-gradient(135deg, #2196f3, #3FA9F5);
--grad-ico-green: linear-gradient(135deg, #16a34a, #22c55e);
--grad-ico-orange: linear-gradient(135deg, #c95a08, #F5821F);
```

---

## 3. Typographie

### 3.1 Polices officielles

| Police | Rôle | Import |
|---|---|---|
| **Instrument Sans** | Typographie principale — body, UI, labels, menus | Google Fonts |
| **DM Serif Display** | Accent/Display — grands titres, sections héros | Google Fonts |

```html
<!-- Import recommandé -->
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
```

### 3.2 Hiérarchie typographique

| Niveau | Police | Taille | Poids | Line-height | Couleur défaut | Usage |
|---|---|---|---|---|---|---|
| **Display H1** | Instrument Sans | `clamp(36px, 5vw, 64px)` | 900 | 1.05 | `#00497F` | Hero principal |
| **H1 hero** | Instrument Sans | `clamp(32px, 5vw, 54px)` | 900 | 1.08 | `#fff` | Hero sur fond coloré |
| **H2 section** | Instrument Sans | `clamp(22px, 3vw, 38px)` | 900 | 1.12 | `#00497F` | Titres de section |
| **H2 card** | Instrument Sans | `22px` | 900 | 1.2 | `#1A3D6E` | Titres de cartes |
| **H3 / sous-titre** | Instrument Sans | `18–20px` | 700 | 1.3 | `#1A3D6E` | Sous-sections |
| **Body standard** | Instrument Sans | `15px` | 400 | 1.78 | `#475569` | Paragraphes |
| **Body small** | Instrument Sans | `13–14px` | 400 | 1.6 | `#475569` | Descriptions |
| **Label / Caption** | Instrument Sans | `11–12px` | 600–700 | 1.4 | `#94A3B8` | Étiquettes, dates |
| **Eyebrow** | Instrument Sans | `11px` | 800 | — | `#FF8A3D` | Pré-titres majuscules |
| **Stat number** | Instrument Sans | `22–32px` | 900 | 1 | `#00497F` | Chiffres clés |
| **Button** | Instrument Sans | `14–16px` | 700 | — | `#fff` | Texte de bouton |

### 3.3 Règles typographiques

- **Letter-spacing** : Titres principaux `-.02em` à `-.03em` ; Eyebrows `+.10em` à `+.12em`
- **Ne jamais** : changer la police du logo, modifier la tagline, utiliser plus de 2 polices par page
- **Accent orange** sur les mots-clés dans les titres hero : `<span style="color:#FF8A3D">mot</span>`
- **Italic accent** : `font-style: italic` ou `<em>` sur les highlights dans les titres sombres

---

## 4. Logo & Éléments de marque

### 4.1 Versions du logo

| Version | Usage | Fichier |
|---|---|---|
| **Horizontal preferred** (wordmark + tagline) | Défaut — toutes communications, navbar | Logo principal |
| **Full lockup** (icône + wordmark + tagline) | Forts impacts visuels, stationery, réseaux sociaux | Version secondaire |
| **Logomark seul** (icône D+coche) | Favicons, app icons, espaces réduits | Icon only |
| **Monochrome blanc** | Sur fonds colorés/photos | Sur bleu/noir |
| **Monochrome noir** | Impression N&B | Sur blanc |

### 4.2 Logomark — description de l'icône

L'icône est un **D stylisé avec une coche intégrée** :
- Forme extérieure : demi-hexagone ouvert à droite (bracket/flèche)
- Forme intérieure : coche (check mark) inclinée
- Symbolise : rapidité (flèche), validation (coche), fiabilité

### 4.3 Zone de sécurité (Safe Zone)

- Logomark : espace = **½ largeur de la barre du logomark** sur les côtés courts, **1× largeur** sur les côtés longs
- Logotype complet : espace = **½ hauteur du logotype** au-dessus/dessous, **¼ hauteur** gauche/droite
- **Aucun** élément graphique, texte ou image ne doit empiéter dans cette zone

### 4.4 Couleurs autorisées du logo

| Fond | Logo |
|---|---|
| `#3FA9F5` (Action Sky) | Wordmark `#00497F`, tagline `#3FA9F5` (ou blanc) |
| `#FFFBEB` (Wall White) | Wordmark `#00497F`, tagline `#3FA9F5` |
| `#FFFFFF` | Wordmark `#00497F`, tagline `#3FA9F5` |
| `#00497F` (Helper Blue) | Wordmark blanc, tagline blanc |
| Photo / fond foncé | Version monochrome blanche complète |

### 4.5 Interdits absolus logo

- ❌ Étirer ou déformer les proportions
- ❌ Changer les couleurs hors palette approuvée (pas de violet, pas d'orange sur le wordmark)
- ❌ Modifier ou remplacer la tagline
- ❌ Ajouter des effets (ombre, contour, filtre, bevel)
- ❌ Placer sur des fonds complexes ou sur des visages
- ❌ Faire pivoter ou refléter
- ❌ Séparer le logomark du wordmark (sauf version logomark officielle)

---

## 5. Iconographie

### 5.1 Librairie officielle

**Feather Icons** — librairie légère de traits (stroke), style ligne fine uniforme.

```html
<!-- Usage : classe feather-{nom} -->
<i class="feather-search"></i>
<i class="feather-arrow-right"></i>
<i class="feather-shield"></i>
```

> ⚠️ **ATTENTION** : Ne jamais utiliser `ph ph-*` (Phosphor Icons) ou `bi bi-*` à la place de Feather. Les linters peuvent silencieusement convertir — toujours vérifier après édition.

### 5.2 Icônes clés par contexte

| Contexte | Icône Feather |
|---|---|
| Recherche | `feather-search` |
| Localisation | `feather-map-pin` |
| Vérification / Shield | `feather-shield` |
| Vitesse / Action | `feather-zap` |
| Utilisateurs | `feather-users` |
| Professionnel | `feather-tool` |
| Navigation suivant | `feather-arrow-right` |
| Validation | `feather-check-circle` |
| Étoile / Rating | `feather-star` |
| Projet / Maison | `feather-home` |
| Vision | `feather-eye` |
| Croissance | `feather-trending-up` |
| Contact | `feather-phone` |
| Inscription | `feather-user-plus` |
| Envoyer | `feather-send` |
| Calendrier | `feather-calendar` |
| Globe | `feather-globe` |
| Info | `feather-info` |
| Cible/Mission | `feather-target` |
| Alerte | `feather-alert-triangle` |
| Horloge | `feather-clock` |

### 5.3 Icônes dans des containers colorés

Pattern standard pour icônes avec fond coloré :

```html
<div class="icon-container" style="background: linear-gradient(135deg,#1A3D6E,#2e6db4);">
  <i class="feather-shield" style="color:#fff;"></i>
</div>
```

```css
.icon-container {
  width: 48px; height: 48px;
  border-radius: 12px;           /* ou 14px pour plus grand */
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
```

---

## 6. Espacement & Grille

### 6.1 Conteneur principal

```css
.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 28px;     /* desktop */
  /* Mobile : padding: 0 16px; */
}
```

### 6.2 Échelle d'espacement (base 4px)

| Token | Valeur | Usage type |
|---|---|---|
| `--space-xs` | `4px` | Gap entre icône et texte inline |
| `--space-sm` | `8px` | Gap dans les chips, padding interne |
| `--space-md` | `16px` | Padding standard d'éléments |
| `--space-lg` | `24px` | Gap entre cards, margin sections internes |
| `--space-xl` | `40px` | Padding de section (mobile) |
| `--space-2xl` | `56–64px` | Padding de section (desktop) |
| `--space-3xl` | `80–96px` | Espacement entre sections majeures |

### 6.3 Grille de sections

| Pattern | Colonnes | Usage |
|---|---|---|
| Split hero | `2fr 1fr` | Hero homepage (particulier / pro) |
| Split 50/50 | `1fr 1fr` | Sections "matters", split photos |
| Split asymétrique | `1fr 1.4fr` ou `1.4fr 1fr` | Cards de contenu alternées (About) |
| 3 colonnes égales | `1fr 1fr 1fr` | Cards de catégories, pillars, valeurs |
| 4 colonnes | `repeat(4,1fr)` | Stats strips, grilles de métriques |
| 2 colonnes | `1fr 1fr` | KPIs, formulaires |

### 6.4 Border-radius

| Taille | Valeur | Usage |
|---|---|---|
| Petit | `8–10px` | Photo tags, petits badges |
| Standard | `12–14px` | Icônes containers, petites cards |
| Medium | `16px` | Boutons, inputs, chips |
| Large | `22px` | Cards principales, sections |
| Pill | `999px` | Badges, chips, boutons ronds |
| Rond | `50%` | Avatars, bulles décoratives |

---

## 7. Composants UI

### 7.1 Boutons

#### Bouton primaire (CTA orange)
```css
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: #FF8A3D;
  color: #fff; font-weight: 700; font-size: 15px;
  padding: 13px 26px; border-radius: 16px;
  text-decoration: none; border: none; cursor: pointer;
  box-shadow: 0 4px 18px rgba(255,138,61,.35);
  transition: all .22s ease;
}
.btn-primary:hover {
  background: #d96e10;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255,138,61,.45);
}
```

#### Bouton secondaire (contour blanc — sur fond coloré)
```css
.btn-outline-white {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: #fff;
  font-weight: 700; font-size: 15px;
  padding: 12px 24px; border-radius: 16px;
  text-decoration: none;
  border: 2px solid rgba(255,255,255,.3);
  transition: all .22s ease;
}
.btn-outline-white:hover {
  background: rgba(255,255,255,.1);
  border-color: rgba(255,255,255,.6);
  color: #fff;
}
```

#### Bouton primaire bleu (sur fond clair)
```css
.btn-blue {
  background: #00497F; color: #fff;
  padding: 12px 24px; border-radius: 16px;
  font-weight: 700; font-size: 14px;
  border: none; cursor: pointer;
  box-shadow: 0 4px 14px rgba(0,73,127,.3);
  transition: all .22s ease;
}
.btn-blue:hover { background: #003865; transform: translateY(-2px); }
```

#### Bouton Contact (card professionnel — pill bleu)
```css
.btn-contact {
  display: inline-flex; align-items: center; gap: 6px;
  background: #3FA9F5; color: #fff;
  padding: 8px 16px; border-radius: 999px;
  font-weight: 700; font-size: 13px;
  border: none; cursor: pointer;
  transition: background .2s;
}
.btn-contact:hover { background: #2196f3; }
```

#### Prix / Badge action (pill orange)
```css
.badge-price {
  display: inline-flex; align-items: center;
  background: #FF8A3D; color: #fff;
  padding: 6px 14px; border-radius: 999px;
  font-weight: 800; font-size: 13px;
}
```

### 7.2 Cards

#### Card standard (fond blanc, ombre)
```css
.card {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 4px 28px rgba(26,61,110,.10);
  overflow: hidden;
  transition: box-shadow .22s, transform .22s;
}
.card:hover {
  box-shadow: 0 10px 44px rgba(26,61,110,.14);
  transform: translateY(-3px);
}
```

#### Card avec bordure colorée gauche (section About)
```css
.card--bordered {
  border-left: 5px solid transparent;
}
.card--blue   { border-left-color: #00497F; }
.card--orange { border-left-color: #FF8A3D; }
.card--sky    { border-left-color: #3FA9F5; }
.card--green  { border-left-color: #16a34a; }
```

#### Card catégorie (homepage)
```css
.card-category {
  position: relative; border-radius: 18px; overflow: hidden;
  aspect-ratio: 4/3; cursor: pointer;
}
.card-category img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .5s ease;
}
.card-category:hover img { transform: scale(1.08); }
.card-category-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,73,127,.85) 0%, rgba(0,73,127,.1) 60%);
  transition: opacity .3s;
}
.card-category-label {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 16px; color: #fff; font-weight: 800; font-size: 15px;
}
```

### 7.3 Card Professionnel

> **Style officiel validé** — extrait de la maquette `web-site-better-version.jpg`.  
> À utiliser sur toutes les pages qui affichent des listes de professionnels.

#### Structure visuelle

```
┌──────────────────────────────┐  ← carte blanche, border-radius: 18px, padding: 10px
│  ┌────────────────────┐ ★4.5│  ← photo arrondie (12px) + badge rating absolu top-right
│  │                    │     │     badge: fond blanc, pill, ombre légère
│  │   [PHOTO PRO]      │     │     étoile: #F59E0B
│  │                    │     │
│  └────────────────────┘     │
│  Plumber                    │  ← titre profession: 18px, 800, #0C1825
│  Mike D.                    │  ← nom: 13px, #4A6073
│  [📞 Contact] [15$]    [≡] │  ← Contact pill sky (#3FA9F5) · prix pill orange (#FF8A3D)
└──────────────────────────────┘    icône liste: cercle gris 36px, hover → sky blue
```

#### Couleurs de la section
| Élément | Valeur |
|---|---|
| Fond de section | `#dde9ff` (bleu ciel très clair) |
| Fond carte | `#ffffff` |
| Titre profession | `#0C1825` (--D) |
| Nom | `#4A6073` (--M) |
| Bouton Contact | `#3FA9F5` (--S, Action Sky) |
| Badge prix | `#FF8A3D` (--O, Toolbox Orange) |
| Bouton liste | `#eef2f7` → hover `#3FA9F5` |
| Rating étoile | `#F59E0B` |

#### CSS de référence (classes Twig `_card_professional.html.twig`)

```css
/* Section */
.hp-pros { background: var(--S);}
.hp-pg   { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }

/* Carte */
.hp-pro-card {
  background: #fff; border-radius: 18px; padding: 10px;
  box-shadow: 0 4px 20px rgba(0,73,127,.08);
  display: flex; flex-direction: column;
  transition: all .22s ease;
}
.hp-pro-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,73,127,.16); }

/* Photo — à l'intérieur du padding, coins arrondis */
.hp-pro-card-img {
  width: 100%; height: 175px; border-radius: 12px;
  overflow: hidden; position: relative; background: #E4EBF2;
}
.hp-pro-card-img a { display: block; width: 100%; height: 100%; }
.hp-pro-card-img img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center top;
  transition: transform .5s;
}
.hp-pro-card:hover .hp-pro-card-img img { transform: scale(1.04); }

/* Badge rating — ABSOLU top-right SUR la photo */
.hp-pro-card-rating {
  position: absolute; top: 10px; right: 10px; z-index: 2;
  background: #fff; border-radius: 50px;
  padding: 5px 10px 5px 8px;
  font-size: 12.5px; font-weight: 800; color: #0C1825;
  display: flex; align-items: center; gap: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,.13);
}
.hp-pro-card-rating i { color: #F59E0B; font-size: 13px; } /* feather-star */

/* Corps */
.hp-pro-card-body  { padding: 12px 4px 4px; display: flex; flex-direction: column; flex: 1; }
.hp-pro-card-title { font-size: 18px; font-weight: 800; color: #0C1825; margin: 0; line-height: 1.2; }
.hp-pro-card-sub   { font-size: 13px; color: #4A6073; margin-bottom: 12px; }

/* Footer */
.hp-pro-card-foot { display: flex; align-items: center; gap: 8px; margin-top: auto; }

.hp-pro-btn-contact {
  background: #3FA9F5; color: #fff; border-radius: 50px;
  padding: 9px 14px; font-size: 13px; font-weight: 700;
  display: inline-flex; align-items: center; gap: 6px;
  text-decoration: none;
}
.hp-pro-btn-contact:hover { background: #2a95e0; }

.hp-pro-tag {
  background: #FF8A3D; color: #fff; border-radius: 50px;
  padding: 9px 12px; font-size: 13px; font-weight: 800;
  display: inline-flex; align-items: center;
}

.hp-pro-btn-view {
  margin-left: auto;
  width: 36px; height: 36px; border-radius: 50%;
  background: #eef2f7; color: #4A6073; font-size: 15px;
  display: flex; align-items: center; justify-content: center;
  text-decoration: none; flex-shrink: 0;
}
.hp-pro-btn-view:hover { background: #3FA9F5; color: #fff; }
```

#### HTML Twig minimal (partiel réutilisable)

```twig
<div class="hp-pro-card">
  <div class="hp-pro-card-img">
    <a href="{{ path('professional_details', ...) }}">
      <img src="{{ pro.banner ? asset('uploads/banners/'~pro.banner) : asset('assets/drilleedo/images/team/plumber.png') }}"
           alt="{{ pro.displayName }}" loading="lazy">
    </a>
    <div class="hp-pro-card-rating">
      <i class="feather-star"></i> {{ pro.stats.averageRating|number_format(1) }}
    </div>
  </div>
  <div class="hp-pro-card-body">
    <div class="hp-pro-card-header">
      <h3 class="hp-pro-card-title"><a href="...">{{ pro.category.name }}</a></h3>
    </div>
    <div class="hp-pro-card-sub">{{ pro.displayName }}</div>
    <div class="hp-pro-card-foot">
      <a href="{{ path('individual_direct_request_new', ...) }}" class="hp-pro-btn-contact">
        <i class="feather-phone"></i> Contact
      </a>
      <span class="hp-pro-tag">{{ pro.minPrice ?? '15' }}$</span>
      <a href="{{ path('professional_details', ...) }}" class="hp-pro-btn-view">
        <i class="feather-list"></i>
      </a>
    </div>
  </div>
</div>
```

> **Règles importantes :**
> - Icônes : `feather-star`, `feather-phone`, `feather-list` — jamais Phosphor
> - Le badge rating est **positionné en absolu sur la photo**, pas dans le body
> - Le titre affiche la **profession/catégorie**, pas le nom
> - Le nom s'affiche en sous-titre gris
> - Le bouton Contact utilise `--S` (Action Sky `#3FA9F5`), jamais `--B`

#### Variante étendue (list view)
Pour les listings, la card peut être horizontale :
```
┌──────────────────────────────────────────────────────────┐
│ [PHOTO] │ Titre Métier  ★4.5    │ Ville, Province        │
│  80×80  │ Prénom Nom             │ Catégorie [tag]        │
│         │ Description courte     │ [Contact]  [15$/h]     │
└──────────────────────────────────────────────────────────┘
```

### 7.4 Formulaires & Inputs

#### Barre de recherche principale
```css
.search-bar {
  display: flex; align-items: center;
  background: #fff; border-radius: 16px;
  padding: 6px 6px 6px 16px;
  box-shadow: 0 4px 24px rgba(26,61,110,.15);
  border: 1.5px solid #E4EBF2;
  gap: 8px;
}
.search-bar input {
  flex: 1; border: none; outline: none;
  font-size: 15px; color: #0C1825;
  background: transparent;
}
.search-bar input::placeholder { color: #94A3B8; }
.search-bar-btn {
  background: #FF8A3D; color: #fff;
  border: none; border-radius: 12px;
  width: 42px; height: 42px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  transition: background .2s;
}
.search-bar-btn:hover { background: #d96e10; }
```

#### Input standard
```css
.input-field {
  width: 100%; padding: 12px 16px;
  border: 1.5px solid #E4EBF2;
  border-radius: 12px; font-size: 14px;
  color: #0C1825; background: #fff;
  transition: border-color .2s, box-shadow .2s;
  outline: none;
}
.input-field:focus {
  border-color: #3FA9F5;
  box-shadow: 0 0 0 3px rgba(63,169,245,.15);
}
.input-field::placeholder { color: #94A3B8; }
```

### 7.5 Badges & Chips

#### Chip de navigation rapide (Quick chips)
```css
.chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 13px; border-radius: 999px;
  font-size: 12px; font-weight: 600; color: #475569;
  background: #F0F4F8; border: 1.5px solid #E4EBF2;
  text-decoration: none; transition: all .22s ease;
  cursor: pointer;
}
.chip:hover, .chip--active {
  background: #00497F; color: #fff; border-color: #00497F;
}
```

#### Badge / Eyebrow tag (sur fond coloré)
```css
.eyebrow-tag {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(255,255,255,.12);
  color: rgba(255,255,255,.9);
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 999px;
  padding: 7px 18px;
  font-size: 11px; font-weight: 700;
  letter-spacing: .1em; text-transform: uppercase;
}
.eyebrow-tag i { color: #FF8A3D; }
```

#### Badge solution (sur fond sombre — matters section)
```css
.badge-solution {
  display: inline-block;
  background: rgba(255,138,61,.18); color: #FF8A3D;
  border: 1px solid rgba(255,138,61,.3);
  border-radius: 999px; padding: 3px 10px;
  font-size: 10px; font-weight: 700;
}
```

#### Eyebrow sur fond clair (section)
```css
.eyebrow-section {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 800; letter-spacing: .12em;
  text-transform: uppercase; color: #FF8A3D;
  margin-bottom: 10px;
}
```

### 7.6 Avatars & Notes

#### Avatars empilés (social proof)
```css
.avatar-stack { display: flex; margin-right: 12px; }
.avatar {
  width: 32px; height: 32px; border-radius: 50%;
  border: 2px solid #fff; margin-right: -8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #fff;
  overflow: hidden; flex-shrink: 0;
}
/* Couleurs alternées pour avatars lettrés */
.avatar:nth-child(1) { background: linear-gradient(135deg,#1A3D6E,#3FA9F5); }
.avatar:nth-child(2) { background: linear-gradient(135deg,#FF8A3D,#c95a08); }
.avatar:nth-child(3) { background: linear-gradient(135deg,#16a34a,#22c55e); }
```

#### Rating stars
```css
.stars { color: #F5821F; letter-spacing: 2px; font-size: 14px; }
.rating-label { font-size: 12px; color: #475569; font-weight: 600; }
```

#### Photo tag flottant (sur image)
```css
.photo-tag {
  position: absolute; bottom: 16px; left: 16px;
  background: rgba(255,255,255,.94); backdrop-filter: blur(6px);
  border-radius: 10px; padding: 8px 14px;
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; font-weight: 700; color: #00497F;
  box-shadow: 0 3px 12px rgba(0,0,0,.12);
}
.photo-tag i { color: #FF8A3D; font-size: 14px; }
```

---

## 8. Patterns de Sections

### 8.1 Hero Banner

#### Hero homepage split (particulier 2/3 + pro 1/3)
```css
.hero-split {
  display: grid; grid-template-columns: 2fr 1fr;
  min-height: 600px;
}

/* Côté particulier — photo plein fond */
.hero-homeowner {
  position: relative; overflow: hidden;
}
.hero-homeowner-photo {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover;
}
.hero-homeowner-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(0,73,127,.75) 0%, rgba(0,73,127,.3) 50%, transparent 100%);
}
.hero-homeowner-content {
  position: relative; z-index: 2;
  padding: 64px 56px; display: flex; flex-direction: column;
  justify-content: center; height: 100%;
}

/* Côté professionnel — fond dégradé */
.hero-pro {
  background: linear-gradient(135deg, #00497F 0%, #3FA9F5 100%);
  position: relative; display: flex; flex-direction: column;
  justify-content: center; overflow: hidden;
}
/* Pattern SVG en ::before, radial orange en ::after */
```

#### Hero intérieur (pages About, How-it-works)
```css
.hero-inner {
  min-height: 420px;
  background: linear-gradient(135deg, #1A3D6E 0%, #2e6db4 50%, #3FA9F5 100%);
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  text-align: center; padding: 80px 24px;
}
/* Texture SVG crosshatch en ::before + radial orange en ::after */
```

### 8.2 Section Contenu Split

Pattern pour sections alternées (photo + texte) :

```css
/* Standard : photo gauche, texte droite */
.content-row {
  display: grid; grid-template-columns: 1fr 1.4fr;
  min-height: 300px;
}
/* Inversé : texte gauche, photo droite */
.content-row--rev { grid-template-columns: 1.4fr 1fr; }

.content-photo {
  overflow: hidden; position: relative;
}
.content-photo img {
  width: 100%; height: 100%; object-fit: cover;
  min-height: 300px; transition: transform .5s ease;
}
.content-row:hover .content-photo img { transform: scale(1.04); }

.content-body {
  padding: 44px 48px;
  display: flex; flex-direction: column; justify-content: center;
}
```

### 8.3 Strip de statistiques

```css
.stats-strip {
  background: #fff;
  border-top: 3px solid #FF8A3D;     /* accent orange */
  border-bottom: 1px solid #E4EBF2;
}
.stats-grid {
  display: grid; grid-template-columns: repeat(4,1fr);
  max-width: 1140px; margin: 0 auto; padding: 0 28px;
}
.stat-cell {
  display: flex; align-items: center; gap: 14px;
  padding: 24px 20px;
  border-right: 1px solid #E4EBF2;
}
.stat-cell:last-child { border-right: none; }
.stat-num {
  font-size: 22px; font-weight: 900;
  color: #00497F; line-height: 1;
}
.stat-lbl {
  font-size: 12px; color: #475569; font-weight: 600; margin-top: 3px;
}
```

### 8.4 Section CTA

```css
.cta-section {
  background: linear-gradient(135deg, #1A3D6E 0%, #2662ab 60%, #3FA9F5 100%);
  border-radius: 22px; padding: 64px 48px;
  text-align: center;
  box-shadow: 0 12px 48px rgba(26,61,110,.22);
  position: relative; overflow: hidden;
}
/* Cercles décoratifs ::before et ::after */
.cta-section::before {
  content:''; position:absolute; top:-100px; right:-80px;
  width:320px; height:320px; border-radius:50%;
  background: rgba(255,255,255,.05);
}
.cta-section::after {
  content:''; position:absolute; bottom:-80px; left:-60px;
  width:260px; height:260px; border-radius:50%;
  background: rgba(255,138,61,.08);
}
```

### 8.5 Trust Bar

Barre de confiance (logos partenaires / certifications) :

```css
.trust-bar {
  border-top: 3px solid #FF8A3D;
  padding: 20px 0; background: #fff;
}
.trust-bar-label {
  font-size: 11px; font-weight: 700;
  color: #94A3B8; text-transform: uppercase; letter-spacing: .1em;
  margin-bottom: 12px; text-align: center;
}
.trust-bar-logos {
  display: flex; align-items: center; justify-content: center;
  gap: 32px; flex-wrap: wrap;
}
.trust-bar-logos img { height: 28px; opacity: .6; filter: grayscale(1); }
.trust-bar-logos img:hover { opacity: 1; filter: none; }
```

---

## 9. Effets Visuels & Textures

### 9.1 Pattern SVG crosshatch (fond texture)

À utiliser en `::before` sur les hero sombres. Opacité 4% blanc.

```css
background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
```

### 9.2 Pattern grille carrée (fonds sombres)

Opacité 3% blanc, motif 40×40px :

```css
background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 0h20v20H0zM20 20h20v20H20z'/%3E%3C/g%3E%3C/svg%3E");
```

### 9.3 Radial orange décoratif

Utilisé sur les hero et panneaux pro pour ajouter une chaleur visuelle :

```css
/* Positionné en ::after ou comme élément absolu */
{
  width: 400–600px; height: 400–600px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,138,61,.15) 0%, transparent 65–70%);
  pointer-events: none;
}
```

### 9.4 Overlay photo

```css
/* Overlay dégradé bas-haut pour lisibilité texte sur photo */
background: linear-gradient(to top, rgba(0,73,127,.85) 0%, rgba(0,73,127,.1) 60%, transparent 100%);

/* Overlay latéral (split hero) */
background: linear-gradient(135deg, rgba(0,73,127,.75) 0%, rgba(0,73,127,.3) 50%, transparent 100%);
```

### 9.5 Glassmorphism (photo tags, badges flottants)

```css
background: rgba(255,255,255,.92);
backdrop-filter: blur(6–8px);
-webkit-backdrop-filter: blur(6–8px);
box-shadow: 0 3–4px 12–16px rgba(0,0,0,.12–.15);
```

### 9.6 Ombres

```css
--shadow-card:    0 4px 28px rgba(26,61,110,.10);   /* Card standard */
--shadow-hover:   0 10px 44px rgba(26,61,110,.14);  /* Card au hover */
--shadow-button:  0 4px 18px rgba(255,138,61,.35);  /* Bouton orange */
--shadow-search:  0 4px 24px rgba(26,61,110,.15);   /* Barre de recherche */
--shadow-section: 0 8px 40px rgba(26,61,110,.18);   /* Section matters */
--shadow-cta:     0 12px 48px rgba(26,61,110,.22);  /* CTA final */
```

---

## 10. Animations & Interactions

### 10.1 Transitions standard

```css
--transition: all .22s ease;       /* Transition universelle */
--transition-slow: all .5s ease;   /* Zoom photo au hover */
```

### 10.2 Scroll animations (IntersectionObserver)

Pattern standard pour apparitions au scroll :

```css
.fade-in {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .55s ease, transform .55s ease;
}
.fade-in.in {
  opacity: 1;
  transform: none;
}
/* Délais successifs via style="transition-delay:.07s" */
```

```js
(function(){
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-in').forEach(function(el){ obs.observe(el); });
})();
```

### 10.3 Hover standards

| Élément | Effet hover |
|---|---|
| Card principale | `translateY(-3px)` + ombre renforcée |
| Card catégorie | Zoom photo `scale(1.08)` |
| Bouton CTA orange | `translateY(-2px)` + ombre renforcée + assombrir bg |
| Chip | Fond bleu + texte blanc |
| Icône container | Légère luminosité `brightness(1.1)` |
| Lien nav | Couleur orange |
| Photo split | `scale(1.04)` |

---

## 11. Responsive Design

### 11.1 Breakpoints

| Breakpoint | Valeur | Description |
|---|---|---|
| Mobile | `< 600px` | Téléphones |
| Tablet | `600px – 900px` | Tablettes, paysage mobile |
| Desktop | `> 900px` | Desktop, laptop |

### 11.2 Adaptations clés

```css
@media(max-width: 900px) {
  /* Grilles 2 colonnes → 1 colonne */
  .hero-split          { grid-template-columns: 1fr; }
  .content-row,
  .content-row--rev    { grid-template-columns: 1fr; }
  .stats-grid          { grid-template-columns: 1fr 1fr; }

  /* Photo dans les rows */
  .content-photo img   { min-height: 220px; height: 240px; }
  .content-body        { padding: 28px; }
}

@media(max-width: 600px) {
  /* Stats 4 col → 2 col */
  .stats-grid          { grid-template-columns: 1fr 1fr; }
  .stat-cell           { border-right: none; border-bottom: 1px solid #E4EBF2; }

  /* Titres */
  h1                   { font-size: 28px; }

  /* Cards 3 col → 1 col */
  .cards-3col          { grid-template-columns: 1fr; }

  /* CTA padding réduit */
  .cta-section         { padding: 40px 24px; }
}
```

---

## 12. CSS Variables de Référence

Variables recommandées à déclarer dans `:root` pour chaque template :

```css
:root {
  /* ── Couleurs de marque ── */
  --blue:    #00497F;    /* Helper Blue (officiel) */
  --sky:     #3FA9F5;    /* Action Sky */
  --orange:  #FF8A3D;    /* Toolbox Orange */
  --cream:   #FFFBEB;    /* Wall White */

  /* ── Couleurs UI étendues ── */
  --dark:    #0C1825;    /* Texte très sombre */
  --mid:     #475569;    /* Corps de texte */
  --light:   #94A3B8;    /* Texte léger */
  --border:  #E4EBF2;    /* Bordures */
  --bg-alt:  #EEF4FF;    /* Fond alterné */
  --white:   #fff;

  /* ── Effets ── */
  --shadow:  0 4px 28px rgba(26,61,110,.10);
  --transition: all .22s ease;

  /* ── Géométrie ── */
  --radius:  16px;
  --radius-lg: 22px;
}
```

> **Nommage court** (templates existants) : `--B` = blue, `--S` = sky, `--O` = orange, `--M` = mid-text, `--L` = light/border, `--t` = transition

---

## 13. Règles & Anti-patterns

### ✅ À faire

- Utiliser **Feather Icons** (`feather-*`) pour toutes les icônes
- Maintenir le ratio de contraste minimum **4.5:1** texte/fond
- Toujours inclure `loading="lazy"` sur les images non-critiques
- Utiliser `object-fit: cover` sur toutes les images dans des containers fixes
- Préserver tous les `|trans` dans les templates Twig existants
- Utiliser `clamp()` pour les tailles de titres responsives
- Ajouter `pointer-events: none` sur les éléments décoratifs (::before/::after)
- Tester les cartes professionnelles avec des noms longs et des prix variables

### ❌ À éviter

- Utiliser `ph ph-*` (Phosphor) ou `bi bi-*` (Bootstrap Icons) au lieu de Feather
- Utiliser l'orange `#FF8A3D` / `#F5821F` pour des titres de sections (réservé aux CTA et accents)
- Placer le logo sur des fonds complexes ou des photos de visages
- Modifier la tagline "easy help, fast solutions"
- Utiliser `background-image: url()` pour des fichiers avec espaces dans le nom (utiliser `<img>` à la place)
- Créer des gradients avec des couleurs hors palette
- Ignorer le `z-index` sur les éléments `position: absolute` imbriqués
- Mettre du texte directement sur une photo sans overlay

### ⚠️ Points d'attention techniques

- **`banner_man .svg`** : l'espace dans le nom casse les URLs CSS. Toujours utiliser `<img src="...banner_man .svg">` et non `background-image: url()`
- **Linter Twig/auto-fix** : peut convertir silencieusement `feather-*` en `ph ph-*`. Vérifier après chaque sauvegarde automatique.
- **Python pour remplacements multi-lignes** : `sed -i` ne gère pas les newlines. Utiliser `python3` avec `str.replace()` pour les blocs CSS/HTML longs.
- **Chiffres officiels** : Le document officiel utilise `#00497F` (Helper Blue). Le code actuel utilise `#1A3D6E` pour les fonds sombres — acceptable comme déclinaison mais ne pas l'utiliser pour les éléments de marque officiels.

---

*Document préparé sur base des Brand Guidelines Drilleedo 2025 (PDF officiel) et de l'analyse des templates en production. Mise à jour : Avril 2026.*
