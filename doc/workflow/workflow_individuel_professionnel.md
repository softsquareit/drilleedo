# Workflow : Individuel ↔ Professionnel — Demandes & Offres

**Projet :** Drilleedo v2
**Date :** 2026-04-01
**Périmètre :** Cycle de vie complet des demandes (QuoteRequest, DirectRequest) et des offres (Offer) entre particuliers (Individual) et prestataires (Professional / Company).

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Acteurs et entités](#2-acteurs-et-entités)
3. [Parcours 1 — Demande de devis publique (QuoteRequest)](#3-parcours-1--demande-de-devis-publique-quoterequest)
4. [Parcours 2 — Demande directe (DirectRequest)](#4-parcours-2--demande-directe-directrequest)
5. [Cycle de vie des offres (Offer)](#5-cycle-de-vie-des-offres-offer)
6. [Diagrammes d'état](#6-diagrammes-détat)
7. [Notifications](#7-notifications)
8. [Règles métier critiques](#8-règles-métier-critiques)
9. [Tableau de bord et KPIs](#9-tableau-de-bord-et-kpis)
10. [Routes et points d'entrée](#10-routes-et-points-dentrée)
11. [Recommandations](#11-recommandations)

---

## 1. Vue d'ensemble

La plateforme propose **deux chemins distincts** pour mettre en relation un particulier (Individual) avec un prestataire (Professional ou Company) :

| Chemin | Description | Visibilité |
|--------|-------------|------------|
| **Demande publique** (QuoteRequest) | Le particulier publie une demande, tous les professionnels de la catégorie la voient | Multi-prestataires |
| **Demande directe** (DirectRequest) | Le particulier cible un professionnel ou une entreprise spécifique | Mono-prestataire |

Dans les deux cas, les prestataires répondent via une **Offre (Offer)** que le particulier peut accepter ou rejeter.

---

## 2. Acteurs et entités

### Acteurs

| Acteur | Rôle | Entité PHP |
|--------|------|------------|
| **Individual** | Particulier cherchant un service | `src/Entity/Individual.php` |
| **Professional** | Prestataire individuel | `src/Entity/Professional.php` |
| **Company** | Entreprise prestataire | `src/Entity/Company.php` |

`Professional` et `Company` héritent tous deux de `Business` qui hérite de `User`.

### Entités principales

| Entité | Fichier | Description |
|--------|---------|-------------|
| `QuoteRequest` | `src/Entity/QuoteRequest.php` | Demande de devis publique |
| `DirectRequest` | `src/Entity/DirectRequest.php` | Demande directe ciblée |
| `Offer` | `src/Entity/Offer.php` | Offre d'un prestataire |
| `Notification` | `src/Entity/Notification.php` | Notification in-app |
| `Category` | `src/Entity/Category.php` | Catégorie de service |

### Relations clés

```
Individual  ──(1:N)──►  QuoteRequest  ──(1:N)──►  Offer  ◄──(N:1)── Business
Individual  ──(1:N)──►  DirectRequest ──(1:N)──►  Offer
DirectRequest ──(N:1)──► Professional  (OU)
DirectRequest ──(N:1)──► Company
```

---

## 3. Parcours 1 — Demande de devis publique (QuoteRequest)

### 3.1 Côté Particulier

#### Étape 1 — Création (statut : DRAFT)

- **Route :** `GET/POST /individual-compte/quote/new`
- **Contrôleur :** `IndividualController::newQuote()`
- **Template :** `templates/individual/new_quote.html.twig`

Champs du formulaire :
- Titre (requis)
- Description (requis)
- Catégorie / Sous-service (requis)
- Photos (optionnel, jusqu'à 10 fichiers, 5 Mo max chacun)

À la soumission, la demande est sauvegardée en **DRAFT**. Elle est invisible pour les prestataires.

#### Étape 2 — Modification du brouillon (statut : DRAFT)

- **Route :** `GET /individual-compte/quote/{id}`
- Le particulier peut modifier le titre, la description, les photos.
- Il peut aussi supprimer le brouillon.

#### Étape 3 — Publication (DRAFT → PUBLISHED)

- **Route :** `POST /individual-compte/quote/{id}/publish`
- **Contrôleur :** `IndividualController::publishQuote()`

Effets de la publication :
1. Statut passe de `DRAFT` à `PUBLISHED`.
2. La demande devient **immuable** (plus de modification possible).
3. **Notifications automatiques** envoyées à :
   - Tous les professionnels dont la `category` correspond.
   - Toutes les entreprises ayant cette catégorie.
   - Message : *"Nouvelle demande publiée : [titre]"*

#### Étape 4 — Suivi et décision (statut : PUBLISHED)

- **Route :** `GET /individual-compte/offers`
- Le particulier consulte toutes les offres reçues (toutes demandes confondues).
- Pour chaque offre visible (statut `PUBLISHED`), il peut :
  - **Accepter** → déclenche la fermeture automatique de la demande
  - **Rejeter** → l'offre est marquée `REJECTED`, la demande reste ouverte

#### Étape 5 — Clôture automatique (PUBLISHED → CLOSED)

Déclenchée dès qu'une offre est acceptée :
1. L'offre acceptée passe en `ACCEPTED`.
2. Toutes les autres offres `PUBLISHED` sur cette demande passent automatiquement en `REJECTED`.
3. La demande passe en `CLOSED`.

### 3.2 Côté Professionnel

#### Étape 1 — Découverte des demandes

- **Route :** `GET /professional-compte/quotes`
- **Contrôleur :** `ProfessionalController::quotes()`
- Affiche toutes les `QuoteRequest` dont la catégorie correspond à celle du professionnel.
- Statuts visibles : `PUBLISHED`, `ACCEPTED`, `CLOSED`.
- Indicateurs visuels : badge "Ouverte" si aucune offre déposée, "Prise" si fermée.

#### Étape 2 — Création d'une offre (statut : DRAFT)

- **Route :** `GET/POST /offer/send/{quoteRequestId}`
- **Contrôleur :** `OfferController::send()`
- **Template :** `templates/offer/new.html.twig`

Champs de l'offre :
- Prix (requis)
- Description / Détail de la proposition (requis)
- Documents joints (optionnel)

L'offre est sauvegardée en **DRAFT** et reste privée (invisible au particulier).

> Un professionnel ne peut déposer **qu'une seule offre** par demande.

#### Étape 3 — Publication de l'offre (DRAFT → PUBLISHED)

- Le professionnel clique sur "Envoyer l'offre".
- Statut : `DRAFT` → `PUBLISHED`.
- L'offre devient **immuable**.
- Une notification est envoyée au particulier :
  - Titre : *"Nouvelle offre reçue"*
  - Message : *"[Prestataire] a soumis une offre de [prix]€ pour '[titre de la demande]'"*

#### Étape 4 — Finalisation (ACCEPTED → CLOSED)

Une fois que le particulier a accepté l'offre :
- **Route :** `POST /offer/{id}/finalize`
- Le professionnel confirme la réalisation du service.
- Statut offre : `ACCEPTED` → `CLOSED`.
- Statut demande : automatiquement `CLOSED`.
- Notification au particulier : *"Votre prestataire a confirmé la réalisation du service."*

---

## 4. Parcours 2 — Demande directe (DirectRequest)

### 4.1 Côté Particulier

#### Étape 1 — Sélection du prestataire

Le particulier consulte le profil public d'un professionnel ou d'une entreprise et clique sur "Envoyer une demande directe".

#### Étape 2 — Création et envoi immédiat (statut : PUBLISHED)

- **Route :** `GET/POST /individual/direct-request/new/{type}/{id}`
  - `type` = `"professional"` ou `"company"`
  - `id` = identifiant du prestataire ciblé
- **Contrôleur :** `DirectRequestController::new()`
- **Template :** `templates/individual/new_direct_request.html.twig`

Champs identiques à la QuoteRequest (titre, description, photos).

> Contrairement à la QuoteRequest, **il n'y a pas de brouillon** : la demande directe est publiée immédiatement à la soumission.

Une notification est envoyée instantanément au prestataire ciblé.

#### Étape 3 — Suivi et décision

Identique au Parcours 1 (voir §3.1 Étape 4 et 5).

### 4.2 Côté Professionnel

#### Étape 1 — Réception

- **Route :** `GET /professional-compte/direct-requests`
- Affiche les demandes directes ciblant ce professionnel.
- Le tableau de bord affiche le **nombre de demandes directes en attente**.

#### Étape 2 — Réponse par une offre

- **Route :** `GET/POST /offer/send-direct/{directRequestId}`
- Contrairement aux QuoteRequests, l'offre sur une DirectRequest est **toujours publiée immédiatement** (pas de mode brouillon).

---

## 5. Cycle de vie des offres (Offer)

### Statuts

| Statut | Qui déclenche | Description |
|--------|---------------|-------------|
| `DRAFT` | Professionnel | Brouillon privé, non visible au particulier |
| `PUBLISHED` | Professionnel | Soumise et visible, en attente de décision |
| `REJECTED` | Particulier | Refusée — état terminal |
| `ACCEPTED` | Particulier | Acceptée — débloque la finalisation |
| `CLOSED` | Professionnel | Service réalisé — état terminal |

### Transitions autorisées

```
DRAFT ──► PUBLISHED ──► ACCEPTED ──► CLOSED
                   └──► REJECTED
```

### Règles d'immuabilité

- Une offre en `DRAFT` peut être **modifiée** et **supprimée**.
- Une offre `PUBLISHED` est **figée** : aucune modification ou suppression n'est possible.
- Les états `REJECTED` et `CLOSED` sont **terminaux et irréversibles**.

---

## 6. Diagrammes d'état

### QuoteRequest / DirectRequest

```
                    ┌──────────┐
       création ──► │  DRAFT   │ ──► suppression
                    └────┬─────┘
                         │ publication (par le particulier)
                         ▼
                    ┌──────────┐
                    │ PUBLISHED│ ◄─── réception d'offres
                    └────┬─────┘
                         │ offre acceptée (automatique)
                         ▼
                    ┌──────────┐
                    │  CLOSED  │  (état terminal)
                    └──────────┘
```

> Note : Le statut `ACCEPTED` est défini dans le code mais **non utilisé en pratique**. La demande passe directement de `PUBLISHED` à `CLOSED`.

### Offer

```
                    ┌──────────┐
       création ──► │  DRAFT   │ ──► suppression (par le professionnel)
                    └────┬─────┘
                         │ envoi (par le professionnel)
                         ▼
                    ┌──────────┐
                    │ PUBLISHED│
                    └────┬─────┘
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
        ┌──────────┐          ┌──────────┐
        │ REJECTED │          │ ACCEPTED │
        │ (terminal)│         └────┬─────┘
        └──────────┘               │ finalisation (par le professionnel)
                                   ▼
                             ┌──────────┐
                             │  CLOSED  │
                             │ (terminal)│
                             └──────────┘
```

---

## 7. Notifications

Toutes les notifications sont stockées dans l'entité `Notification` avec les champs `relatedEntityId` et `relatedEntityType` pour permettre la navigation directe.

| Déclencheur | Destinataire | Titre | Message |
|-------------|-------------|-------|---------|
| Publication d'une QuoteRequest | Tous les pros de la catégorie | — | "Nouvelle demande publiée : [titre]" |
| Création d'une DirectRequest | Prestataire ciblé | — | "Nouvelle demande directe de [nom] : [titre]" |
| Publication d'une Offer | Particulier | "Nouvelle offre reçue" | "[Prestataire] a soumis une offre de [prix]€ pour '[titre]'" |
| Mise à jour d'une Offer | Particulier | "Offre mise à jour" | (même format) |
| Acceptation d'une Offer | Professionnel | "Offre acceptée" | "Votre offre pour '[titre]' a été acceptée !" |
| Rejet d'une Offer | Professionnel | "Offre refusée" | "Votre offre pour '[titre]' a été refusée" |
| Finalisation d'une Offer | Particulier | — | "Votre prestataire a confirmé la réalisation du service" |

---

## 8. Règles métier critiques

1. **Un seul prestataire par demande acceptée** : lorsqu'une offre est acceptée, toutes les autres offres `PUBLISHED` de la même demande sont automatiquement rejetées.

2. **Immuabilité post-publication** : une demande ou une offre publiée ne peut plus être modifiée afin de garantir la traçabilité et la confiance entre les parties.

3. **Clôture en cascade** : accepter une offre → ferme la demande parente ; finaliser une offre → ferme aussi la demande parente.

4. **Exclusivité d'offre** : un professionnel ne peut soumettre **qu'une seule offre** par demande de devis.

5. **Offre directe = publication immédiate** : les offres en réponse à une `DirectRequest` n'ont pas de mode brouillon.

6. **Disponibilité du professionnel** : le statut `availabilityStatus` (AVAILABLE / BUSY / UNAVAILABLE) du professionnel est visible sur son profil public mais **n'est pas actuellement appliqué comme filtre** sur les demandes qui lui sont soumises.

---

## 9. Tableau de bord et KPIs

### Dashboard Particulier (`/individual-compte/`)

| KPI | Calcul |
|-----|--------|
| Demandes publiées | Nombre de QuoteRequests en `PUBLISHED` |
| Offres reçues | Total des offres `PUBLISHED` non traitées |
| Demandes directes envoyées | Nombre de DirectRequests envoyées |

### Dashboard Professionnel (`/professional-compte/`)

| KPI | Calcul |
|-----|--------|
| Demandes disponibles | QuoteRequests publiées dans sa catégorie |
| Offres envoyées | Total des offres soumises |
| Taux de conversion | (Offres acceptées ÷ Offres publiées/acceptées) × 100% |
| Demandes directes en attente | DirectRequests reçues sans réponse |

---

## 10. Routes et points d'entrée

### Particulier

| Route | Méthode | Action |
|-------|---------|--------|
| `/individual-compte/quote/new` | GET/POST | Créer une demande |
| `/individual-compte/quotes` | GET | Lister mes demandes |
| `/individual-compte/quote/{id}` | GET | Voir / modifier une demande |
| `/individual-compte/quote/{id}/publish` | POST | Publier une demande |
| `/individual-compte/quote/{id}/delete` | POST | Supprimer une demande |
| `/individual/direct-request/new/{type}/{id}` | GET/POST | Envoyer une demande directe |
| `/individual-compte/direct-requests` | GET | Lister mes demandes directes |
| `/individual-compte/offers` | GET | Voir les offres reçues |
| `/individual-compte/offer/{id}` | GET | Détail d'une offre |
| `/individual-compte/offer/{id}/accept` | POST | Accepter une offre |
| `/individual-compte/offer/{id}/reject` | POST | Rejeter une offre |

### Professionnel

| Route | Méthode | Action |
|-------|---------|--------|
| `/professional-compte/quotes` | GET | Parcourir les demandes disponibles |
| `/professional-compte/direct-requests` | GET | Voir les demandes directes reçues |
| `/professional-compte/offers` | GET | Gérer mes offres |
| `/offer/send/{id}` | GET/POST | Soumettre une offre (QuoteRequest) |
| `/offer/send-direct/{id}` | GET/POST | Soumettre une offre (DirectRequest) |
| `/offer/{id}/finalize` | POST | Finaliser une offre acceptée |
| `/offer/{id}/delete` | POST | Supprimer un brouillon d'offre |

---

## 11. Recommandations

### 11.1 Bugs et incohérences à corriger

#### R1 — Statut `ACCEPTED` inutilisé sur les demandes
**Constat :** Le statut `ACCEPTED` est défini dans `QuoteRequest` et `DirectRequest` mais n'est jamais attribué. La demande passe directement de `PUBLISHED` à `CLOSED`.
**Recommandation :** Soit supprimer ce statut pour simplifier le code, soit l'implémenter pour distinguer "accord trouvé" (ACCEPTED) de "service terminé" (CLOSED), ce qui améliorerait la granularité du suivi.

#### R2 — `availabilityStatus` non appliqué comme filtre
**Constat :** Un professionnel marqué `UNAVAILABLE` reçoit quand même des notifications de nouvelles demandes et peut encore soumettre des offres.
**Recommandation :** Filtrer les notifications et l'affichage des demandes en fonction du statut de disponibilité. Optionnellement, bloquer la soumission d'offres si `UNAVAILABLE`.

#### R3 — Offre directe sans brouillon
**Constat :** Les offres sur `DirectRequest` sont publiées immédiatement sans possibilité de brouillon, contrairement aux offres sur `QuoteRequest`.
**Recommandation :** Harmoniser le comportement : autoriser un brouillon pour les offres directes également, ou documenter clairement cette différence intentionnelle.

---

### 11.2 Améliorations fonctionnelles

#### R4 — Messagerie interne entre particulier et professionnel
**Constat :** Aucune communication possible entre les parties après la publication d'une offre. Un particulier ne peut pas poser de questions avant d'accepter.
**Recommandation :** Ajouter un fil de messages attaché à chaque `Offer` (entité `Message` avec relation ManyToOne vers `Offer`), visible des deux côtés.

#### R5 — Système d'avis et de notation post-clôture
**Constat :** L'entité `Review` existe dans le modèle (`Business::reviews`) mais il n'y a pas de déclenchement automatique d'invitation à laisser un avis après la clôture d'une offre.
**Recommandation :** Au moment où l'offre passe en `CLOSED`, envoyer une notification au particulier l'invitant à laisser un avis sur le prestataire.

#### R6 — Date d'expiration des demandes
**Constat :** Une `QuoteRequest` publiée peut rester ouverte indéfiniment même si le particulier a trouvé un prestataire ailleurs.
**Recommandation :** Ajouter un champ `expiresAt` (DateTime, nullable) sur `QuoteRequest`. Mettre en place une tâche planifiée (Symfony Scheduler ou cron) qui passe automatiquement les demandes expirées en `CLOSED`.

#### R7 — Contre-proposition de prix
**Constat :** Le particulier ne peut qu'accepter ou rejeter une offre. Il ne peut pas négocier.
**Recommandation :** Ajouter une action "Contre-proposition" qui envoie une notification au professionnel avec un prix suggéré, lui permettant de modifier son offre dans un délai imparti (en revenant à un état DRAFT spécial).

#### R8 — Pagination et filtres sur les listes
**Constat :** Les listes de demandes et d'offres ne sont pas paginées côté professionnel (`professional_quotes` charge toutes les demandes de la catégorie).
**Recommandation :** Implémenter la pagination (KnpPaginatorBundle ou pagination native Doctrine) et des filtres (par statut, date, prix) pour les professionnels actifs avec un grand volume de demandes.

---

### 11.3 Sécurité et robustesse

#### R9 — Vérification de propriété systématique
**Constat :** La vérification que l'`Offer` appartient bien au particulier connecté est présente dans `individual_offer_show` mais doit être vérifiée sur toutes les actions sensibles (accept, reject).
**Recommandation :** Utiliser un `Voter` Symfony (`OfferVoter`) centralisé plutôt que des vérifications inline dans chaque action de contrôleur.

#### R10 — Protection contre les doubles soumissions
**Constat :** Un professionnel ne peut soumettre qu'une offre par demande, mais cette contrainte est appliquée uniquement au niveau applicatif.
**Recommandation :** Ajouter une contrainte d'unicité au niveau base de données : `UNIQUE(quoteRequest_id, provider_id)` et `UNIQUE(directRequest_id, provider_id)` sur la table `offer`.

#### R11 — Audit trail des transitions d'état
**Constat :** Il n'y a pas de journal des changements de statut. Si un litige survient, il est impossible de savoir quand et par qui un statut a changé.
**Recommandation :** Créer une entité `StatusHistory` (entité, statut précédent, statut suivant, utilisateur, timestamp) et l'alimenter à chaque transition via un Event Symfony (`OfferStatusChanged`, `RequestStatusChanged`).

---

### 11.4 Expérience utilisateur

#### R12 — Indicateur de progression du workflow
**Constat :** Ni le particulier ni le professionnel n'ont de vue synthétique de l'état d'avancement d'une demande spécifique.
**Recommandation :** Ajouter un composant "stepper" visuel sur la page de détail d'une demande, affichant les étapes : Créée → Publiée → Offre reçue → Offre acceptée → Service réalisé.

#### R13 — Notifications par email
**Constat :** Les notifications sont uniquement in-app. Un prestataire qui ne se connecte pas régulièrement rate les nouvelles demandes.
**Recommandation :** Envoyer un email récapitulatif (via Symfony Mailer + template Twig) pour les événements critiques : nouvelle demande dans sa catégorie, offre acceptée/rejetée, nouvelle demande directe.

#### R14 — Délai de réponse moyen
**Constat :** Le tableau de bord professionnel n'affiche pas le temps moyen de réponse aux demandes, alors qu'il s'agit d'un facteur de confiance important pour les particuliers.
**Recommandation :** Calculer et afficher le délai moyen entre la publication d'une demande et la soumission d'une offre par ce professionnel. Afficher ce KPI sur son profil public.

---

*Rapport généré à partir de l'analyse du code source de Drilleedo v2.*
*Fichiers de référence : `src/Controller/IndividualController.php`, `src/Controller/ProfessionalController.php`, `src/Controller/DirectRequestController.php`, `src/Controller/OfferController.php`, `src/Entity/QuoteRequest.php`, `src/Entity/DirectRequest.php`, `src/Entity/Offer.php`.*
