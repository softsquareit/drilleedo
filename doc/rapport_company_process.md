# Company Profile Redesign & Agency Reputation Model

This document outlines the architectural transformation of the Company entity into a high-performance agency profile.

## 1. Current Architecture Summary
Companies inherit from `Business` and share many components with Professionals, but have agency-specific fields like `foundationYear` and `EmpNum`.
- **Issue**: Banner stats (reviews, project count) are currently hardcoded placeholders.

## 2. Identified Problems
- **Placeholders**: Banner displays `616 completed projects` and `215 reviews` regardless of actual data.
- **Agency Identity**: No differentiation between an agency's reputation and individual member performance (if applicable).
- **Service Mapping**: Company categories are ManyToMany but specific "Service Offerings" with pricing are missing.

## 3. Proposed Architecture (Agency Model)

### Reputation & Trust
- **Verification Logic**: Add `isVerified` and `verifiedAt` directly to `Business` (parent).
- **Consolidated Reviews**: Aggregate reviews across all company projects to the company level.

### Dynamic Metrics for Agencies
| Metric | Calculation Logic |
|--------|-------------------|
| **Agency Rating** | Average of all reviews targeted at this Company entity |
| **Total Jobs** | `COUNT(AcceptedOffers)` linked to this Company |
| **Team Size** | Reflect `EmpNum` but allow dynamic linking of `Professional` profiles to a `Company` if desired in future. |

## 4. New Entities & Extensions

#### [Refactor] `Projet` -> `CaseStudy` / `ProjectPortofolio`
Add:
- `clientReview`: OneToOne link to a Review.
- `duration`: Computed field.
- `serviceType`: Link to a structured `Service` entity.

#### [NEW] `AgencyService`
Company-specific service offerings with description and "Starting at" price.

## 5. Data Calculation Processes

### Event: Project Finalized
- **Trigger**: `Offer` status changed to `CLOSED`.
- **Action**: Increment `completedProjectsCount` in `BusinessStats`.
- **UI Update**: Banner stat in company profile updates instantly.

### Event: Company Verification
- **Process**: Admin manually verifies credentials (licenceNum).
- **Action**: Set `isVerified = true`.
- **UI Update**: Show "Verified Icon" on public search and profile.

## 6. UI Data Mapping

| Section | Logic |
|---------|-------|
| **Agency Banner** | `stats.averageRating`, `stats.totalReviews`, `stats.completedProjects` |
| **Service Sidebar** | Render collection of `Service` entities linked to Company |
| **Reputation Feed** | Paged list of `Review` entities |

## 7. Symfony Technical Guidelines

- **Stat Denormalization**: Use a `BusinessStats` table as a shared cache for both `Professional` and `Company`.
- **Lazy Loading Strategy**: Keep the large `about` text and `links` collection lazy-loaded; keep `stats` eager-loaded for listing pages.
- **EasyAdmin**: Configure two distinct dashboards for Pro vs Company to handle the different metadata fields (`expYears` vs `foundationYear`).
