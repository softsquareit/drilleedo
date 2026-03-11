# Company Entity Analysis Report

## 1. Existing Attributes Used (Mapped to UI)
The `Company` entity (inheriting from `Business` and `User`) currently provides the following attributes that are actively used in the frontend templates (e.g., `company.html.twig`, `admin/company/index.html.twig`):

- **Company Name:** `companyName` (from Business)
- **Categories:** `categories` (from Company, ManyToMany)
- **Location:** `Adresse` (from Business, OneToMany -> using `company.Adresse|first.city`)
- **Experience:** `foundationYear` (from Company, calculating `"now"|date("Y") - company.foundationYear`)
- **Company Details:** `empNum` (Employee Number) and `website` (from Company)
- **Images:** `logo` and `banner` (from Business)
- **About Statement:** `about` (from Business)
- **Portfolio:** `projets` (from Business)
- **Contact:** `email` (from User)

## 2. Missing Attributes & Hardcoded Data
The following data points are currently hardcoded in the frontend templates (specifically in `company.html.twig`) and should be added to the database schema or corrected to make the platform dynamic:

1. **Rating System**
   - **Missing Property:** `averageRating` (Float) and `reviewCount` (Integer).
   - *Current UI:* Hardcoded as `4.8` stars and `215 verified reviews` in the banner section.
2. **Top Rated / Verified Badges**
   - **Missing Property:** `isTopRated` (Boolean) and/or `isVerified` (Boolean).
   - *Current UI:* The "Top Rated" badge and "Verified Company" text are statically displayed for every company profile.
3. **Completed Projects (Banner Section)**
   - *Current UI:* The top banner hardcodes `616 completed projects`.
   - *Issue:* While the sidebar correctly uses `{{ company.projets|length }}`, the header banner displays a fake static number.

## 3. Recommended Code Modifications
To make these attributes dynamic, the following modifications are recommended:

1. **Update `Business` or `Company` Entity:**
   ```php
   #[ORM\Column(type: 'float', nullable: true)]
   private ?float $averageRating = null;

   #[ORM\Column(type: 'integer', options: ['default' => 0])]
   private int $reviewCount = 0;

   #[ORM\Column(type: 'boolean', options: ['default' => false])]
   private bool $isTopRated = false;
   
   #[ORM\Column(type: 'boolean', options: ['default' => false])]
   private bool $isVerified = false;
   ```
   *(Note: Moving these to `Business` is recommended since `Professional` also needs them).*

2. **Update Database:** Generate and run Doctrine migrations to add these fields.
3. **Update Twig Templates (`company.html.twig`):** 
   - Replace hardcoded `4.8` with `{{ company.averageRating|default('New') }}` and dynamically render stars.
   - Replace `215 verified reviews` with `{{ company.reviewCount }} verified reviews`.
   - Wrap the "Top Rated" badge in `{% if company.isTopRated %}`.
   - Wrap "Verified Company" in `{% if company.isVerified %}`.
   - Replace `616 completed projects` with `{{ company.projets|length }} completed projects`.
4. **Refine `foundationYear` Calculation:** The logic `{{ "now"|date("Y") - company.foundationYear }}` assumes `foundationYear` is a 4-digit string. Ensure the Data transformer or Admin constraints enforce a 4-digit year format safely.
