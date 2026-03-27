# Audit: Fiche Professionnels & Mapping Entity

**Document Type**: Technical Audit & Gap Analysis  
**Entity Targets**: `Professional`, `Company`, `Business`  
**Scope**: Comparison between Public Profile (UI) and Database Schema (Doctrine).

---

## 1. Synthèse des Attributs

### 1.1 Attributs Confirmés (Entity ↔ Fiche)
Ces attributs existent en base de données et sont correctement mappés dynamiquement dans les templates.
- **Identité**: `company_name`, `tradeName`, `firstName`, `lastName`.
- **Visuels**: `logo` (Profile Photo), `banner`.
- **Contenu**: `about` (Bio), `expYears` (Expérience).
- **Contact**: `phoneNum`, `email`, `city`.
- **Badges**: `isVerified`, `isTopRated`.
- **Portfolio**: `projets` (Relation OneToMany vers `Projet`).
- **Expertise**: `category` (Relation vers `Category`).
- **Listes JSON**: `whyChooseUs`, `services` (Stockés en JSON dans `Business`).

### 1.2 Attributs Manquants (Statiques dans la Fiche, absents de l'Entity)
Ces éléments sont actuellement "en dur" (hardcoded) dans les templates et doivent être rendus dynamiques.
- **FAQ**: Les sections FAQ sont statiques dans `public_show.html.twig` et `company_show`.
  - *Recommandation*: Créer un champ `faq` (JSON) dans `Business`.
- **Horaires d'ouverture**: Affichés comme "8:00 - 18:00" en dur.
  - *Recommandation*: Créer une entité `OpeningHours` ou un champ JSON.
- **Langues Parlées**: Affichées en icônes (FR/EN) statiques.
  - *Requirement*: Liste prédéfinie [Français, Anglais, Espagnol, Italien].
- **Zone d'intervention**: Mentionnée comme "40km" ou via des "chips" de villes (Laval, Montréal).
  - *Requirement*: Besoin d'un champ dédié (Texte ou Rayon).
- **Assurance responsabilité civile**: Statut de couverture d'assurance.
  - *Requirement*: Champ Booléen [Oui / Non].
- **Préférences de Contact**: Paramètres de notification et de réception de leads.
  - *Requirement*: Champs pour [Demandes publiques, Demandes directes, Notifications Email, Notifications SMS].
- **Badge de Réponse**: Le badge "⚡ Fast Response" est statique.
  - *Recommandation*: Devrait être lié à une logique basée sur `BusinessStats.avgResponseTime`.

### 1.3 Attributs à Intégrer dans le CRUD Admin
Attributs existants en base mais non présents ou incomplets dans les formulaires Admin/Compte.
- **whyChooseUs**: Manque dans le CRUD `Company` (présent dans `Professional`).
- **services**: Manque dans le CRUD `Company`.
- **EntrepreneurType**: Non géré visuellement dans la fiche.
- **FoundationYear**: Calculer l'âge de l'entreprise au lieu d'un champ `expYears` statique pour les `Company`.

---

## 2. Logique de Données

### 2.1 Attributs Calculés (Automatisés)
Ces valeurs ne doivent pas être saisies manuellement mais calculées par le système.
- **Moyenne des Notes**: `BusinessStats.averageRating`.
- **Nombre de Avis**: `BusinessStats.reviewCount`.
- **Rapidité de Réponse**: Calculée depuis la latence moyenne des réponses aux `QuoteRequest`.
- **Projets Terminés**: `count(projets)`.
- **Disponibilité**: Mappage de `availabilityStatus` [Disponible immédiatement, Sur rendez-vous].

### 2.2 Attributs Hors-CRUD (Lecture seule)
Valeurs provenant d'interactions tierces.
- **Notes & Avis**: Proviennent des feedbacks clients (non modifiables par le pro).
- **Stats de Vue**: Nombre de visites sur le profil.

### 2.3 Attributs Saisis par le Professionnel (Espace Compte)
- **Bio & Description**: `about`.
- **Compétences & Pourquoi nous**: `services`, `whyChooseUs`.
- **Contact & Réseaux**: `phoneNum`, `links`.
- **Portfolio**: Ajout/Suppression de `Projet`.

---

## 3. Recommandations d'Audit

| Manque Critique | Impact | Solution |
| :--- | :--- | :--- |
| **FAQ Statique** | Faible flexibilité | Créer `Business.faq` (JSON). |
| **Notes Hardcoded**| Perte de confiance | Mapper `BusinessStats.averageRating` systématiquement. |
| **Services Statiques**| UX pauvre | Harmoniser `ProfessionalType` et `CompanyType` pour inclure les listes JSON. |
| **Typo Adress** | Dette technique | Renommer `Adress` en `Address` (déjà identifié). |

---
**Rapport d'audit de référence pour Drilleedo.**
