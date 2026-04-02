# Rapport de Plateforme — Drilleedo v2

> **Date de génération :** 1er avril 2026  
> **Version :** Drilleedo v2  
> **Framework :** Symfony 7.4 (PHP 8.2+)  
> **Base de données :** MySQL / MariaDB

---

## 1. Présentation du Projet

**Drilleedo** est une marketplace B2C/B2B de mise en relation entre particuliers et professionnels du secteur de la rénovation résidentielle, principalement ciblée sur le marché **canadien** (Québec). La plateforme permet aux particuliers de publier des demandes de devis ou des demandes directes, et aux professionnels (entrepreneurs indépendants ou entreprises) de soumettre des offres de service.

### Objectifs Principaux
- Mettre en relation des **particuliers** cherchant des services de rénovation avec des **professionnels** qualifiés.
- Offrir un espace de gestion autonome à chaque type d'acteur (professionnel indépendant, entreprise, particulier).
- Fournir un **backoffice administratif** complet pour superviser l'ensemble de l'activité.
- Valoriser la confiance via des indicateurs de qualité : vérification, badge "Top Rated", assurance, certification RBQ.

### Modèle de Fonctionnement

```
Particulier ──► publie une QuoteRequest (demande de devis)
                        │
                        ▼
              Professionnel/Entreprise voit la demande
                        │
                        ▼
              soumet une Offer (offre de prix)
                        │
                        ▼
              Particulier accepte ou rejette l'offre
                        │
                        ▼
              QuoteRequest → statut CLOSED
```

---

## 2. Architecture Technique

### Stack Technologique

| Couche | Technologie |
|---|---|
| Backend | Symfony 7.4 (PHP 8.2+) |
| ORM | Doctrine ORM |
| Base de données | MySQL 8.0 |
| Templating | Twig |
| CSS Framework | CSS personnalisé (design system "Zen") |
| Icônes | Phosphor Icons |
| Typographie | Google Fonts (Inter) |
| Build | Symfony AssetMapper / Webpack Encore |
| Auth | Symfony Security (rôles hiérarchiques) |

### Structure des Répertoires

```
drilledov2/
├── src/
│   ├── Controller/       # 17+ contrôleurs (Home, Admin, Professional, Individual…)
│   ├── Entity/           # 26 entités Doctrine
│   ├── Form/             # 30+ types de formulaires
│   ├── Repository/       # 25 repositories
│   └── Service/          # FileUploader, etc.
├── templates/
│   ├── home/             # 25 templates publics
│   ├── professional/     # 12 templates espace pro
│   ├── individual/       # 12 templates espace particulier
│   ├── admin/            # Backoffice (11 sections)
│   ├── blog/             # Articles & idées
│   ├── offer/            # Gestion des offres
│   ├── registration/     # Inscription
│   └── security/         # Connexion
├── assets/               # CSS, JS, images, fonts
├── public/               # Point d'entrée web
├── migrations/           # Migrations Doctrine
└── doc/                  # Documentation du projet
```

### Système de Rôles

| Rôle | Description | Préfixe URL |
|---|---|---|
| `ROLE_ADMIN` | Administrateur plateforme | `/dashboard` |
| `ROLE_PROFESSIONAL` | Professionnel indépendant | `/professional-compte` |
| `ROLE_COMPANY` (Business) | Entreprise de rénovation | `/professional-compte` |
| `ROLE_INDIVIDUAL` | Particulier (client) | `/individual-compte` |

---

## 3. Modèle de Données — Entités Principales

### Hiérarchie des Utilisateurs

```
User (base)
  ├── Individual      (ROLE_INDIVIDUAL)
  └── Business        (classe parente Business)
        ├── Professional  (ROLE_PROFESSIONAL)
        └── Company       (ROLE_COMPANY)
```

### Entités Métier

| Entité | Description |
|---|---|
| `QuoteRequest` | Demande de devis publiée par un particulier |
| `DirectRequest` | Demande directe à un professionnel spécifique |
| `Offer` | Offre de prix envoyée par un pro en réponse à une demande |
| `Category` | Catégorie de service (ex: Plomberie, Électricité…) |
| `Projet` | Projet de rénovation réalisé (portfolio du pro) |
| `Review` | Avis client sur un professionnel |
| `Testimonial` | Témoignage affiché en homepage |
| `Blog` | Article de blog / idée déco |
| `Notification` | Notification in-app pour pros et particuliers |
| `PrimaryContact` | Contact principal d'un professionnel ou entreprise |
| `Adress` | Adresse postale (liée à Business) |
| `Link` | Lien réseau social ou site web |
| `PersonalInfos` | Informations personnelles d'un particulier |
| `BusinessStats` | Statistiques d'un professionnel (vues, taux de conversion…) |
| `EntrepreneurType` | Type d'entrepreneur (sous-traitant, général…) |
| `PaymentMethod` | Méthode de paiement acceptée |
| `Type` | Type de projet de rénovation |

### Statuts des Entités

**QuoteRequest / DirectRequest :**
- `DRAFT` → `PUBLISHED` → `CLOSED`

**Offer :**
- `DRAFT` → `PUBLISHED` → `ACCEPTED` ou `REJECTED`

---

## 4. Pages Publiques (Front)

### 4.1 Page d'Accueil

**URL :** `/`  
**Template :** `home/index.html.twig`  
**Contrôleur :** `HomeController::index`

**Contenu :**
- En-tête avec barre de recherche globale (autocomplete AJAX via `/api/search`)
- Méga-menu "Trouver un Professionnel" avec navigation par catégorie
- Section hero avec appel à l'action principal
- Grille de professionnels vedettes (top-rated, par catégorie)
- Section témoignages clients (carrousel dynamique)
- Sections "Comment ça marche" et appel à l'action double (particulier / pro)

**Données dynamiques :**
- `featuredProfessionals` : top 4 professionnels par catégories différentes
- `testimonials` : jusqu'à 10 témoignages actifs

---

### 4.2 Trouver un Professionnel (Marketplace)

**URL :** `/find-professionals`  
**Template :** `home/professionals.html.twig`  
**Contrôleur :** `HomeController::professionals`

**Contenu :**
- Barre de recherche par mot-clé
- Filtres latéraux : catégories, villes (avec compteurs)
- Tri : pertinence, note, récence
- Grille de cartes professionnelles paginées (6 par page)
- Badges : "Vérifié", "Top Rated", disponibilité, note étoiles

**Filtres supportés :** `keyword`, `category`, `categories[]`, `cities[]`, `sort`, `page`

---

### 4.3 Fiche Profil Professionnel (Publique)

**URL :** `/professional/{id}/{slug}`  
**Template :** `home/professional.html.twig`  
**Contrôleur :** `HomeController::professionalDetails`

**Contenu :**
- Bannière avec photo, nom, ville, catégorie
- Carte d'identité : note, avis, disponibilité, statut vérifié
- Section "À propos"
- Portfolio de projets réalisés (galerie photo)
- Section avantages (garanties, certifications)
- Avis clients
- Formulaire de demande directe (accessible aux `ROLE_INDIVIDUAL`)

**Fonctionnalité :** soumission d'une `DirectRequest` directement depuis la fiche publique, avec upload d'images et notification au professionnel.

---

### 4.4 Trouver une Entreprise

**URL :** `/renovation-companies`  
**Template :** `home/companies.html.twig`  
**Contrôleur :** `HomeController::companies`

**Contenu :**
- Identique à la liste des professionnels mais filtré pour les entreprises
- Filtres : catégories, villes
- Pagination

---

### 4.5 Fiche Entreprise (Publique)

**URL :** `/company/{id}/{slug}`  
**Template :** `home/company.html.twig`  
**Contrôleur :** `HomeController::companyDetails`

**Contenu :**
- Bannière entreprise avec logo et description
- Informations légales, certifications (RBQ, assurance)
- Portfolio de projets
- Équipe et contacts
- Zones d'intervention sur carte
- Catégories de services offertes

---

### 4.6 Comment Ça Marche (Particuliers)

**URL :** `/how-it-works`  
**Template :** `home/how_it_works.html.twig`

**Contenu :**
- Explication en 3 étapes du processus pour un particulier
- Visuels illustratifs, CTA vers l'inscription et la création de demande

---

### 4.7 Comment Ça Marche (Professionnels)

**URL :** `/how-it-works-for-pros`  
**Template :** `home/how_it_works_pros.html.twig`

**Contenu :**
- Processus d'acquisition de clients pour les pros
- Avantages de la plateforme : accès aux demandes, système d'offres, conversion
- CTA vers l'inscription professionnelle

---

### 4.8 Page Pour les Professionnels (Landing)

**URL :** `/for-professionals`  
**Template :** `home/for_professionals.html.twig`

**Contenu :**
- Page de conversion haute valeur pour recruter des professionnels
- Tableau comparatif, chiffres clés, témoignages pros
- CTA vers l'inscription / les packages

---

### 4.9 Développer son Business

**URL :** `/grow-your-business`  
**Template :** `home/grow_business.html.twig`

**Contenu :**
- Argumentaire sur les bénéfices de la plateforme pour les pros
- Conseils et statistiques sur le marché de la rénovation

---

### 4.10 Packages et Tarifs

**URL :** `/packages`  
**Template :** `home/packages.html.twig`

**Contenu :**
- Grille tarifaire des abonnements professionnels
- Comparatif des fonctionnalités par tier
- CTA vers l'inscription

---

### 4.11 S'inscrire comme Professionnel

**URL :** `/register-pro`  
**Template :** `home/register_pro.html.twig`

**Contenu :**
- Landing page dédiée à l'inscription professionnelle
- Formulaire simplifié ou redirection vers le processus d'inscription complet

---

### 4.12 Idées Déco / Smart Ideas (Blog)

**URL :** `/home-renovation-ideas`  
**Template :** `home/smartideas.html.twig`  
**Contrôleur :** `HomeController::smartideas`

**Contenu :**
- Liste paginée d'articles de type "Idea" (6 par page)
- Cartes avec image, titre, résumé, date
- CTA vers le détail de l'article

---

### 4.13 Détail d'un Article / Idée

**URL :** `/ideas/{slug}`  
**Template :** `home/ideas-details.html.twig`  
**Contrôleur :** `HomeController::ideasDetails`

**Contenu :**
- Article complet avec contenu enrichi
- Section "Articles similaires" (3 suggestions)
- Partage social

---

### 4.14 Recherche par Catégorie de Service

**URL :** *(via méga-menu)*  
**Template :** `home/service_category.html.twig`

**Contenu :**
- Page filtrée par catégorie de service
- Liste de professionnels correspondants
- Description de la catégorie

---

### 4.15 Landing par Ville (SEO Local)

**URL :** `LocalSeoController` (routes dynamiques)  
**Template :** `home/city_landing.html.twig`

**Contenu :**
- Page de référencement local ciblée par ville
- Professionnels de la ville, statistiques, CTA

---

### 4.16 Page À Propos

**URL :** `/about-us`  
**Template :** `home/about.html.twig`

**Contenu :**
- Histoire de Drilleedo, mission et valeurs
- Équipe, chiffres clés de la plateforme
- CTA vers les espaces pro et particulier

---

### 4.17 Contact

**URL :** `/contact`  
**Template :** `home/contact.html.twig`

**Contenu :**
- Formulaire de contact (nom, email, message)
- Coordonnées de l'entreprise

---

### 4.18 Carrières

**URL :** `/careers`  
**Template :** `home/careers.html.twig`

**Contenu :**
- Offres d'emploi, valeurs de l'entreprise
- Formulaire de candidature spontanée

---

### 4.19 Pages Utilitaires (Placeholders)

| URL | Template | Description |
|---|---|---|
| `/receive-quotes` | `receive_quotes.html.twig` | Informations sur la réception de devis |
| `/project-photos` | `project_photos.html.twig` | Galerie photos de projets |
| `/decoration-ideas` | `decoration_ideas.html.twig` | Idées de décoration |
| `/completed-projects` | `completed_projects.html.twig` | Projets terminés |

---

## 5. Espace Professionnel (`/professional-compte`)

> **Accès restreint :** `ROLE_PROFESSIONAL`

### 5.1 Tableau de Bord

**URL :** `/professional-compte/`  
**Template :** `professional/index.html.twig`

**Métriques affichées :**
- Nombre de projets, devis disponibles, offres envoyées, offres acceptées
- Taux de conversion (offres acceptées / publiées)
- Score de complétion du profil (0–100%)
- Demandes directes en attente
- Notifications récentes (avec compteur non-lues)

---

### 5.2 Demandes de Devis (Marketplace)

**URL :** `/professional-compte/quotes`  
**Template :** `professional/quotes.html.twig`

**Contenu :**
- Liste des `QuoteRequest` publiées dans la catégorie du professionnel
- Statut de chaque demande (si déjà traité par le pro)
- Accès à l'envoi d'une offre

---

### 5.3 Demandes Directes Reçues

**URL :** `/professional-compte/direct-requests`  
**Template :** `professional/direct_requests.html.twig`

**Contenu :**
- Liste des `DirectRequest` ciblant ce professionnel
- Détails de la demande, images jointes
- Actions : répondre / envoyer une offre

---

### 5.4 Mes Offres

**URL :** `/professional-compte/offers`  
**Template :** `professional/offers.html.twig`

**Contenu :**
- Liste complète de toutes les offres envoyées (triées par date)
- Statuts : Brouillon, Publiée, Acceptée, Rejetée
- Formulaire d'édition pour les offres en brouillon (via modal)

---

### 5.5 Mon Profil

**URL :** `/professional-compte/profile`  
**Template :** `professional/profile.html.twig`

**Contenu :**
- Édition : logo, bannière, nom d'entreprise, description "À propos"
- Upload d'images (logo et bannière)
- Prévisualisation en temps réel

---

### 5.6 Mes Projets (Portfolio)

**URL :** `/professional-compte/projects`  
**Template :** `professional/projects/index.html.twig`

**Contenu :**
- Liste des projets réalisés
- Création de projet (titre, description, photo principale, galerie)
- Édition et suppression de projet avec confirmation CSRF

---

### 5.7 Paramètres

**URL :** `/professional-compte/settings`  
**Template :** `professional/settings.html.twig`

**Contenu (formulaires indépendants) :**
- Adresses postales (ajout via formulaire)
- Contact principal (nom, téléphone, email)
- Liens réseaux sociaux (Facebook, Instagram, LinkedIn, site web)
- Catégorie de service
- Changement de mot de passe (hashé avec Symfony PasswordHasher)

---

### 5.8 Notifications

**URL :** `/professional-compte/notifications`  
**Template :** `professional/notifications.html.twig`

**Contenu :**
- Liste complète des notifications (nouvelles demandes, offres acceptées/rejetées)
- Marquage comme lu, horodatage

---

### 5.9 Pages Publiques du Pro

**URL :** `/professional/list`  
**Template :** `professional/public_list.html.twig`

**URL :** `/professional/{id}/show`  
**Template :** `professional/public_show.html.twig`

---

## 6. Espace Particulier (`/individual-compte`)

> **Accès restreint :** `ROLE_INDIVIDUAL`

### 6.1 Tableau de Bord

**URL :** `/individual-compte/`  
**Template :** `individual/index.html.twig`

**Métriques KPI :**
- Total des demandes créées
- Demandes publiées (actives sur la marketplace)
- Offres reçues de professionnels
- Offres acceptées

---

### 6.2 Mes Demandes de Devis

**URL :** `/individual-compte/quotes`  
**Template :** `individual/quotes.html.twig`

**Contenu :**
- Liste de toutes les `QuoteRequest`
- Statuts visuels : Brouillon, Publiée, Fermée
- Actions : voir le détail, publier, supprimer

---

### 6.3 Créer une Demande de Devis

**URL :** `/individual-compte/quote/new`  
**Template :** `individual/new_quote.html.twig`

**Contenu :**
- Formulaire : titre, description, catégorie, budget estimé, images illustratives
- Sauvegarde en statut `DRAFT` par défaut
- Publication manuelle ultérieure depuis la fiche de la demande

---

### 6.4 Détail d'une Demande

**URL :** `/individual-compte/quote/{id}`  
**Template :** `individual/quote_show.html.twig`

**Contenu :**
- Fiche complète de la demande (éditable si en brouillon)
- Gestion des images : suppression individuelle
- Bouton "Publier" (déclenche notifications aux pros concernés)
- Liste des offres reçues avec statuts

---

### 6.5 Demandes Directes Envoyées

**URL :** `/individual-compte/direct-requests`  
**Template :** `individual/direct_requests.html.twig`

**Contenu :**
- Liste des `DirectRequest` envoyées à des professionnels spécifiques
- Statut de chaque demande, offres reçues

---

### 6.6 Offres Reçues

**URL :** `/individual-compte/offers`  
**Template :** `individual/offers.html.twig`

**Contenu :**
- Aggregation de toutes les offres (depuis devis ET demandes directes)
- Triées par date décroissante
- Actions : voir, accepter, rejeter

---

### 6.7 Détail d'une Offre

**URL :** `/individual-compte/offer/{id}`  
**Template :** `individual/offer_detail.html.twig`

**Contenu :**
- Fiche complète de l'offre : prix, description, conditions, professionnel
- Contexte : demande parente (devis ou directe)
- Boutons : Accepter / Rejeter (avec CSRF + notification automatique au pro)

**Workflow d'acceptation :**
1. L'offre passe à `ACCEPTED`
2. La demande parente passe à `CLOSED`
3. Les autres offres publiées sont automatiquement `REJECTED`
4. Le professionnel reçoit une notification "Offre acceptée"

---

### 6.8 Profil

**URL :** `/individual-compte/profile`  
**Template :** `individual/profile.html.twig`

**Contenu :**
- Formulaire `PersonalInfos` : prénom, nom, téléphone, adresse

---

### 6.9 Paramètres

**URL :** `/individual-compte/settings`  
**Template :** `individual/settings.html.twig`

**Contenu :**
- Changement de mot de passe sécurisé

---

## 7. Backoffice Administratif (`/dashboard`)

> **Accès restreint :** `ROLE_ADMIN`

### 7.1 Tableau de Bord Admin

**URL :** `/dashboard`  
**Template :** `admin/index.html.twig`

**Métriques affichées :**

| Catégorie | Indicateurs |
|---|---|
| Registres | Nb entreprises, pros, particuliers, articles de blog, catégories |
| Activité marché | Total offres, total demandes (devis + directes) |
| Performance | Taux d'acceptation des offres (%), conversion demandes fermées |
| Tendances | Évolution mensuelle (offres, demandes) |
| Insights marché | Top catégories en demande, top catégories en offre |
| Dernières entrées | 5 derniers pros, entreprises, particuliers, articles |

---

### 7.2 Gestion des Entreprises

| Route | Action |
|---|---|
| `/dashboard/companies` | Liste + création rapide (modal) |
| `/dashboard/companies/create` | Formulaire de création complet |
| `/dashboard/companies/{id}/edit` | Édition complète (tabbed, modal-based) |
| `/dashboard/companies/{id}/delete` | Suppression avec CSRF |

**Onglets d'édition :**
- Informations de base (nom, email, description)
- Informations légales (RBQ, NEQ, assurance)
- Contact principal
- Adresses
- Projets (portfolio)
- Liens sociaux
- Méthodes de paiement
- Catégories de services
- Logo / Bannière

---

### 7.3 Gestion des Professionnels

| Route | Action |
|---|---|
| `/dashboard/professionals` | Liste + création |
| `/dashboard/professionals/create` | Création (email uniquement → redirection vers edit) |
| `/dashboard/professionals/{id}/edit` | Édition complète tabbed |
| `/dashboard/professionals/{id}/delete` | Suppression |

**Onglets d'édition (similaires aux entreprises) :**
- Informations générales, contact, portfolio, configuration (statut, tarification, préférences)
- Photo de profil et bannière

---

### 7.4 Gestion des Particuliers

| Route | Action |
|---|---|
| `/dashboard/individuals` | Liste |
| `/dashboard/individuals/{id}/edit` | Édition profil + changement mot de passe |
| `/dashboard/individuals/{id}/delete` | Suppression |

---

### 7.5 Gestion des Catégories

| Route | Action |
|---|---|
| `/dashboard/categories` | Liste des catégories (parent + enfants) |
| `/dashboard/categories/{id}/edit` | Édition : nom, icône (Phosphor), image de bannière |
| `/dashboard/categories/{id}/delete` | Suppression |

---

### 7.6 Gestion du Blog

| Route | Action |
|---|---|
| `/dashboard/blog` | Liste des articles (type: Idea, Article…) |
| `/dashboard/blog/create` | Création article |
| `/dashboard/blog/{id}/edit` | Édition (titre, contenu, slug, type, image) |
| `/dashboard/blog/{id}/delete` | Suppression |

---

### 7.7 Gestion des Témoignages

| Route | Action |
|---|---|
| `/dashboard/testimonials` | Liste |
| `/dashboard/testimonials/new` | Création (ou chargement via commande Symfony) |
| `/dashboard/testimonials/{id}/edit` | Édition |
| `/dashboard/testimonials/{id}/delete` | Suppression |

---

### 7.8 Gestion des Types

| Route | Action |
|---|---|
| `/dashboard/types` | Types de projets de rénovation |
| CRUD complet | Formulaire `TypeType` |

---

### 7.9 Gestion des Demandes et Requêtes

- **Demandes directes :** `/dashboard/requests` — liste et détail
- **Demandes de devis :** accès via profil individuel dans admin

---

## 8. Pages d'Authentification

| URL | Template | Description |
|---|---|---|
| `/login` | `security/login.html.twig` | Page de connexion (email + mot de passe) |
| `/register` | `registration/register.html.twig` | Inscription (avec choix du rôle) |
| `/logout` | *(action Symfony)* | Déconnexion |

---

## 9. API Interne

| Endpoint | Méthode | Description |
|---|---|---|
| `/api/search` | GET | Autocomplete : recherche pros + entreprises par mot-clé (min 2 caractères, max 8 résultats) |
| `/api/categories` | GET | Liste dynamique des catégories pour le méga-menu |

---

## 10. SEO & Pages Dynamiques

### Sitemap
**URL :** `/sitemap.xml`  
**Contrôleur :** `SitemapController`  
Génère automatiquement un sitemap XML incluant toutes les fiches professionnelles, entreprises, et pages statiques.

### Landing Pages Locales (SEO)
**Contrôleur :** `LocalSeoController`  
Génère des pages optimisées par ville pour le référencement local (ex: "Plombiers à Montréal").

---

## 11. Design System — Charte "Zen"

La plateforme applique un design system cohérent sur toutes les interfaces :

- **Palette :** blanc cassé `#FAFAFA`, bleu marine `#1A2B4A`, accentuation dorée `#C9A84C`
- **Cartes :** `border-radius: 16px`, ombre légère `box-shadow: 0 2px 16px rgba(0,0,0,0.07)`
- **Boutons :** primaire (navy), secondaire (outline), danger (rouge atténué)
- **Icônes :** [Phosphor Icons](https://phosphoricons.com/) (poids : `regular`, `bold`)
- **Typographie :** Inter (Google Fonts), hiérarchie claire H1→H6
- **Tables :** DataTables.js avec styling personnalisé
- **Modals :** Bootstrap-like mais avec tokens du design system Drilleedo
- **Responsive :** Mobile-first, breakpoints standard

---

## 12. Fonctionnalités Clés par Utilisateur

### Pour les Particuliers
- ✅ Créer et publier des demandes de devis
- ✅ Contacter directement un professionnel
- ✅ Recevoir et comparer les offres
- ✅ Accepter/rejeter une offre avec notification automatique
- ✅ Gérer son profil personnel
- ✅ Supprimer ses images et demandes

### Pour les Professionnels
- ✅ Accéder aux demandes de leur catégorie
- ✅ Envoyer des offres (brouillon → publiée)
- ✅ Gérer leur portfolio de projets
- ✅ Configurer leur profil public (logo, bannière, réseaux)
- ✅ Suivre leurs statistiques de conversion
- ✅ Recevoir des notifications en temps réel
- ✅ Mettre à jour leur statut de disponibilité

### Pour les Administrateurs
- ✅ Vue globale de l'activité et des métriques
- ✅ CRUD complet : pros, entreprises, particuliers, catégories, blog, témoignages
- ✅ Gestion des médias (logo, bannières, images de catégorie)
- ✅ Supervision des demandes et offres
- ✅ Insights marché (offre vs demande par catégorie)

---

## 13. Fichiers de Documentation Existants

| Fichier | Description |
|---|---|
| `admin_architectural_analysis.md` | Analyse de l'architecture admin |
| `audit_professional_details.md` | Audit de la fiche professionnelle |
| `entity_relations_mapping.md` | Cartographie des relations entre entités |
| `fiche_professionnels_audit.md` | Audit UX de la fiche pro publique |
| `rapport_company.md` | Rapport attributs entreprise |
| `rapport_professional.md` | Rapport attributs professionnel |
| `site_audit_report.md` | Rapport d'audit global du site |
| `workflow_demandes_offres.txt` | Description du workflow demandes/offres |
| `menu_uiux_audit.txt` | Audit UI/UX du méga-menu |

---

---

## 14. Proposition : Stratégie Multilingue (FR / EN / ES / IT)

### 14.1 Vue d'Ensemble et Principes Directeurs

L'ajout du multilinguisme sur Drilleedo repose sur une règle simple :

> **La structure de la plateforme reste unique. Seules les couches de présentation et de contenu éditorial changent selon la langue.**

| Type de contenu | Traduit ? | Méthode |
|---|---|---|
| Pages statiques (UI labels, menus, boutons, messages) | ✅ Oui | Fichiers de traduction Symfony (`translations/`) |
| Pages marketing (À propos, Pour les pros, Packages…) | ✅ Oui | Fichiers de traduction ou contenu TXT éditable |
| Blog / Idées Déco | ✅ Oui | Champ `locale` + entrées multiples par article en BDD |
| Noms de catégories | ✅ Oui | Champ `name_fr`, `name_en`… ou entité `CategoryTranslation` |
| Témoignages (homepage) | ✅ Oui | Champ `locale` dans l'entité `Testimonial` |
| Demandes de devis / directes (`QuoteRequest`, `DirectRequest`) | ❌ Non | Contenu libre saisi par l'utilisateur dans sa propre langue |
| Offres (`Offer`) | ❌ Non | Contenu libre selon la langue du professionnel |
| Profil professionnel (`about`, `companyName`, etc.) | ❌ Non | Données propres à l'utilisateur, non traduites |
| Notifications | 🔁 Partiel | Clés de traduction avec variables (ex: `notification.new_quote`) |

---

### 14.2 Mise en Place — Symfony i18n

#### Étape 1 — Activer le composant de traduction

```yaml
# config/packages/translation.yaml
framework:
    default_locale: fr
    translator:
        default_path: '%kernel.project_dir%/translations'
        fallbacks:
            - fr
        paths:
            - '%kernel.project_dir%/translations'
```

#### Étape 2 — Structure des fichiers de traduction

```
translations/
├── messages.fr.yaml      # Français (langue par défaut)
├── messages.en.yaml      # Anglais
├── messages.es.yaml      # Espagnol
├── messages.it.yaml      # Italien
├── validators.fr.yaml    # Messages de validation de formulaires
├── validators.en.yaml
└── ...
```

**Exemple `messages.fr.yaml` :**
```yaml
nav:
  find_professionals: "Trouver un professionnel"
  for_professionals: "Pour les professionnels"
  how_it_works: "Comment ça marche"
  login: "Connexion"
  register: "S'inscrire"

home:
  hero_title: "Trouvez le professionnel idéal pour votre rénovation"
  hero_subtitle: "Des milliers de pros vérifiés disponibles au Québec"
  cta_individual: "Publier une demande gratuite"
  cta_professional: "Je suis un professionnel"

quote:
  status_draft: "Brouillon"
  status_published: "Publié"
  status_closed: "Fermé"

notification:
  new_quote: "Nouvelle demande de devis : {title}"
  offer_accepted: "Votre offre pour \"{title}\" a été acceptée !"
```

**Exemple `messages.en.yaml` :**
```yaml
nav:
  find_professionals: "Find a Professional"
  for_professionals: "For Professionals"
  how_it_works: "How It Works"
  login: "Login"
  register: "Sign Up"

home:
  hero_title: "Find the ideal professional for your renovation"
  hero_subtitle: "Thousands of verified pros available in Quebec"
  cta_individual: "Post a free request"
  cta_professional: "I am a professional"
```

#### Étape 3 — Usage dans les templates Twig

Remplacer tous les textes hardcodés par des appels au filtre `trans` :

```twig
{# Avant #}
<a href="{{ path('professionals_list') }}">Trouver un professionnel</a>

{# Après #}
<a href="{{ path('professionals_list') }}">{{ 'nav.find_professionals'|trans }}</a>
```

#### Étape 4 — Détection et Changement de Langue

**Détection automatique** (via l'en-tête HTTP `Accept-Language`) :
```yaml
# config/packages/framework.yaml
framework:
    trusted_hosts: ~
    session:
        handler_id: ~
```

**Sélecteur de langue dans le header :**
```twig
<div class="lang-switcher">
    {% for locale, label in {'fr': 'FR', 'en': 'EN', 'es': 'ES', 'it': 'IT'} %}
        <a href="{{ path(app.request.attributes.get('_route'),
                   app.request.attributes.get('_route_params')|merge({'_locale': locale})) }}"
           class="{{ app.request.locale == locale ? 'active' : '' }}">
            {{ label }}
        </a>
    {% endfor %}
</div>
```

---

### 14.3 Structure des URLs par Langue

Deux approches possibles :

#### Option A — Préfixe de locale dans l'URL ✅ (recommandée)

```
/fr/trouver-un-professionnel
/en/find-professionals
/es/encontrar-profesionales
/it/trovare-professionisti

/fr/professionnel/42/jean-dupont-plombier
/en/professional/42/jean-dupont-plombier
```

**Configuration Symfony :**
```yaml
# config/routes.yaml
controllers:
    resource: ../src/Controller/
    type: attribute
    prefix: /{_locale}
    requirements:
        _locale: fr|en|es|it
    defaults:
        _locale: fr
```

#### Option B — Sous-domaines

```
fr.drilleedo.ca   → Français
en.drilleedo.ca   → Anglais
es.drilleedo.ca   → Espagnol
```

> [!NOTE]
> L'Option A (préfixe d'URL) est plus simple à mettre en place avec Symfony et favorise le SEO multilingue avec des URL distinctes indexables par Google.

---

### 14.4 Blog — Contenu Multilingue en Base de Données

Le `Blog` est la **seule entité dynamique à traduire**. Deux approches :

#### Approche A — Champ `locale` dans l'entité Blog (simple)

```php
// src/Entity/Blog.php
#[ORM\Column(length: 5, nullable: true)]
private ?string $locale = 'fr';
```

Chaque article est créé dans une langue spécifique. Le repository filtre par locale :

```php
// src/Repository/BlogRepository.php
public function findPaginatedByTypeAndLocale(string $type, string $locale, int $page, int $limit): array
{
    return $this->createQueryBuilder('b')
        ->where('b.type = :type')
        ->andWhere('b.locale = :locale OR b.locale IS NULL')
        ->setParameter('type', $type)
        ->setParameter('locale', $locale)
        ->orderBy('b.id', 'DESC')
        ->setFirstResult(($page - 1) * $limit)
        ->setMaxResults($limit)
        ->getQuery()
        ->getResult();
}
```

#### Approche B — Entité `BlogTranslation` (robuste)

```php
// src/Entity/BlogTranslation.php (NOUVELLE entité)
#[ORM\Entity]
class BlogTranslation
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    private int $id;

    #[ORM\ManyToOne(inversedBy: 'translations')]
    private Blog $blog;

    #[ORM\Column(length: 5)]
    private string $locale;           // 'fr', 'en', 'es', 'it'

    #[ORM\Column(length: 255)]
    private string $title;

    #[ORM\Column(length: 255)]
    private string $slug;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $content;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $excerpt;
}
```

> [!TIP]
> L'Approche B est plus scalable. Elle permet un article d'avoir des traductions indépendantes avec leurs propres slugs SEO. À utiliser si le blog est un canal marketing important.

---

### 14.5 Catégories — Noms Traduits

Ajouter les champs de traduction directement dans l'entité `Category` :

```php
// src/Entity/Category.php — ajout de champs
#[ORM\Column(length: 100, nullable: true)]
private ?string $nameEn = null;

#[ORM\Column(length: 100, nullable: true)]
private ?string $nameEs = null;

#[ORM\Column(length: 100, nullable: true)]
private ?string $nameIt = null;
```

**Helper Twig pour afficher le bon nom :**
```twig
{# templates/partials/category_name.html.twig #}
{% set locale = app.request.locale %}
{% if locale == 'en' and category.nameEn %}
    {{ category.nameEn }}
{% elseif locale == 'es' and category.nameEs %}
    {{ category.nameEs }}
{% elseif locale == 'it' and category.nameIt %}
    {{ category.nameIt }}
{% else %}
    {{ category.name }}  {# fallback FR #}
{% endif %}
```

---

### 14.6 Témoignages — Filtrage par Locale

Ajouter un champ `locale` à l'entité `Testimonial` :

```php
// src/Entity/Testimonial.php — ajout
#[ORM\Column(length: 5, nullable: true)]
private ?string $locale = null; // null = toutes langues
```

Dans `HomeController` :
```php
$activeTestimonials = $testimonialRepository->findActiveByLocale(
    $request->getLocale(),
    10
);
```

---

### 14.7 Données Utilisateurs — Aucune Traduction Requise

Les entités suivantes contiennent du **contenu généré par les utilisateurs** dans leur langue naturelle. Elles ne sont **pas traduites** :

| Entité | Contenu libre |
|---|---|
| `QuoteRequest` | Titre, description, commentaires — langue du particulier |
| `DirectRequest` | Titre, message — langue du particulier |
| `Offer` | Description, conditions — langue du professionnel |
| `Professional.about` | Présentation en langue du pro (FR ou EN) |
| `Company.description` | Description en langue de l'entreprise |
| `Projet.description` | Texte libre du projet |
| `Review.comment` | Avis rédigé par le client |

> [!IMPORTANT]
> Ces données ne sont pas traduites car elles reflètent la langue naturelle de l'acteur. Sur le marché québécois, la majorité sera en **FR ou EN**. Une éventuelle traduction automatique (ex: Google Translate API) pourrait être envisagée comme amélioration ultérieure, mais n'est pas nécessaire au lancement.

---

### 14.8 Notifications — Clés de Traduction

Les messages de notification sont générés par code. Ils doivent utiliser des clés traduites :

```php
// Avant (texte hardcodé EN)
$notification->setMessage('New quote request published: ' . $quote->getTitle());

// Après (clé de traduction)
$notification->setMessageKey('notification.new_quote');
$notification->setMessageParams(['title' => $quote->getTitle()]);
```

Dans Twig :
```twig
{{ (notification.messageKey)|trans(notification.messageParams) }}
```

> [!NOTE]
> Cela nécessite d'ajouter les champs `messageKey` et `messageParams` (JSON) à l'entité `Notification`, remplaçant le champ `message` actuel.

---

### 14.9 Gestion Admin des Traductions

Ajouter dans le backoffice (`/dashboard`) une section dédiée :

#### Interface de traduction Blog
- Liste des articles avec indicateur de traduction par langue (🟢 traduit / 🔴 manquant)
- Formulaire d'édition avec onglets par langue : **FR | EN | ES | IT**

#### Interface de traduction Catégories
- Tableau avec colonnes : Nom FR | Nom EN | Nom ES | Nom IT
- Édition inline ou via modal par catégorie

#### Interface de traduction Témoignages
- Filtrage par locale dans l'interface de liste
- Champ locale lors de la création/édition

---

### 14.10 Plan de Déploiement Progressif

```
Phase 1 — Infrastructure (1 semaine)
├── ✅ Configurer Symfony Translator (framework.yaml)
├── ✅ Créer les fichiers messages.fr.yaml / messages.en.yaml
├── ✅ Ajouter le préfixe /{_locale} dans les routes
└── ✅ Ajouter le sélecteur de langue dans le header/footer

Phase 2 — Pages statiques FR + EN (2 semaines)
├── ✅ Traduire tous les labels UI (menus, boutons, formulaires)
├── ✅ Traduire les pages marketing (accueil, about, packages, how-it-works)
└── ✅ Gérer les emails et messages flash en anglais

Phase 3 — Données dynamiques (1 semaine)
├── ✅ Ajouter champ locale au Blog + migration BDD
├── ✅ Ajouter champs nameEn/nameEs/nameIt aux catégories
├── ✅ Filtrage du blog et témoignages par locale
└── ✅ Mettre à jour l'admin Blog avec onglets de traduction

Phase 4 — ES + IT (1 semaine/langue)
├── ✅ Créer messages.es.yaml + messages.it.yaml
├── ✅ Traduire les pages marketing dans ces langues
└── ✅ Ajouter le contenu blog ES/IT dans l'admin

Phase 5 — SEO multilingue
├── ✅ Ajouter les balises hreflang dans base.html.twig
├── ✅ Étendre le sitemap.xml pour toutes les locales
└── ✅ Créer des landing pages SEO locales par ville + langue
```

---

### 14.11 Balises SEO Multilingue

Ajouter dans `base.html.twig` :

```twig
<head>
    {# ... #}
    {% for locale in ['fr', 'en', 'es', 'it'] %}
    <link rel="alternate" hreflang="{{ locale }}"
          href="{{ url(app.request.attributes.get('_route'),
                      app.request.attributes.get('_route_params')|merge({'_locale': locale})) }}" />
    {% endfor %}
    <link rel="alternate" hreflang="x-default" href="{{ url(app.request.attributes.get('_route'),
          app.request.attributes.get('_route_params')|merge({'_locale': 'fr'})) }}" />
</head>
```

---

### 14.12 Résumé — Ce qui Change vs Ce qui Ne Change Pas

```
✅ CE QUI CHANGE SELON LA LANGUE
├── Labels UI (menus, boutons, titres de page, textes statiques)
├── Pages marketing (accueil, about, packages, how-it-works…)
├── Blog / Idées Déco (contenu éditorial)
├── Noms de catégories
├── Témoignages (filtrés par locale)
├── Messages de notification (clés de traduction)
├── Emails transactionnels
└── Balises SEO méta (title, description)

❌ CE QUI NE CHANGE PAS
├── QuoteRequest (titre, description libres par l'utilisateur)
├── DirectRequest (message libre)
├── Offer (prix, conditions libres)
├── Profil professionnel (about, companyName…)
├── Projets du portfolio (description libre)
├── Avis clients (commentaires libres)
└── Données métier (statuts, dates, montants)
```

---

*Rapport généré automatiquement à partir de l'analyse du code source de Drilleedo v2.*
