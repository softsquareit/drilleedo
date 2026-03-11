# Professional Entity Analysis Report

## 1. Existing Attributes Used (Mapped to UI)
The `Professional` entity (inheriting from `Business` and `User`) currently provides the following attributes that are actively used in the frontend templates (`professional.html.twig`, `_card_professional.html.twig`):

- **Company/Display Name:** `companyName` (from Business) or `personalInfos.firstName` + `lastName` (from User -> PersonalInfos)
- **Category:** `category` (from Professional)
- **Location:** `city` (from Professional)
- **Experience:** `expYears` (from Professional)
- **Images:** `logo` and `banner` (from Business)
- **About Statement:** `about` (from Business)
- **Portfolio:** `projets` (from Business)
- **Contact:** `email` (from User)

## 2. Missing Attributes (Hardcoded in UI)
The following data points are currently hardcoded in the frontend templates (especially in `_card_professional.html.twig`) and should be added to the database schema to make the platform dynamic:

1. **Rating System**
   - **Missing Property:** `averageRating` (Float) and `reviewCount` (Integer).
   - *Current UI:* Hardcoded as `4.8` stars and empty "Client Reviews" section.
2. **Top Rated Badge**
   - **Missing Property:** `isTopRated` (Boolean).
   - *Current UI:* Hardcoded `<div class="pro-badge-top-rated">` for all cards.
3. **Response Time**
   - **Missing Property:** `responseTime` (String or Enum, e.g., "Replies within 2 hours").
   - *Current UI:* Hardcoded as "Replies within 2 hours".
4. **Availability Status**
   - **Missing Property:** `availabilityStatus` (String or Enum, e.g., "Available this week").
   - *Current UI:* Hardcoded as "Available this week".
5. **Location Badges/Flags**
   - **Missing Property:** Short location code or region identifier (e.g., "FN").
   - *Current UI:* Hardcoded as `FN` with a globe icon.

## 3. Recommended Code Modifications
To make these attributes dynamic, the following modifications are recommended:

1. **Update `Business` or `Professional` Entity:**
   ```php
   #[ORM\Column(type: 'float', nullable: true)]
   private ?float $averageRating = null;

   #[ORM\Column(type: 'integer', options: ['default' => 0])]
   private int $reviewCount = 0;

   #[ORM\Column(type: 'boolean', options: ['default' => false])]
   private bool $isTopRated = false;

   #[ORM\Column(type: 'string', length: 50, nullable: true)]
   private ?string $responseTime = null;

   #[ORM\Column(type: 'string', length: 50, nullable: true)]
   private ?string $availabilityStatus = null;
   ```
2. **Update Database:** Generate and run Doctrine migrations.
3. **Update Twig Templates:** 
   - Replace hardcoded `4.8` with `{{ pro.averageRating|default('New') }}`.
   - Wrap the Top Rated badge in `{% if pro.isTopRated %}`.
   - Replace hardcoded "Replies within 2 hours" with `{{ pro.responseTime|default('Contact for details') }}`.
   - Replace hardcoded "Available this week" with `{{ pro.availabilityStatus|default('Check schedule') }}`.
4. **Admin Panel:** Add these new fields to the EasyAdmin configuration or custom admin forms for `Professional`/`Business` so administrators can update them.
