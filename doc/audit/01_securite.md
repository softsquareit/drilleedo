# Audit Sécurité - Drilleedo v2

**Date :** 2026-04-01

---

## CRITIQUE — Failles à corriger immédiatement

---

### [SEC-01] phpinfo() exposé publiquement

**Fichier :** `public/info.php`
**Niveau :** CRITIQUE

```php
<?php phpinfo();
```

**Risque :** Expose la configuration complète du serveur PHP (version, extensions, chemins, variables d'environnement, modules). Facilite les attaques ciblées.

**Correction :**
```bash
rm public/info.php
```

---

### [SEC-02] Credentials en clair dans les fichiers versionnés

**Fichiers :**
- `.env.local` → `DATABASE_URL="mysql://admin:622280@127.0.0.1:3306/drilleedov2"`
- `.env.local.php` → même credential en PHP array
- `.env.dev` → `APP_SECRET` en clair

**Niveau :** CRITIQUE

**Risque :** Si le dépôt est exposé ou partagé, les credentials de la base de données sont compromis. Le password `622280` est extrêmement faible.

**Corrections :**
1. Ajouter `.env.local` et `.env.local.php` au `.gitignore` (vérifier que ce n'est pas déjà versionné)
2. Changer immédiatement le mot de passe de la base de données
3. Utiliser un mot de passe fort (min 16 caractères, alphanumérique + symboles)
4. En production : utiliser des variables d'environnement système ou un vault (HashiCorp Vault, AWS Secrets Manager)

```bash
# Vérifier si ces fichiers sont trackés par git
git ls-files .env.local .env.local.php
```

---

### [SEC-03] CORS trop permissifs dans .htaccess

**Fichier :** `public/.htaccess` (lignes 30-32)

```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Headers "*"
Header set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PATCH"
```

**Niveau :** CRITIQUE

**Risque :** N'importe quel domaine peut faire des requêtes cross-origin vers votre API. Facilite les attaques CSRF et l'abus des endpoints.

**Correction :**
```apache
# Remplacer par des origines spécifiques
Header set Access-Control-Allow-Origin "https://www.drilleedo.ca"
Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
Header set Access-Control-Allow-Methods "POST, GET, OPTIONS"
```

---

### [SEC-04] Access control désactivé dans security.yaml

**Fichier :** `config/packages/security.yaml`

```yaml
# access_control:
#     - { path: ^/admin, roles: ROLE_ADMIN }
#     - { path: ^/profile, roles: ROLE_USER }
```

**Niveau :** CRITIQUE

**Risque :** Sans règles `access_control`, seules les annotations `#[IsGranted]` sur les contrôleurs protègent les routes. Un contrôleur oublié sans annotation est accessible à tous.

**Correction :**
```yaml
access_control:
    - { path: ^/admin, roles: ROLE_ADMIN }
    - { path: ^/professional, roles: ROLE_PROFESSIONAL }
    - { path: ^/individual, roles: ROLE_INDIVIDUAL }
    - { path: ^/company, roles: ROLE_COMPANY }
    - { path: ^/offer, roles: ROLE_USER }
    - { path: ^/request, roles: ROLE_USER }
```

---

## ÉLEVÉ — Corrections prioritaires

---

### [SEC-05] Validation insuffisante des fichiers uploadés

**Fichier :** `src/Service/FileUploader.php`

```php
// Problème : fallback sur l'extension client non fiable
$extension = $file->guessExtension() ?: $file->getClientOriginalExtension();
```

**Risque :** Absence de whitelist d'extensions et de validation MIME. Un attaquant pourrait uploader un fichier `.php` déguisé.

**Correction :**
```php
class FileUploader
{
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    ];
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

    public function upload(UploadedFile $file): string
    {
        // Valider le MIME type réel (pas celui déclaré par le client)
        $mimeType = $file->getMimeType();
        if (!in_array($mimeType, self::ALLOWED_MIME_TYPES, true)) {
            throw new \InvalidArgumentException('Type de fichier non autorisé.');
        }

        $extension = $file->guessExtension();
        if (!in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
            throw new \InvalidArgumentException('Extension non autorisée.');
        }

        // Valider la taille (ex: max 5MB)
        if ($file->getSize() > 5 * 1024 * 1024) {
            throw new \InvalidArgumentException('Fichier trop volumineux (max 5MB).');
        }

        // ... reste du code
    }
}
```

**Également :** S'assurer que le dossier `public/uploads/` n'exécute pas les scripts PHP via `.htaccess` :
```apache
# public/uploads/.htaccess
php_flag engine off
Options -ExecCGI
AddHandler cgi-script .php .pl .py .jsp
```

---

### [SEC-06] Rate limiting absent sur les formulaires publics

**Fichiers :** `src/Controller/RegistrationController.php`, `src/Controller/SecurityController.php`, `src/Controller/ContactController.php`

**Risque :** Attaques par force brute sur le login, spam sur le formulaire de contact, abus de l'inscription.

**Correction (Symfony Rate Limiter) :**
```yaml
# config/packages/rate_limiter.yaml
framework:
    rate_limiter:
        login_limiter:
            policy: sliding_window
            limit: 5
            interval: '1 minute'
        registration_limiter:
            policy: fixed_window
            limit: 3
            interval: '1 hour'
```

```php
// Dans le controller login
#[Route('/login', name: 'app_login')]
public function login(RateLimiterFactory $loginLimiter, Request $request): Response
{
    $limiter = $loginLimiter->create($request->getClientIp());
    if (!$limiter->consume(1)->isAccepted()) {
        throw new TooManyRequestsHttpException();
    }
    // ...
}
```

---

### [SEC-07] Mot de passe faible sans contrainte de force

**Fichier :** `config/packages/validator.yaml`

```yaml
not_compromised_password: false  # Désactivé !
```

**Risque :** Les utilisateurs peuvent choisir des mots de passe trop simples.

**Correction :**
```php
// Dans les formulaires d'inscription
use Symfony\Component\Validator\Constraints as Assert;

#[Assert\PasswordStrength(minScore: Assert\PasswordStrength::STRENGTH_MEDIUM)]
#[Assert\Length(min: 8, max: 4096)]
private string $password;
```

---

### [SEC-08] Headers de sécurité HTTP manquants

**Fichier :** `public/.htaccess`

**Ajouts recommandés :**
```apache
# Content Security Policy
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-ancestors 'none';"

# HSTS (forcer HTTPS)
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# Anti-clickjacking
Header set X-Frame-Options "DENY"

# MIME sniffing protection
Header set X-Content-Type-Options "nosniff"

# Referrer Policy
Header set Referrer-Policy "strict-origin-when-cross-origin"

# Permissions Policy
Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
```

---

## MOYEN — Améliorations recommandées

---

### [SEC-09] Autorisation insuffisante sur les ressources utilisateur

**Fichier :** `src/Controller/CompanyController.php`

Certaines actions vérifient l'ownership avec `!==` (comparaison par référence) au lieu de comparer les IDs :

```php
// Risque potentiel : comparaison d'objets au lieu d'IDs
if ($project->getBusiness() !== $this->getUser()) {
    throw $this->createAccessDeniedException();
}

// Correction sûre :
if ($project->getBusiness()->getId() !== $this->getUser()->getId()) {
    throw $this->createAccessDeniedException();
}
```

**Ou mieux, utiliser les Voters Symfony :**
```php
$this->denyAccessUnlessGranted('PROJECT_EDIT', $project);
```

---

### [SEC-10] APP_SECRET trop faible en développement

**Fichiers :** `.env.dev`, `.env.test`

```
APP_SECRET='$ecretf0rt3st'  # Trop prévisible
```

**Correction :** Générer un secret fort même en dev :
```bash
php bin/console secret:generate-keys
# ou
openssl rand -hex 32
```

---

### [SEC-11] Pas de Content Security Policy sur l'admin

**Fichier :** `templates/admin/base_admin.html.twig`

L'interface admin charge des scripts externes sans intégrité vérifiée. Ajouter les attributs SRI (Subresource Integrity) :

```html
<link rel="stylesheet"
      href="https://cdn.example.com/bootstrap.min.css"
      integrity="sha384-[hash]"
      crossorigin="anonymous">
```

---

## Récapitulatif sécurité

| ID | Description | Niveau | Effort | Priorité |
|----|-------------|--------|--------|----------|
| SEC-01 | phpinfo() exposé | CRITIQUE | 5 min | P0 |
| SEC-02 | Credentials exposés | CRITIQUE | 30 min | P0 |
| SEC-03 | CORS permissifs | CRITIQUE | 15 min | P0 |
| SEC-04 | Access control désactivé | CRITIQUE | 1h | P0 |
| SEC-05 | Upload sans validation | ÉLEVÉ | 2h | P1 |
| SEC-06 | Pas de rate limiting | ÉLEVÉ | 3h | P1 |
| SEC-07 | Passwords faibles | ÉLEVÉ | 1h | P1 |
| SEC-08 | Headers HTTP manquants | MOYEN | 1h | P2 |
| SEC-09 | Autorisation par référence | MOYEN | 2h | P2 |
| SEC-10 | APP_SECRET faible | FAIBLE | 15 min | P3 |
| SEC-11 | SRI manquant admin | FAIBLE | 2h | P3 |
