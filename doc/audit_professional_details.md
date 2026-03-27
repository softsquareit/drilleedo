# Audit Report: Professional Details Page Dynamic Fields

**Target URL:** `/professional/{id}/{slug}`  
**Template:** `templates/home/professional.html.twig`

## 1. Executive Summary
The professional details page successfully pulls core information (Name, Category, Location, About, Portfolio) from the database. However, several high-impact UX elements, such as verified badges, response indicators, employee counts, and review distributions, are currently **hardcoded** in the template.

---

## 2. Dynamic vs. Static Fields Analysis

### ✅ Dynamic Fields (Working Correctly)
These fields are currently retrieved from the `professional` object (Entity: `Professional` / `Business`):
- **Identity:** Company Name, Category Name, City, About text.
- **Media:** Hero Banner, Logo/Avatar (with fallback).
- **Contact:** Phone Number (if set), Email.
- **Experience:** Years of experience (`expYears`).
- **Portfolio:** Project titles, main photos, and descriptions.
- **Stats:** Average rating and total review count (from `BusinessStats`).

---

### ❌ Hardcoded / Static Fields (Action Required)
The following elements are visually present but do not reflect real data for the specific professional:

#### A. Trust & Badges (Profile Header)
- **Verified Dot (on Avatar):** The checkmark is always displayed regardless of the `isVerified` status.
- **Badges Row:** "✔ Verified", "⭐ Premium Verified", and "⚡ Fast Response" are static chips.
- **Response Badge:** The "⚡ Fast Response" next to the company name is hardcoded.

#### B. Statistical Details (Stats Strip)
- **Employees:** Displays a static range "6 to 10" for all professionals.
- **Languages Spoken:** Hardcoded as "🇫🇷 French & 🇬🇧 English". (Note: The `languages` array exists in the entity but is not rendered).
- **Service Zone Chips:** Montreal, Laval, Longueuil, and Brossard are hardcoded in the Zone Card.

#### C. Reviews & Feedback
- **Review Distribution Bars:** The percentages (85%, 10%, 4%, etc.) are hardcoded and do not reflect actual rating counts.
- **Sample Reviews:** The reviews from "Sophie Duhamel" and "Thomas Martin" are static placeholders.

#### D. Operational Info
- **Opening Hours:** The entire schedule (Mon-Fri 08:00-18:00, etc.) is static text in the sidebar.
- **Intervention Radius:** The fallback "40 km" and "Minimum price $150" are static.

---

## 3. Database & Entity Gap Analysis

| Field in UI | Entity Attribute Status | Recommendation |
| :--- | :--- | :--- |
| **Verified Status** | `isVerified` (Boolean) exists. | Use `{% if professional.isVerified %}` logic. |
| **Top Rated Status** | `isTopRated` (Boolean) exists. | Use `{% if professional.isTopRated %}` logic. |
| **Fast Responder** | **Missing** | Add `isFastResponder` (Boolean) or calculate from response history. |
| **Employee Count** | **Missing** | Add `employeeCount` (String or Enum) to `Business`. |
| **Languages** | `languages` (Array) exists. | Loop through `professional.languages` instead of static text. |
| **Opening Hours** | **Missing** | Add `openingHours` (JSON/Array) to `Business`. |
| **Review Samples** | Missing `Review` entity link. | Implement a `Review` entity and fetch real records. |
| **Intervention Zones** | `interventionZone` (String) exists. | Change to JSON array or implement a `Zone` entity. |

---

## 4. Next Steps
1. **Schema Update:** Add missing fields (`employeeCount`, `openingHours`, `isFastResponder`) to the `Business` entity.
2. **Data Migration:** Populate these fields for existing professionals.
3. **Template Update:** Replace all identified static blocks with dynamic data and conditional Logic.
4. **Admin Refinement:** Ensure these fields are editable in the backend administrative interface.
