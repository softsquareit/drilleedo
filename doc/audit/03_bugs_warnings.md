# Bugs et Avertissements - Drilleedo v2

**Date :** 2026-04-01

---

## BUGS CONFIRMÉS

---

### [BUG-01] count() incorrect sur résultats paginés

**Fichier :** `src/Controller/HomeController.php` (lignes ~105, ~150)
**Sévérité :** MOYEN

**Description :** `count()` sur un objet Pagerfanta retourne le nombre d'items de la page courante (max `itemsPerPage`), non le total. Cela affiche des métriques incorrectes.

```php
// BUG
$professionals = $paginator->paginate($query, $page, 12);
$total = count($professionals); // Retourne 12 au lieu du total réel !

// CORRECT
$total = $professionals->getTotalItemCount(); // Pour KnpPaginator
// ou
$total = $professionals->getNbResults(); // Pour Pagerfanta
```

---

### [BUG-02] Comparaison d'objet par référence pour les contrôles d'accès

**Fichier :** `src/Controller/CompanyController.php`, `src/Controller/ProfessionalController.php`
**Sévérité :** ÉLEVÉ (sécurité + logique)

```php
// BUG : comparaison par référence d'objet — peut échouer selon le cycle de vie Doctrine
if ($project->getBusiness() !== $this->getUser()) {
    throw $this->createAccessDeniedException();
}

// CORRECT : comparaison par ID
if ($project->getBusiness()->getId() !== $this->getUser()->getId()) {
    throw $this->createAccessDeniedException();
}
```

**Note :** En fonction de la configuration Doctrine (proxy objects, identity map), la comparaison `!==` entre deux proxies représentant le même objet peut retourner `true` alors qu'ils représentent le même utilisateur.

---

### [BUG-03] Traduction manquante — clés non traduites

**Fichier :** `config/packages/translation.yaml`
**Sévérité :** FAIBLE

Des clés de traduction sont référencées dans les templates mais peuvent ne pas exister dans tous les fichiers de langue, causant l'affichage des clés brutes (ex: `admin.blog.title` au lieu de "Gestion des articles").

**Vérification :**
```bash
php bin/console translation:extract --force --format=yaml fr
php bin/console translation:extract --force --format=yaml en
```

---

### [BUG-04] Champ `updatedAt` manquant sur plusieurs entités

**Fichiers :** `src/Entity/Category.php`, `src/Entity/Testimonial.php`, `src/Entity/Professional.php`
**Sévérité :** MOYEN

Ces entités n'ont pas de champ `updatedAt`, ce qui empêche :
- Le cache HTTP conditionnel (Last-Modified header)
- Le suivi des modifications dans le sitemap
- L'audit trail admin

**Correction :**
```php
use Doctrine\DBAL\Types\Types;

#[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
private ?\DateTimeInterface $updatedAt = null;

#[ORM\PreUpdate]
public function setUpdatedAtValue(): void
{
    $this->updatedAt = new \DateTimeImmutable();
}
```

Et dans la classe :
```php
#[ORM\HasLifecycleCallbacks]
class Professional
```

---

### [BUG-05] Formulaire DirectRequest — champ file non optionnel en édition

**Fichier :** `src/Form/DirectRequestType.php`, `templates/individual/new_direct_request.html.twig`
**Sévérité :** MOYEN

Si le formulaire d'édition d'une demande directe n'a pas `required: false` sur le champ fichier, l'utilisateur est obligé de re-uploader un fichier à chaque modification, perdant potentiellement la pièce jointe existante.

**Correction :**
```php
// Dans DirectRequestType.php
->add('attachment', FileType::class, [
    'required' => false,  // Ne pas forcer le re-upload
    'mapped' => false,
    'constraints' => [
        new File([
            'maxSize' => '5M',
            'mimeTypes' => ['image/jpeg', 'image/png', 'application/pdf'],
        ])
    ],
])
```

---

### [BUG-06] Flash messages non affichés en cas de redirection après erreur

**Fichiers :** Plusieurs contrôleurs
**Sévérité :** FAIBLE

Certains contrôleurs ajoutent un flash message puis redirigent, mais les templates ne vérifient pas systématiquement `app.flashes`. Si un template ne les affiche pas, le message est perdu.

**Vérification dans les templates :**
```twig
{# Ajouter dans base.html.twig si absent #}
{% for type, messages in app.flashes %}
    {% for message in messages %}
        <div class="alert alert-{{ type }} alert-dismissible fade show" role="alert">
            {{ message }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    {% endfor %}
{% endfor %}
```

---

## AVERTISSEMENTS (WARNINGS)

---

### [WARN-01] Entités JSON sans validation de structure

**Fichiers :** `src/Entity/Professional.php`, `src/Entity/Company.php`
**Sévérité :** MOYEN

Les champs `whyChooseUs`, `services`, `openingHours`, `gallery`, `documents` sont stockés en JSON sans validation de structure :

```php
#[ORM\Column(type: Types::JSON, nullable: true)]
private ?array $services = null;

// Risque : Si le JSON est corrompu ou malformé, json_decode() retourne null
// sans erreur, causant des comportements inattendus dans les templates
```

**Correction :**
```php
public function getServices(): array
{
    return $this->services ?? [];
}

// Avec validation dans le formulaire
->add('services', CollectionType::class, [
    'entry_type' => TextType::class,
    'allow_add' => true,
    'allow_delete' => true,
    'constraints' => [new Count(['max' => 20])],
])
```

---

### [WARN-02] Dossier d'upload potentiellement absent

**Fichier :** `src/Service/FileUploader.php`
**Sévérité :** FAIBLE

Si le dossier d'upload n'existe pas, le service lève une exception non gérée. En production sur un nouveau serveur, ce cas peut se produire.

```php
// Correction : créer le dossier si absent
public function upload(UploadedFile $file): string
{
    if (!is_dir($this->targetDirectory)) {
        mkdir($this->targetDirectory, 0755, true);
    }
    // ...
}
```

---

### [WARN-03] Slug non unique sur les entités

**Fichiers :** `src/Entity/Blog.php`, `src/Entity/Category.php`
**Sévérité :** MOYEN

Si deux blogs ont le même titre (donc le même slug généré), la contrainte unique en base lève une exception non gérée en production.

```php
// Vérifier que le slug est unique avant la persistance
public function generateUniqueSlug(string $title, ?int $existingId = null): string
{
    $baseSlug = $this->slugger->slug($title)->lower();
    $slug = $baseSlug;
    $counter = 1;

    while ($this->blogRepository->slugExists($slug, $existingId)) {
        $slug = $baseSlug . '-' . $counter++;
    }

    return $slug;
}
```

---

### [WARN-04] Tests absents

**Dossier :** `tests/`
**Sévérité :** MOYEN

Le dossier `tests/` est vide. Sans tests automatisés, chaque modification risque d'introduire des régressions non détectées.

**Tests prioritaires à créer :**
```
tests/
    Unit/
        Service/FileUploaderTest.php
        Entity/ProfessionalTest.php
    Integration/
        Repository/ProfessionalRepositoryTest.php
    Functional/
        Controller/HomeControllerTest.php
        Controller/RegistrationControllerTest.php
        Controller/SecurityControllerTest.php
```

**Commencer par les tests fonctionnels critiques :**
```php
// tests/Functional/Controller/SecurityControllerTest.php
class SecurityControllerTest extends WebTestCase
{
    public function testLoginPage(): void
    {
        $client = static::createClient();
        $client->request('GET', '/login');
        $this->assertResponseIsSuccessful();
    }

    public function testLoginWithInvalidCredentials(): void
    {
        $client = static::createClient();
        $client->request('POST', '/login', [
            '_username' => 'fake@test.com',
            '_password' => 'wrongpassword',
        ]);
        $this->assertResponseRedirects('/login');
    }
}
```

---

### [WARN-05] Deprecations Symfony potentielles

**Niveau :** FAIBLE

**Vérification :**
```bash
# Activer le profiler et vérifier les deprecations
APP_ENV=dev php bin/console debug:container --deprecations
php bin/console lint:twig templates/
php bin/console lint:yaml config/
php bin/console doctrine:schema:validate
```

---

### [WARN-06] Logs insuffisants

**Fichier :** `config/packages/monolog.yaml`
**Sévérité :** FAIBLE

Les actions sensibles ne sont pas loguées :
- Tentatives de connexion échouées
- Accès refusé (403)
- Uploads de fichiers
- Modifications admin

**Correction :**
```php
// Dans SecurityController
use Psr\Log\LoggerInterface;

public function login(LoggerInterface $logger, Request $request): Response
{
    // Log les tentatives
    $logger->info('Login attempt', [
        'email' => $request->request->get('_username'),
        'ip' => $request->getClientIp(),
    ]);
}
```

---

### [WARN-07] Entité `city` dénormalisée dans Professional

**Fichier :** `src/Entity/Professional.php`
**Sévérité :** FAIBLE

```php
#[ORM\Column(length: 30, nullable: true)]
private ?string $city = null;
```

La ville est stockée en VARCHAR libre, sans référentiel. Cela cause :
- Incohérences ("Montréal", "Montreal", "montreal", "MTL")
- Impossible de faire une recherche géographique efficace
- Pas de validation/suggestions à l'entrée

**Recommandation :** Créer une entité `City` avec un référentiel des villes du Québec ou utiliser une API géographique.

---

## Récapitulatif bugs et warnings

| ID | Type | Description | Sévérité | Effort |
|----|------|-------------|----------|--------|
| BUG-01 | Bug | count() incorrect sur paginator | Moyen | 30 min |
| BUG-02 | Bug | Comparaison d'objets par référence | Élevé | 1h |
| BUG-03 | Bug | Traductions manquantes | Faible | 2h |
| BUG-04 | Bug | updatedAt manquant | Moyen | 2h |
| BUG-05 | Bug | File upload obligatoire en édition | Moyen | 1h |
| BUG-06 | Bug | Flash messages perdus | Faible | 30 min |
| WARN-01 | Warning | JSON sans validation | Moyen | 2h |
| WARN-02 | Warning | Dossier upload absent | Faible | 30 min |
| WARN-03 | Warning | Slug non unique | Moyen | 2h |
| WARN-04 | Warning | Tests absents | Moyen | 8h+ |
| WARN-05 | Warning | Deprecations Symfony | Faible | 1h |
| WARN-06 | Warning | Logs insuffisants | Faible | 2h |
| WARN-07 | Warning | Ville dénormalisée | Faible | 4h |
