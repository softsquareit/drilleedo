# Exhaustive Entity & Relation Mapping

**Project**: Drilleedo  
**Status**: Verified (March 26, 2026)  
**Architect**: Antigravity

---

## 1. Governance: User Inheritance (Joined Strategy)

All user types inherit from the abstract `User` entity.

| Entity | Inheritance | Roles | Relations |
| :--- | :--- | :--- | :--- |
| **User** | Root (Abstract) | ROLE_USER | `PersonalInfos` (1:1), `Blog` (1:N), `Comment` (1:N), `Notification` (1:N) |
| **Admin** | extends User | ROLE_ADMIN | `roleLevel` (string) |
| **Individual** | extends User | ROLE_INDIVIDUAL | `QuoteRequest` (1:N), `DirectRequest` (1:N) |
| **Business** | extends User (Abstract) | ROLE_BUSINESS | `Adress` (1:N), `Projet` (1:N), `Link` (1:N), `BusinessStats` (1:1), `PrimaryContact` (1:1), `PaymentMethod` (N:N), `EntrepreneurType` (N:1) |
| **Professional** | extends Business | ROLE_PROFESSIONAL | `Category` (N:1) |
| **Company** | extends Business | ROLE_COMPANY | `Category` (N:N) |

---

## 2. Core Entities & Relations

### 2.1 The Request & Offer Workflow
| Entity | Type | targetEntity | Owning/Inversed |
| :--- | :--- | :--- | :--- |
| **QuoteRequest** | N:1 | `Individual` | Owning |
| **QuoteRequest** | N:1 | `Category` | Owning |
| **QuoteRequest** | 1:N | `Offer` | Inversed (`offers`) |
| **DirectRequest** | N:1 | `Individual` | Owning |
| **DirectRequest** | N:1 | `Category` | Owning |
| **DirectRequest** | N:1 | `Professional` | Owning (`targetProfessional`) |
| **DirectRequest** | N:1 | `Company` | Owning (`targetCompany`) |
| **DirectRequest** | 1:N | `Offer` | Inversed (`offers`) |
| **Offer** | N:1 | `QuoteRequest` | Owning |
| **Offer** | N:1 | `DirectRequest` | Owning |
| **Offer** | N:1 | `Business` | Owning (`provider`) |

### 2.2 Content & Interaction
| Entity | Type | targetEntity | Notes |
| :--- | :--- | :--- | :--- |
| **Blog** | N:1 | `Category` | Root category of the post |
| **Blog** | N:1 | `User` | Author of the post |
| **Blog** | 1:N | `Comment` | Comments on the article |
| **Comment** | N:1 | `User` | Author of the comment |
| **Comment** | N:1 | `Blog` | Target article |
| **Testimonial**| -- | -- | Standalone entity (isActive, clientName, content) |

---

## 3. Support & Metadata Entities

- **Adress**: Linked to `Business` (ManyToOne). Attributes: street, city, postalCode.
- **BusinessStats**: Linked to `Business` (OneToOne). Attributes: averageRating, reviewCount, avgResponseTime, completionRate.
- **Link**: Linked to `Business` (ManyToOne). Attributes: link, type (string).
- **Projet**: Linked to `Business` (ManyToOne). Attributes: name, description, startDate, EndDate, mainPhoto, gallery (JSON).
- **PrimaryContact**: Referenced by `Business` (OneToOne). Attributes: firstName, lastName, phone, email.
- **PaymentMethod**: ManyToMany with `Business`. Attributes: name, isActive.
- **Category**: Self-referencing (Parent/Child). Color, Icon. Many-to-Many with `Company`, Many-to-One with `Professional`.
- **Type**: Standalone metadata. Used as a reference for Blogs/Businesses in Admin.

---

## 4. Technical Observations & Inconsistencies

### 4.1 Typos in Database Schema
- `Adress` entity (and repository/table) should be renamed to **Address**.
- `PersonalInfos.adresse` property should be **address**.
- `Category.childs` relation should be **children**.

### 4.2 Architectural Gaps
- **Blog Type**: The `Blog` entity stores `type` as a string (`private ?string $type`), but there is a `Type` entity available. Transitioning to a `ManyToOne` relation with `Type` would improve data consistency.
- **Notification Relation**: `Notification` uses `relatedEntityId` (int) instead of a `Generic` or `Target` relation. This is fine for simple logs but lacks Doctrine referential integrity.
- **City**: The `City` entity exists but is not formally linked to `Professional` or `Address` (which use string fields for city). Linking them would allow for better search/filtering optimizations.

---
**Verification Result**: ✅ All entities analyzed and mapped.
