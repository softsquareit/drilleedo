# Professional Profile Redesign & Dynamic Process Architecture

This document outlines the architectural transformation of the Professional profile into a dynamic, data-driven marketplace entity.

## 1. Current Architecture Summary
The current model uses a **JOINED inheritance** strategy: `User` -> `Business` -> `Professional`.
- **Strengths**: Shared contact and base info via `Business`.
- **Weaknesses**: Key marketplace data (services) are trapped in JSON blobs. Critical trust indicators (ratings, response speed) are hardcoded in the UI.

## 2. Identified Problems
- **Static Reputation**: Ratings and review counts are hardcoded `4.8` / `New`.
- **Unstructured Services**: `services` JSON makes SQL filtering/search for specific skills impossible.
- **Metric Blindness**: No tracking of response times or completion rates.
- **Vague Availability**: No real-time indication if a pro is taking new work.

## 3. Proposed Architecture (Ideal Model)

### Identity & Specialization
- **Categories & Skills**: Transition from JSON to `Specialty` and `Skill` entities.
- **Verified Status**: Add a `ServiceBadge` entity for achievements (Top Rated, Verified).

### Trust Indicators (New Entities)
#### [NEW] `Review` Entity
| Attribute | Type | Description |
|-----------|------|-------------|
| `rating` | Integer (1-5) | Numeric score |
| `comment` | Text | Feedback text |
| `author` | ManyToOne (User) | The individual who wrote it |
| `target` | ManyToOne (Business) | The professional/company reviewed |
| `offer` | ManyToOne (Offer) | Optional: link to the transaction |

#### [NEW] `BusinessStats` Entity (Performance Cache)
To avoid heavy JOINs during search, we denormalize dynamic metrics.
| Attribute | Calculation / Trigger |
|-----------|-----------------------|
| `averageRating` | `SUM(ratings) / COUNT(reviews)` |
| `reviewCount` | `COUNT(reviews)` |
| `responseTime` | `AVG(Offer.createdAt - Request.creationDate)` |
| `completionRate` | `AcceptedOffers / TotalOffers` |

## 4. Dynamic Data Processes

### Process A: Reputation Update
- **Trigger**: `ReviewCreatedEvent`
- **Action**: Recalculate `averageRating` and `reviewCount` for the target `Business`.
- **Persistence**: Update `BusinessStats` table.

### Process B: Response Metric Calculation
- **Trigger**: `OfferPublishedEvent` (Response to a Quote/Direct Request)
- **Calculation**: Delta between Request creation and Offer creation.
- **Action**: Update `averageResponseTime` in `BusinessStats`.

### Process C: Availability System
- **Status Enum**: `AVAILABLE`, `BUSY`, `ON_LEAVE`.
- **UI Interaction**: Professionals toggle this in their dashboard.

## 5. Professional Card Data Mapping
The `_card_professional.html.twig` must be fully dynamic. Below is the mapping from UI component to the data source.

### Data Requirements & Status

| UI Component | Status | Target Entity | Proposed Attribute / Logic |
|--------------|--------|---------------|----------------------------|
| **Verified Badge** | Hardcoded | `Business` | `isVerified` (Boolean) |
| **Top Rated Badge**| Hardcoded | `Business` | `isTopRated` (Boolean) |
| **Category** | Dynamic | `Professional`| `category.name` |
| **Location** | Dynamic | `Professional`| `city` |
| **Experience** | Dynamic | `Professional`| `expYears` |
| **Average Rating** | Hardcoded | `BusinessStats`| `averageRating` (Calculated) |
| **Rating Count** | Hardcoded | `BusinessStats`| `reviewCount` (Calculated) |
| **Language Code** | Hardcoded | `User` | `languageCode` (String, e.g., "FR") |
| **Response Time** | Hardcoded | `BusinessStats`| `avgResponseTime` (Calculated) |
| **Availability** | Hardcoded | `Professional`| `availabilityStatus` (Enum/String) |

## 6. Dynamic Metrics Calculation & Logic

### Average Rating & Review Count
- **Calculation**: `SUM(reviews.rating) / COUNT(reviews.id)`
- **Trigger**: `PostReviewEvent`
- **Storage**: Cached in `BusinessStats`. Falling back to "New" if count is 0.

### Response Time
- **Calculation**: Average difference between `DirectRequest.createdAt` and the professional's first `Offer.createdAt`.
- **Trigger**: `OfferCreatedEvent`
- **Display Filter**: Format seconds into human-readable strings (e.g., "Replies within 2 hours").

### Availability Status
- **Source**: Manual toggle in Professional Dashboard.
- **Values**: `AVAILABLE` ("Available this week"), `BUSY` ("Fully Booked"), `UNAVAILABLE` ("Away").

## 7. UI Data Mapping (Contexts)

| UI Context | Data Points Displayed |
|------------|----------------------|
| **Professional Card** | All fields in section 5. |
| **Public Profile** | Full stats, detail Reviews, Detailed Portfolio, Badge List. |
| **Professional Dashboard** | Performance metrics, Review feedback, Availability toggle. |
| **Admin CRUD** | Manual Badge Overrides (Verification, Top Rated), Status management. |

## 8. Symfony Architecture Recommendations
1. **Denormalization**: Highly recommended to use a `BusinessStats` OneToOne relation with `Business` to store `averageRating`, `reviewCount`, and `avgResponseTime` to avoid heavy JOINs on listing pages.
2. **Filters**: Add a Twig filter for `format_response_time` to convert timestamps into the "Replies within X" format.
3. **Traits**: Use a `MarketplaceEntityTrait` to share these metrics between `Professional` and `Company`.
