# Qualité du Code - Drilleedo v2

**Date :** 2026-04-01

---

## Points positifs

- Symfony 7.4 (version moderne et maintenue)
- PHP 8.2+ avec types stricts et attributes
- Doctrine ORM bien utilisé
- Structure MVC respectée globalement
- Twig avec auto-escape activé (sécurité XSS)
- CSRF protection configurée
- Single Table Inheritance bien implémentée pour User hierarchy
- Utilisation des Symfony Constraints pour la validation

---

## Problèmes de qualité identifiés

---

### [CODE-01] AdminController monolithique — 22 000+ lignes

**Fichier :** `src/Controller/AdminController.php`
**Niveau :** CRITIQUE pour la maintenabilité

**Problème :** Un seul contrôleur gère la totalité du backoffice. C'est une violation du principe de responsabilité unique (SRP) et rend le code :
- Difficile à lire et maintenir
- Impossible à tester efficacement
- Susceptible de conflits dans git

**Structure recommandée :**
```
src/Controller/Admin/
    DashboardController.php     # Statistiques et vue d'ensemble
    ProfessionalController.php  # CRUD professionnels
    CompanyController.php       # CRUD entreprises
    IndividualController.php    # CRUD particuliers
    BlogController.php          # Gestion articles (existe déjà dans Dashboard/)
    CategoryController.php      # Gestion catégories
    RequestController.php       # Demandes de devis
    TestimonialController.php   # Témoignages
    TypeController.php          # Types
    UserController.php          # Gestion utilisateurs globale
```

**Exemple de refactoring :**
```php
// Avant : AdminController.php ligne ~500
public function editProfessional(Request $request, Professional $professional): Response { ... }

// Après : Admin/ProfessionalController.php
#[Route('/admin/professional', name: 'admin_professional_')]
#[IsGranted('ROLE_ADMIN')]
class ProfessionalController extends AbstractController
{
    #[Route('/{id}/edit', name: 'edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Professional $professional): Response { ... }
}
```

---

### [CODE-02] Logique métier dans les contrôleurs

**Fichiers :** `src/Controller/HomeController.php`, `src/Controller/AdminController.php`
**Niveau :** MOYEN

La logique de filtrage, de calcul de statistiques et de traitement des données se trouve directement dans les contrôleurs. Les contrôleurs devraient uniquement orchestrer, pas traiter.

**Exemple problème :**
```php
// HomeController.php — logique de filtrage dans le contrôleur
public function professionals(Request $request): Response
{
    $category = $request->query->get('category');
    $city = $request->query->get('city');
    $minRating = $request->query->get('rating', 0);

    // Filtrage et tri dans le contrôleur (devrait être dans le Repository/Service)
    $professionals = $this->professionalRepository->findAll();
    $filtered = array_filter($professionals, function($p) use ($category, $city, $minRating) {
        // ...
    });
}
```

**Correction :**
```php
// src/Service/ProfessionalSearchService.php
class ProfessionalSearchService
{
    public function search(ProfessionalSearchCriteria $criteria): PaginatedResult
    {
        return $this->repository->findByCriteria($criteria);
    }
}

// src/DTO/ProfessionalSearchCriteria.php
class ProfessionalSearchCriteria
{
    public function __construct(
        public readonly ?string $category = null,
        public readonly ?string $city = null,
        public readonly float $minRating = 0,
        public readonly int $page = 1,
        public readonly int $limit = 12,
    ) {}
}
```

---

### [CODE-03] Pas d'interface sur les services

**Fichier :** `src/Service/FileUploader.php`
**Niveau :** FAIBLE

Les services ne sont pas définis derrière des interfaces, rendant les tests difficiles (pas de mock possible).

```php
// src/Service/FileUploaderInterface.php
interface FileUploaderInterface
{
    public function upload(UploadedFile $file): string;
    public function delete(string $filename): void;
}

// src/Service/FileUploader.php
class FileUploader implements FileUploaderInterface { ... }

// config/services.yaml
services:
    App\Service\FileUploaderInterface: '@App\Service\FileUploader'
```

---

### [CODE-04] Duplication de code entre contrôleurs

**Fichiers :** `src/Controller/ProfessionalController.php`, `src/Controller/CompanyController.php`
**Niveau :** MOYEN

La gestion des uploads de photos/logos/bannières est dupliquée dans chaque contrôleur.

**Correction — Trait ou classe abstraite :**
```php
// src/Controller/Trait/HandleUploadTrait.php
trait HandleUploadTrait
{
    private function handleFileUpload(
        ?UploadedFile $file,
        string $uploadDir,
        ?string $existingFile = null
    ): ?string {
        if (!$file) {
            return $existingFile;
        }

        if ($existingFile) {
            $this->fileUploader->delete($existingFile);
        }

        return $this->fileUploader->upload($file, $uploadDir);
    }
}
```

---

### [CODE-05] Commentaires et documentation insuffisants

**Niveau :** FAIBLE

Les méthodes complexes (dashboard stats, recherche filtrée, gestion des offres) n'ont pas de commentaires expliquant la logique métier.

**Standard recommandé :**
```php
/**
 * Retourne les professionnels selon les critères de recherche.
 *
 * Si aucun critère n'est fourni, retourne tous les professionnels actifs
 * triés par note (décroissant) puis par nombre d'avis.
 *
 * @param ProfessionalSearchCriteria $criteria Critères de filtre
 * @return Professional[] Liste paginée des professionnels
 */
public function findByCriteria(ProfessionalSearchCriteria $criteria): array
```

---

### [CODE-06] Nommage incohérent

**Niveau :** FAIBLE

Inconsistances dans les noms de variables et méthodes :
- `$professionnel` vs `$professional` (mix français/anglais)
- `getWhyChooseUs()` (anglais) vs `getTitre()` (français dans certaines entités)
- Routes en français dans certains cas, anglais dans d'autres

**Recommandation :** Adopter l'anglais pour le code (variables, méthodes, propriétés) et réserver le français pour les labels/messages dans les fichiers de traduction.

---

### [CODE-07] Entités avec trop de responsabilités

**Fichier :** `src/Entity/Professional.php`
**Niveau :** MOYEN

L'entité Professional contient à la fois :
- Les données d'authentification (héritées de User)
- Les données de profil (nom, photo, ville)
- Les données métier (catégorie, tarifs, services)
- Les données de contenu (galerie, documents JSON)
- Les données statistiques (intégrées via BusinessStats)

**Recommandation :** Utiliser des Value Objects et des classes séparées pour chaque groupe de responsabilités.

---

### [CODE-08] Magic strings non constantes

**Fichiers :** Plusieurs contrôleurs et entités
**Niveau :** FAIBLE

```php
// Problème : chaînes magiques éparpillées
if ($user->getType() === 'professional') { ... }
$this->addFlash('success', 'Profil mis à jour');

// Correction : constantes
// src/Entity/User.php
class User
{
    public const TYPE_PROFESSIONAL = 'professional';
    public const TYPE_COMPANY = 'company';
    public const TYPE_INDIVIDUAL = 'individual';
}

// src/Controller/FlashMessage.php
class FlashMessage
{
    public const SUCCESS = 'success';
    public const ERROR = 'error';
    public const WARNING = 'warning';
}
```

---

### [CODE-09] Pas de DTO pour les données de formulaire

**Niveau :** MOYEN

Les formulaires Symfony sont directement liés aux entités Doctrine. Cela expose les entités à la modification directe et rend les validations complexes.

**Recommandation :** Utiliser des DTO (Data Transfer Objects) pour les formulaires d'inscription et de modification sensibles :

```php
// src/DTO/ProfessionalRegistrationDTO.php
class ProfessionalRegistrationDTO
{
    #[Assert\NotBlank]
    #[Assert\Email]
    public string $email = '';

    #[Assert\NotBlank]
    #[Assert\Length(min: 8)]
    #[Assert\PasswordStrength]
    public string $password = '';

    // ... autres champs
}
```

---

### [CODE-10] Gestion des erreurs incomplète

**Niveau :** MOYEN

Les méthodes d'upload, de traitement de fichiers et d'opérations DB n'ont pas de gestion d'erreur uniforme.

```php
// Avant : exception non catchée
$newFilename = $this->fileUploader->upload($file);

// Après : gestion propre
try {
    $newFilename = $this->fileUploader->upload($file);
} catch (FileException $e) {
    $this->logger->error('File upload failed', ['error' => $e->getMessage()]);
    $this->addFlash('error', 'Erreur lors de l\'upload. Veuillez réessayer.');
    return $this->redirectToRoute('current_route');
}
```

---

## Métriques de qualité

| Métrique | Valeur actuelle | Cible |
|----------|-----------------|-------|
| Complexité cyclomatique max | ~50 (AdminController) | < 10 par méthode |
| Couverture de tests | 0% | > 70% |
| Fichiers > 500 lignes | 3+ | 0 |
| Duplication de code | Élevée | < 5% |
| Méthodes > 50 lignes | 20+ | 0 |

---

## Outils recommandés

```bash
# Analyse statique
composer require --dev phpstan/phpstan symfony/phpstan-symfony
vendor/bin/phpstan analyse src/ --level=6

# Style de code
composer require --dev squizlabs/php_codesniffer
vendor/bin/phpcs src/ --standard=PSR12

# Détection de bugs
composer require --dev phpmd/phpmd
vendor/bin/phpmd src/ text cleancode,codesize,controversial,design,naming,unusedcode

# Métriques
composer require --dev phpmetrics/phpmetrics
vendor/bin/phpmetrics --report-html=doc/audit/metrics/ src/
```
