# Architectural Analysis: Drilleedo Admin & Data Model

**Date**: March 26, 2026  
**Role**: Symfony Expert & Architect  
**Scope**: Entity Audit, Admin Logic, Security, and Core Relations.

---

## 1. Core Architecture & Data Model

The application uses a sophisticated **Joined Table Inheritance** strategy for user management, allowing for distinct specialized profiles while sharing a common identity.

### 1.1 User Inheritance Tree
The `User` entity is abstract and serves as the root of the hierarchy:
-   **User** (Base)
    -   **Admin**: Dedicated administrative account.
    -   **Individual**: End-users requesting services.
    -   **Business** (Intermediate Abstract Layer):
        -   **Professional**: Independent contractors (ManyToOne with Category).
        -   **Company**: Renovation firms (ManyToMany with Category).

> [!NOTE]
> **Architectural Observation**: The use of `JOINED` inheritance is excellent for data integrity but can lead to performance overhead on complex joins. The current implementation is clean and well-structured.

### 1.2 Key Entity Relations
-   **Business Ecosystem**: Both `Professional` and `Company` inherit from `Business`, which aggregates:
    -   `Adress` (OneToMany) — *Note: Typo in entity name "Adress" instead of "Address".*
    -   `Projet` (Portfolio projects, OneToMany).
    -   `Link` (Social/Web links, OneToMany).
    -   `BusinessStats` (Ratings, response times, OneToOne).
    -   `PrimaryContact` (OneToOne).
-   **Requests Workflow**:
    -   `QuoteRequest`: Service requests from Individuals.
    -   `DirectRequest`: Direct inquiries to specific Businesses.
    -   `Offer`: Responses sent by Businesses to Requests.

---

## 2. Administrative Logic Audit

### 2.1 The Admin Controller (`AdminController.php`)
The admin logic is currently centralized in a monolithic `AdminController`.
-   **Size**: ~1350 lines.
-   **Responsibilities**: Manages 10+ distinct entities (Companies, Pros, Blogs, etc.).
-   **Design Pattern**: Standard Symfony CRUD pattern. It does NOT use an admin generator like EasyAdminBundle, giving full control but increasing maintenance surface area.

### 2.2 Security Configuration
Security is primarily enforced at the **Method Level** using the `#[IsGranted('ROLE_ADMIN')]` attribute.
-   **Pros**: Highly granular and explicit.
-   **Cons**: Relies on developers not forgetting the attribute on new routes.
-   **Status**: `security.yaml` has global access control commented out, making the controller attributes the primary line of defense.

---

## 3. Findings & Recommendations

### 3.1 Architectural Strengths
-   **Solid Inheritance**: The `User -> Business -> Professional/Company` flow is a textbook example of good OOP design for a marketplace.
-   **Rich Relations**: The data model is very complete, covering everything from verification status to completion rates.

### 3.2 Points for Improvement (Expert Advice)
1.  **Naming Consistency**:
    -   Rename `Adress` to `Address`.
    -   Rename `Category.childs` to `Category.children` (better English plural).
2.  **Controller Refactoring**:
    -   The `AdminController` should be split into multiple specialized controllers (e.g., `Admin/BlogController`, `Admin/BusinessController`) to follow the **Single Responsibility Principle**.
3.  **Security Hardening**:
    -   Uncomment and configure `access_control` in `security.yaml` as a "fail-safe" layer:
        ```yaml
        - { path: ^/admin, roles: ROLE_ADMIN }
        ```
4.  **Admin UI**:
    -   Consider integrating **EasyAdminBundle** or **SonataAdmin** if the number of managed entities grows, to reduce boilerplate code.

---

## 4. Entity-Attribute Mapping (Summary)

| Entity | Core Attributes | Primary Relations |
| :--- | :--- | :--- |
| **User** | email, password, person_infos | PersonalInfos, Notifications |
| **Business** | company_name, isVerified, isTopRated | Address, Projects, Stats |
| **Professional** | expYears, availabilityStatus | Category (ManyToOne) |
| **Company** | Website, EmpNum | Categories (ManyToMany) |
| **Category** | name, icon, color | Parent/Child (Self-ref) |

---
**Prepared by**: Antigravity (Symfony Architect)
