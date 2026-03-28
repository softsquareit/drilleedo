<?php

namespace App\Controller;

use App\Entity\Blog;
use App\Entity\Category;
use App\Entity\Company;
use App\Entity\User;
use App\Entity\Individual;
use App\Entity\Professional;
use App\Entity\Type;
use App\Entity\PaymentMethod;
use App\Entity\Testimonial;
use App\Entity\QuoteRequest;
use App\Entity\DirectRequest;
use App\Entity\Offer;
use App\Repository\CategoryRepository;
use App\Form\BlogType;
use App\Form\PaymentMethodType;
use App\Form\CategoryType;
use App\Form\TestimonialType;
use App\Form\CompanyType;
use App\Form\CompanyBasicType;
use App\Form\CompanyLegalType;
use App\Form\PrimaryContactType;
use App\Entity\PrimaryContact;
use App\Form\AdressType;
use App\Entity\Adress;
use App\Form\ProjetType;
use App\Entity\Projet;
use App\Form\LinkType;
use App\Entity\Link;
use App\Form\CompanyPaymentType;
use App\Form\CompanyCategoryType;
use App\Form\CompanyLogoType;
use App\Form\ProfessionalPhotoType;
use App\Form\CompanyBannerType;
use App\Form\ProfessionalBannerType;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use App\Form\IndividualType;
use App\Form\ProfessionalType;
use App\Form\TypeType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;


use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AdminController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    #[Route('/admin', name: 'admin_dashboard')]
    #[IsGranted('ROLE_ADMIN')]
    public function dashboard(): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser -> getUserIdentifier();
        return $this->render('admin/index.html.twig', [
            'username'            => $username,
            'companies'           => $this->em->getRepository(Company::class)->count([]),
            'individuals'         => $this->em->getRepository(Individual::class)->count([]),
            'professionals'       => $this->em->getRepository(Professional::class)->count([]),
            'blogs'               => $this->em->getRepository(Blog::class)->count([]),
            'categories'          => $this->em->getRepository(Category::class)->count([]),
            'types'               => $this->em->getRepository(Type::class)->count([]),
            'latest_blogs'        => $this->em->getRepository(Blog::class)->findBy([], ['id' => 'DESC'], 5),
            'latest_professionals' => $this->em->getRepository(Professional::class)->findBy([], ['id' => 'DESC'], 5),
            'latest_companies'    => $this->em->getRepository(Company::class)->findBy([], ['id' => 'DESC'], 5),
            'latest_individuals'  => $this->em->getRepository(Individual::class)->findBy([], ['id' => 'DESC'], 5),
        ]);
    }

    #[Route('/admin/companies', name: 'admin_company_index')]
    #[IsGranted('ROLE_ADMIN')]
    public function listCompanies(Request $request): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser -> getUserIdentifier();
        $company = new Company();
        $form = $this->createForm(CompanyType::class, $company);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($company);
            $this->em->flush();

            return $this->redirectToRoute('admin_company_index');
        }

        return $this->render('admin/company/index.html.twig', [
            'username' => $username,
            'companies' => $this->em->getRepository(Company::class)->findAll(),
            'form' => $form,
            'categories' => $this->em->getRepository(Category::class)->findAll(),
        ]);
    }

    #[Route('/admin/companies/create', name: 'admin_company_create')]
    #[IsGranted('ROLE_ADMIN')]
    public function createCompany(Request $request): Response
    {
        $company = new Company();
        $form = $this->createForm(CompanyBasicType::class, $company);
        $form->handleRequest($request);

        /**
         * Symfony form flow
         */
        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($company);
            $this->em->flush();

            return $this->redirectToRoute('admin_company_index');
        }

        /**
         * Manual form flow
         */
        if ($request->isMethod('POST') && $request->request->get('_source') === 'manual_company') {

            $data = $request->request->all();

            $password = bin2hex(random_bytes(12));
            $company = new Company();
            $company->setCompanyName($data['company_name']);
            $company->setEmail($data['email']);
            $company->setPassword($password);

            // IMPORTANT: validate manually or reuse validator
            $this->em->persist($company);
            $this->em->flush();

            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }


        return $this->render('admin/company/create.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/admin/company/{id}/categories', name: 'admin_company_update_categories', methods: ['POST'])]
    public function updateCategories(
        Request $request,
        Company $company,
        CategoryRepository $categoryRepo,
        EntityManagerInterface $em
    ): Response {

        $company->getCategories()->clear();

        $categoryIds = $request->request->all('categories');

        if ($categoryIds) {
            foreach ($categoryIds as $id) {
                $category = $categoryRepo->find($id);
                if ($category) {
                    $company->addCategory($category);
                }
            }
        }

        $em->flush();

        return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
    }


    #[Route('/admin/companies/{id}/edit', name: 'admin_company_edit')]
    #[IsGranted('ROLE_ADMIN')]
    public function editCompany(int $id, Request $request, \App\Service\FileUploader $fileUploader): Response
    {
        $user = $this->getUser();
        $username = $user->getUserIdentifier();
        $company = $this->em->getRepository(Company::class)->find($id);
        if (!$company) {
            throw $this->createNotFoundException();
        }

        // 1. Basic Info Form
        $form1 = $this->createForm(CompanyBasicType::class, $company);
        $modalId = $request->isMethod('POST') ? $request->request->get('modal_id') : null;

        // Handle modal-specific partial submissions DIRECTLY on the entity (bypass full form validation)
        if ($modalId === 'status') {
            $formData = $request->request->all($form1->getName());
            $company->setIsVerified(isset($formData['isVerified']));
            $company->setIsTopRated(isset($formData['isTopRated']));
            $company->setHasInsurance(isset($formData['hasInsurance']));
            $this->em->flush();
            $this->addFlash('success', 'Statut de visibilité mis à jour.');
            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }

        if ($modalId === 'tarif') {
            $formData = $request->request->all($form1->getName());
            $company->setInterventionRadius(!empty($formData['interventionRadius']) ? (int)$formData['interventionRadius'] : null);
            $company->setMinPrice(!empty($formData['minPrice']) ? (int)$formData['minPrice'] : null);
            $company->setFreeQuotes(isset($formData['freeQuotes']));
            $company->setGuaranteedWork(isset($formData['guaranteedWork']));
            $company->setRbqCertified(isset($formData['rbqCertified']));
            // Opening hours via transformer
            $openingHoursRaw = $formData['openingHours'] ?? '';
            $openingHoursArr = empty(trim($openingHoursRaw)) ? [] : array_filter(array_map('trim', explode("\n", str_replace(["\r\n", "\r"], "\n", $openingHoursRaw))));
            $company->setOpeningHours(array_values($openingHoursArr));
            $this->em->flush();
            $this->addFlash('success', 'Tarification et avantages mis à jour.');
            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }

        if ($modalId === 'prefs') {
            $formData = $request->request->all($form1->getName());
            $company->setInterventionZone($formData['interventionZone'] ?? null);
            $company->setLanguages($formData['languages'] ?? []);
            $company->setContactPrefs($formData['contactPrefs'] ?? []);
            $this->em->flush();
            $this->addFlash('success', 'Préférences mises à jour.');
            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }

        // Standard form handling for full form submissions (basic_info modal)
        if ($request->isMethod('POST')) {
            $formName = $form1->getName();
            if ($request->request->has($formName) && !$modalId) {
                $form1->handleRequest($request);
            } elseif ($modalId === 'basic_info') {
                $form1->handleRequest($request);
            }
        } else {
            $form1->handleRequest($request);
        }

        // 2. Legal Info Form
        $form2 = $this->createForm(CompanyLegalType::class, $company);
        if ($request->isMethod('POST') && $request->request->has($form2->getName())) {
            $form2->submit($request->request->all($form2->getName()), false);
        } else {
            $form2->handleRequest($request);
        }

        // 3. Primary Contact Logic
        $contact = $company->getPrimaryContact() ?? new PrimaryContact();
        $contactForm = $this->createForm(PrimaryContactType::class, $contact);
        if ($request->isMethod('POST') && $request->request->has($contactForm->getName())) {
            $contactForm->submit($request->request->all($contactForm->getName()), false);
        } else {
            $contactForm->handleRequest($request);
        }

        // 4. Address Logic
        $address = new Adress();
        $addressForm = $this->createForm(AdressType::class, $address);
        $addressForm->handleRequest($request);

        // 5. Project Logic
        $project = new Projet();
        $projectForm = $this->createForm(ProjetType::class, $project);
        $projectForm->handleRequest($request);

        // 6. Link Logic
        $link = new Link();
        $linkForm = $this->createForm(LinkType::class, $link);
        $linkForm->handleRequest($request);

        // 7. Payment Logic
        $paymentForm = $this->createForm(CompanyPaymentType::class, $company);
        if ($request->isMethod('POST') && $request->request->has($paymentForm->getName())) {
            $paymentForm->submit($request->request->all($paymentForm->getName()), false);
        } else {
            $paymentForm->handleRequest($request);
        }

        // 8. Category Logic
        $categoryForm = $this->createForm(CompanyCategoryType::class, $company);
        if ($request->isMethod('POST') && $request->request->has($categoryForm->getName())) {
            $categoryForm->submit($request->request->all($categoryForm->getName()), false);
        } else {
            $categoryForm->handleRequest($request);
        }

        // 9. Logo Logic
        $logoForm = $this->createForm(CompanyLogoType::class, $company);
        $logoForm->handleRequest($request);

        // 10. Banner Logic
        $bannerForm = $this->createForm(CompanyBannerType::class, $company);
        $bannerForm->handleRequest($request);


        // --- Handle Submissions ---

        if ($form1->isSubmitted() && $form1->isValid()) {
            if ($form1->has('logoFile') && $form1->get('logoFile')->getData() !== null) {
                $logoFile = $form1->get('logoFile')->getData();
                try {
                    $newFilename = $fileUploader->upload($logoFile, 'logos');
                    $company->setLogo($newFilename);
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Error uploading logo');
                }
            }
            $this->em->flush();
            $this->addFlash('success', 'Company basic info updated successfully.');
            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }

        if ($form2->isSubmitted() && $form2->isValid()) {
            $this->em->flush();
            $this->addFlash('success', 'Company legal info updated successfully.');
            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }

        if ($contactForm->isSubmitted() && $contactForm->isValid()) {
            if (!$company->getPrimaryContact()) {
                 $company->setPrimaryContact($contact);
            }
            $this->em->persist($contact);
            $this->em->flush();
            $this->addFlash('success', 'Primary contact updated successfully.');
            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }

        if ($addressForm->isSubmitted() && $addressForm->isValid()) {
            $company->addAdresse($address);
            $this->em->persist($address);
            $this->em->flush();
            $this->addFlash('success', 'Address added successfully.');
            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }

        if ($projectForm->isSubmitted() && $projectForm->isValid()) {
            $photoFile = $projectForm->get('mainPhoto')->getData();
            if ($photoFile) {
                try {
                    $newFilename = $fileUploader->upload($photoFile, 'projects');
                    $project->setMainPhoto($newFilename);
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Error uploading project photo');
                }
            }
            
            $galleryFiles = $projectForm->get('gallery')->getData();
            if ($galleryFiles) {
                $galleryPaths = [];
                foreach ($galleryFiles as $file) {
                    try {
                        $galleryPaths[] = $fileUploader->upload($file, 'projects');
                    } catch (\Exception $e) {
                        // Skip failed uploads
                    }
                }
                $project->setGallery($galleryPaths);
            }

            $company->addProjet($project);
            $this->em->persist($project);
            $this->em->flush();
            $this->addFlash('success', 'Project added successfully.');
            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }

        if ($linkForm->isSubmitted() && $linkForm->isValid()) {
            $company->addLink($link);
            $this->em->persist($link);
            $this->em->flush();
            $this->addFlash('success', 'Link added successfully.');
            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }

        if ($paymentForm->isSubmitted() && $paymentForm->isValid()) {
            $this->em->flush();
            $this->addFlash('success', 'Payment methods updated successfully.');
            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }

        if ($categoryForm->isSubmitted() && $categoryForm->isValid()) {
            $this->em->flush();
            $this->addFlash('success', 'Categories updated successfully.');
            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }

        if ($logoForm->isSubmitted() && $logoForm->isValid()) {
            $logoFile = $logoForm->get('logoFile')->getData();
            if ($logoFile) {
                try {
                    $newFilename = $fileUploader->upload($logoFile, 'logos');
                    $company->setLogo($newFilename);
                    $this->em->flush();
                    $this->addFlash('success', 'Logo updated successfully.');
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Error uploading logo');
                }
            }
            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }

        if ($bannerForm->isSubmitted() && $bannerForm->isValid()) {
            $bannerFile = $bannerForm->get('bannerFile')->getData();
            if ($bannerFile) {
                try {
                    $newFilename = $fileUploader->upload($bannerFile, 'banners');
                    $company->setBanner($newFilename);
                    $this->em->flush();
                    $this->addFlash('success', 'Banner updated successfully.');
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Error uploading banner');
                }
            }
            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }


        return $this->render('admin/company/edit.html.twig', [
            'form1' => $form1,
            'form2' => $form2,
            'contactForm' => $contactForm,
            'addressForm' => $addressForm,
            'projectForm' => $projectForm,
            'linkForm' => $linkForm,
            'linkForm' => $linkForm,
            'paymentForm' => $paymentForm,
            'categoryForm' => $categoryForm,
            'logoForm' => $logoForm,
            'bannerForm' => $bannerForm,
            'company' => $company,
            'username' => $username,
            'companies' => $this->em->getRepository(Company::class)->findAll(),
            'categories' => $this->em->getRepository(Category::class)->findAll(),
        ]);
    }

    #[Route('/admin/companies/{id}/delete', name: 'admin_company_delete')]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteCompany(int $id): Response
    {
        $company = $this->em->getRepository(Company::class)->find($id);
        if ($company) {
            $this->em->remove($company);
            $this->em->flush();
        }

        return $this->redirectToRoute('admin_company_index');
    }

    #[Route('/admin/individuals', name: 'admin_individual_index')]
    #[IsGranted('ROLE_ADMIN')]
    public function listIndividuals(Request $request): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser -> getUserIdentifier();
        $individual = new Individual();
        $form = $this->createForm(IndividualType::class, $individual);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($individual);
            $this->em->flush();

            return $this->redirectToRoute('admin_individual_index');
        }

        return $this->render('admin/individual/index.html.twig', [
            'username' => $username,
            'individuals' => $this->em->getRepository(Individual::class)->findAll(),
            'form' => $form,
        ]);
    }

    #[Route('/admin/individuals/create', name: 'admin_individual_create')]
    #[IsGranted('ROLE_ADMIN')]
    public function createIndividual(Request $request): Response
    {
        $individual = new Individual();
        $form = $this->createForm(IndividualType::class, $individual);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($individual);
            $this->em->flush();

            return $this->redirectToRoute('admin_individual_index');
        }

        // If form is not valid or not submitted, we still redirect to index 
        // because creation is handled via modal on index page.
        // Errors would ideally be flashed or handled via AJAX, but for now strict redirect.
        return $this->redirectToRoute('admin_individual_index');
    }

    #[Route('/admin/individuals/{id}/edit', name: 'admin_individual_edit')]
    #[IsGranted('ROLE_ADMIN')]
    public function editIndividual(int $id, Request $request, \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface $passwordHasher): Response
    {
        $individual = $this->em->getRepository(Individual::class)->find($id);
        if (!$individual) {
            throw $this->createNotFoundException();
        }

        $form = $this->createForm(IndividualType::class, $individual);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->flush();
            $this->addFlash('success', 'Individual profile updated successfully.');
            return $this->redirectToRoute('admin_individual_edit', ['id' => $id]);
        }

        $passwordForm = $this->createForm(\App\Form\ChangePasswordType::class);
        $passwordForm->handleRequest($request);

        if ($passwordForm->isSubmitted() && $passwordForm->isValid()) {
            $plainPassword = $passwordForm->get('plainPassword')->getData();
            if ($plainPassword) {
                $hashedPassword = $passwordHasher->hashPassword($individual, $plainPassword);
                $individual->setPassword($hashedPassword);
                $this->em->flush();
                $this->addFlash('success', 'User password updated successfully.');
                return $this->redirectToRoute('admin_individual_edit', ['id' => $id]);
            }
        }

        return $this->render('admin/individual/edit.html.twig', [
            'form' => $form->createView(),
            'passwordForm' => $passwordForm->createView(),
            'individual' => $individual,
        ]);
    }

    #[Route('/admin/individuals/{id}/delete', name: 'admin_individual_delete', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteIndividual(int $id): Response
    {
        $individual = $this->em->getRepository(Individual::class)->find($id);
        if ($individual) {
            $this->em->remove($individual);
            $this->em->flush();
        }

        return $this->redirectToRoute('admin_individual_index');
    }

    #[Route('/admin/professionals', name: 'admin_professionnel_index')]
    #[IsGranted('ROLE_ADMIN')]
    public function listProfessionals(Request $request): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser -> getUserIdentifier();
        $professional = new Professional();
        $form = $this->createForm(ProfessionalType::class, $professional);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($professional);
            $this->em->flush();

            return $this->redirectToRoute('admin_professionnel_index');
        }

        return $this->render('admin/professional/index.html.twig', [
            'username' => $username,
            'professionals' => $this->em->getRepository(Professional::class)->findAll(),
            'form' => $form,
            'categories' => $this->em->getRepository(Category::class)->findAll(),
        ]);
    }

    #[Route('/admin/professionals/create', name: 'admin_professional_create')]
    #[IsGranted('ROLE_ADMIN')]
    public function createProfessional(Request $request): Response
    {
        $professional = new Professional();
        $form = $this->createForm(ProfessionalType::class, $professional);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($professional);
            $this->em->flush();

            return $this->redirectToRoute('admin_professionnel_index');
        }

        /**
         * Manual form flow - Email Only (Mirrors Company Creation)
         */
        if ($request->isMethod('POST') && $request->request->get('_source') === 'manual_professional') {
            $data = $request->request->all('professional');
            $email = $data['email'] ?? null;

            if ($email) {
                $password = bin2hex(random_bytes(12));
                
                $professional = new Professional();
                $professional->setEmail($email);
                $professional->setPassword($password);
                $professional->setCompanyName('New Professional'); // Placeholder to satisfy NOT NULL constraint
                // Set other required fields to defaults if necessary
                $professional->setExpYears(0);
                $professional->setCity('Unknown');
                // Category is ManyToOne non-nullable? Let's check Entity. 
                // Professional.php line 19: #[ORM\JoinColumn(nullable: false)]
                // We need a default category. I'll fetch the first one or handle this.
                $defaultCategory = $this->em->getRepository(Category::class)->findOneBy([]);
                if ($defaultCategory) {
                    $professional->setCategory($defaultCategory);
                }

                $this->em->persist($professional);
                $this->em->flush();

                $this->addFlash('success', 'Professional account created. Please complete the profile.');
                return $this->redirectToRoute('admin_professional_edit', ['id' => $professional->getId()]);
            }
        }

        return $this->render('admin/professional/create.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/admin/professional/{id}/category', name: 'admin_professional_update_category', methods: ['POST'])]
    public function updateProfessionalCategory(
        Request $request,
        Professional $professional,
        CategoryRepository $categoryRepo,
        EntityManagerInterface $em
    ): Response {
        $categoryId = $request->request->get('category');
        if ($categoryId) {
            $category = $categoryRepo->find($categoryId);
            if ($category) {
                $professional->setCategory($category);
                $em->flush();
                $this->addFlash('success', 'Category updated successfully.');
            }
        }

        return $this->redirectToRoute('admin_professional_edit', ['id' => $professional->getId()]);
    }

    #[Route('/admin/professionals/{id}/edit', name: 'admin_professional_edit')]
    #[IsGranted('ROLE_ADMIN')]
    public function editProfessional(int $id, Request $request, SluggerInterface $slugger, \App\Service\FileUploader $fileUploader): Response
    {
        $professional = $this->em->getRepository(Professional::class)->find($id);
        if (!$professional) {
            throw $this->createNotFoundException();
        }

        // 1. Basic Info Form
        $form = $this->createForm(ProfessionalType::class, $professional);

        // Pre-select parent category for dynamic UI
        if ($professional->getCategory() && $professional->getCategory()->getParent()) {
            $form->get('parentCategory')->setData($professional->getCategory()->getParent());
        }

        if ($request->isMethod('POST')) {
            $submittedData = $request->request->all($form->getName());
            if ($submittedData) {
                // Determine which modal was submitted to handle missing checkboxes/collections
                $modalId = $request->request->get('modal_id');
                if ($modalId === 'status') {
                    $submittedData['isVerified'] = isset($submittedData['isVerified']);
                    $submittedData['isTopRated'] = isset($submittedData['isTopRated']);
                    $submittedData['hasInsurance'] = isset($submittedData['hasInsurance']);
                } elseif ($modalId === 'prefs') {
                    // Force these to be present so they can be cleared if nothing is selected
                    $submittedData['languages'] = $submittedData['languages'] ?? [];
                    $submittedData['contactPrefs'] = $submittedData['contactPrefs'] ?? [];
                }

                $form->submit($submittedData, false);
            }
        } else {
            $form->handleRequest($request);
        }

        // 2. Primary Contact Logic
        $contact = $professional->getPrimaryContact();
        if (!$contact) {
            $contact = new PrimaryContact();
        }
        $contactForm = $this->createForm(PrimaryContactType::class, $contact);
        $contactForm->handleRequest($request);

        // 3. Address Logic
        $address = new Adress();
        $addressForm = $this->createForm(AdressType::class, $address);
        $addressForm->handleRequest($request);

        // 4. Project Logic
        $project = new Projet();
        $projectForm = $this->createForm(ProjetType::class, $project);
        $projectForm->handleRequest($request);

        // 5. Link Logic
        $link = new Link();
        $linkForm = $this->createForm(LinkType::class, $link);
        $linkForm->handleRequest($request);

        // 6. Payment Logic
        $paymentForm = $this->createForm(CompanyPaymentType::class, $professional);
        $paymentForm->handleRequest($request);

        // 7. Photo Logic
        $photoForm = $this->createForm(ProfessionalPhotoType::class, $professional);
        $photoForm->handleRequest($request);

        // 8. Banner Logic
        $bannerForm = $this->createForm(ProfessionalBannerType::class, $professional);
        $bannerForm->handleRequest($request);

        // --- Handle Submissions ---

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->flush();
            $this->addFlash('success', 'Professional updated successfully.');
            return $this->redirectToRoute('admin_professional_edit', ['id' => $professional->getId()]);
        }

        if ($contactForm->isSubmitted() && $contactForm->isValid()) {
            if (!$professional->getPrimaryContact()) {
                 $professional->setPrimaryContact($contact);
            }
            $this->em->persist($contact);
            $this->em->flush();
            $this->addFlash('success', 'Primary contact updated successfully.');
            return $this->redirectToRoute('admin_professional_edit', ['id' => $professional->getId()]);
        }

        if ($addressForm->isSubmitted() && $addressForm->isValid()) {
            $professional->addAdresse($address);
            $this->em->persist($address);
            $this->em->flush();
            $this->addFlash('success', 'Address added successfully.');
            return $this->redirectToRoute('admin_professional_edit', ['id' => $professional->getId()]);
        }

        if ($projectForm->isSubmitted() && $projectForm->isValid()) {
            $photoFile = $projectForm->get('mainPhoto')->getData();
            if ($photoFile) {
                try {
                    $newFilename = $fileUploader->upload($photoFile, 'projects');
                    $project->setMainPhoto($newFilename);
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Error uploading project photo');
                }
            }
            
            $galleryFiles = $projectForm->get('gallery')->getData();
            if ($galleryFiles) {
                $galleryPaths = [];
                foreach ($galleryFiles as $file) {
                    try {
                        $galleryPaths[] = $fileUploader->upload($file, 'projects');
                    } catch (\Exception $e) {
                        // Skip failed uploads or handle error
                    }
                }
                $project->setGallery($galleryPaths);
            }

            $professional->addProjet($project);
            $this->em->persist($project);
            $this->em->flush();
            $this->addFlash('success', 'Project added successfully.');
            return $this->redirectToRoute('admin_professional_edit', ['id' => $professional->getId()]);
        }

        if ($linkForm->isSubmitted() && $linkForm->isValid()) {
            $professional->addLink($link);
            $this->em->persist($link);
            $this->em->flush();
            $this->addFlash('success', 'Link added successfully.');
            return $this->redirectToRoute('admin_professional_edit', ['id' => $professional->getId()]);
        }

        if ($paymentForm->isSubmitted() && $paymentForm->isValid()) {
            $this->em->flush();
            $this->addFlash('success', 'Payment methods updated successfully.');
            return $this->redirectToRoute('admin_professional_edit', ['id' => $professional->getId()]);
        }

        if ($photoForm->isSubmitted() && $photoForm->isValid()) {
            $photoFile = $photoForm->get('logoFile')->getData();
            if ($photoFile) {
                try {
                    $newFilename = $fileUploader->upload($photoFile, 'logos'); // Assuming 'logos' or 'professionals' directory
                    // Check if setLogo exists or if it's handled differently. 
                    // Based on previous code, Professional usually has setLogo if it reuses some logic, 
                    // or we might need to verify the property. ProfessionalType had logoFile mapped false.
                    // Let's assume setLogo for now as per Context.
                    if (true) {
                        $professional->setLogo($newFilename);
                        $this->em->flush();
                        $this->addFlash('success', 'Photo updated successfully.');
                    }
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Error uploading photo');
                }
            }
            return $this->redirectToRoute('admin_professional_edit', ['id' => $professional->getId()]);
        }

        if ($bannerForm->isSubmitted() && $bannerForm->isValid()) {
            $bannerFile = $bannerForm->get('bannerFile')->getData();
            if ($bannerFile) {
                try {
                    $newFilename = $fileUploader->upload($bannerFile, 'banners');
                    $professional->setBanner($newFilename);
                    $this->em->flush();
                    $this->addFlash('success', 'Banner updated successfully.');
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Error uploading banner');
                }
            }
            return $this->redirectToRoute('admin_professional_edit', ['id' => $professional->getId()]);
        }

        return $this->render('admin/professional/edit.html.twig', [
            'form' => $form,
            'contactForm' => $contactForm,
            'addressForm' => $addressForm,
            'projectForm' => $projectForm,
            'linkForm' => $linkForm,
            'paymentForm' => $paymentForm,
            'photoForm' => $photoForm,
            'bannerForm' => $bannerForm,
            'professional' => $professional,
            'categories' => $this->em->getRepository(Category::class)->findAll(),
            'mainFormToken' => '<input type="hidden" name="' . $form->getName() . '[_token]" value="' . $this->container->get('security.csrf.token_manager')->getToken($form->getName())->getValue() . '">',
        ]);
    }

    #[Route('/admin/professionals/{id}/delete', name: 'admin_professionnel_delete', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteProfessionnel(int $id): Response
    {
        $professionnel = $this->em->getRepository(Professional::class)->find($id);
        if ($professionnel) {
            $this->em->remove($professionnel);
            $this->em->flush();
        }

        return $this->redirectToRoute('admin_professionnel_index');
    }

    #[Route('/admin/blogs', name: 'admin_blog_index')]
    #[IsGranted('ROLE_ADMIN')]
    public function listBlogs(Request $request): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser -> getUserIdentifier();
        $blog = new Blog();
        $form = $this->createForm(BlogType::class, $blog);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($blog);
            $this->em->flush();

            return $this->redirectToRoute('admin_blog_index');
        }

        return $this->render('admin/blog/index.html.twig', [
            'username' => $username,
            'blogs' => $this->em->getRepository(Blog::class)->findAll(),
            'form' => $form,
            'types' => $this->em->getRepository(Type::class)->findAll(),
            'categories' => $this->em->getRepository(Category::class)->findAll(),
        ]);
    }

    #[Route('/admin/blogs/create', name: 'admin_blog_create')]
    #[IsGranted('ROLE_ADMIN')]
    public function createBlog(Request $request): Response
    {
        $blog = new Blog();
        
        // Handle manual form flow - Title Only
        if ($request->isMethod('POST')) {
            $data = $request->request->all('blog');
            $title = $data['Title'] ?? null;

            if ($title) {
                $blog->setTitle($title);
                
                // Set default values for required fields
                $blog->setShortDesc('New Blog Post');
                $blog->setDescription('Content goes here...');
                $blog->setMainImg('placeholder.jpg'); // Ensure you have a placeholder or handle null if nullable

                // Set Default Type (First available or create logic if none)
                $defaultType = $this->em->getRepository(Type::class)->findOneBy([]);
                if ($defaultType) {
                    $blog->setType($defaultType);
                } else {
                     // Fallback if no types exist - might want to handle this gracefully
                     // For now, assuming types exist as per current logic
                }

                // Set Default Category (First available)
                $defaultCategory = $this->em->getRepository(Category::class)->findOneBy([]);
                if ($defaultCategory) {
                    $blog->setCategory($defaultCategory);
                }

                $this->em->persist($blog);
                $this->em->flush();

                $this->addFlash('success', 'Blog post created. You can now edit the details.');
                return $this->redirectToRoute('admin_blog_edit', ['id' => $blog->getId()]);
            }
        }

        $form = $this->createForm(BlogType::class, $blog);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
             // This path might be less used now if we only use the modal, 
             // but keeping standard form logic as fallback
            $this->em->persist($blog);
            $this->em->flush();

            return $this->redirectToRoute('admin_blog_index');
        }

        return $this->render('admin/blog/create.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/admin/blogs/{id}/edit', name: 'admin_blog_edit')]
    #[IsGranted('ROLE_ADMIN')]
    public function editBlog(int $id, Request $request): Response
    {
        $blog = $this->em->getRepository(Blog::class)->find($id);
        if (!$blog) {
            throw $this->createNotFoundException();
        }

        $form = $this->createForm(BlogType::class, $blog, ['csrf_protection' => false]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $mainImgFile = $form->get('mainImgFile')->getData();

            if ($mainImgFile) {
                $originalFilename = pathinfo($mainImgFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $blog->getTitle() ?: $originalFilename)));
                $newFilename = $safeFilename . '-' . uniqid() . '.' . $mainImgFile->guessExtension();

                try {
                    $mainImgFile->move(
                        $this->getParameter('kernel.project_dir') . '/public/uploads/blog',
                        $newFilename
                    );
                    $blog->setMainImg($newFilename);
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Could not upload image.');
                }
            }

            $this->em->flush();
            $this->addFlash('success', 'Blog updated successfully.');
            return $this->redirectToRoute('admin_blog_index');
        }

        return $this->render('admin/blog/edit.html.twig', [
            'form' => $form->createView(),
            'blog' => $blog,
        ]);
    }

    #[Route('/admin/blogs/{id}/delete', name: 'admin_blog_delete', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteBlog(int $id): Response
    {
        $blog = $this->em->getRepository(Blog::class)->find($id);
        if ($blog) {
            $this->em->remove($blog);
            $this->em->flush();
        }

        return $this->redirectToRoute('admin_blog_index');
    }

    #[Route('/admin/categories', name: 'admin_category_index')]
    #[IsGranted('ROLE_ADMIN')]
    public function listCategories(): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser -> getUserIdentifier();
        $category = new Category();
        $form = $this->createForm(CategoryType::class, $category);

        return $this->render('admin/category/index.html.twig', [
            'username' => $username,
            'categories' => $this->em->getRepository(Category::class)->findAll(),
            'form' => $form,
        ]);
    }

    #[Route('/admin/categories/create', name: 'admin_category_create')]
    #[IsGranted('ROLE_ADMIN')]
    public function createCategory(Request $request, \App\Service\FileUploader $fileUploader): Response
    {
        $category = new Category();
        $form = $this->createForm(CategoryType::class, $category);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $iconFile = $form->get('iconFile')->getData();
            if ($iconFile) {
                try {
                    $newFilename = $fileUploader->upload($iconFile, 'categories');
                    $category->setIcon($newFilename);
                } catch (\Exception $e) {
                    if ($request->isXmlHttpRequest()) {
                        return new JsonResponse(['success' => false, 'message' => 'Error uploading icon'], 400);
                    }
                    $this->addFlash('error', 'Error uploading icon');
                }
            }
            $this->em->persist($category);
            $this->em->flush();

            if ($request->isXmlHttpRequest()) {
                return new JsonResponse(['success' => true, 'message' => 'Category created successfully.']);
            }

            $this->addFlash('success', 'Category created successfully.');
            return $this->redirectToRoute('admin_category_index');
        }

        if ($form->isSubmitted() && !$form->isValid() && $request->isXmlHttpRequest()) {
            return new JsonResponse(['success' => false, 'message' => 'Validation error', 'errors' => (string) $form->getErrors(true, false)], 400);
        }

        return $this->render('admin/category/create.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/admin/categories/{id}/edit', name: 'admin_category_edit')]
    #[IsGranted('ROLE_ADMIN')]
    public function editCategory(int $id, Request $request, \App\Service\FileUploader $fileUploader): Response
    {
        $category = $this->em->getRepository(Category::class)->find($id);
        if (!$category) {
            throw $this->createNotFoundException();
        }

        $form = $this->createForm(CategoryType::class, $category);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $iconFile = $form->get('iconFile')->getData();
            if ($iconFile) {
                try {
                    $newFilename = $fileUploader->upload($iconFile, 'categories');
                    $category->setIcon($newFilename);
                } catch (\Exception $e) {
                    if ($request->isXmlHttpRequest()) {
                        return new JsonResponse(['success' => false, 'message' => 'Error uploading icon'], 400);
                    }
                    $this->addFlash('error', 'Error uploading icon');
                }
            }
            $this->em->flush();

            if ($request->isXmlHttpRequest()) {
                return new JsonResponse(['success' => true, 'message' => 'Category updated successfully.']);
            }

            $this->addFlash('success', 'Category updated successfully.');
            return $this->redirectToRoute('admin_category_index');
        }

        if ($form->isSubmitted() && !$form->isValid() && $request->isXmlHttpRequest()) {
            return new JsonResponse(['success' => false, 'message' => 'Validation error', 'errors' => (string) $form->getErrors(true, false)], 400);
        }

        return $this->render('admin/category/edit.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/admin/categories/{id}/delete', name: 'admin_category_delete', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteCategory(int $id): Response
    {
        $category = $this->em->getRepository(Category::class)->find($id);
        if ($category) {
            $this->em->remove($category);
            $this->em->flush();
        }

        return $this->redirectToRoute('admin_category_index');
    }

    #[Route('/admin/types', name: 'admin_type_index')]
    #[IsGranted('ROLE_ADMIN')]
    public function listTypes(Request $request): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser -> getUserIdentifier();
        $type = new Type();
        $form = $this->createForm(TypeType::class, $type);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($type);
            $this->em->flush();

            return $this->redirectToRoute('admin_type_index');
        }

        return $this->render('admin/type/index.html.twig', [
            'username' => $username,
            'types' => $this->em->getRepository(Type::class)->findAll(),
            'form' => $form,
        ]);
    }

    #[Route('/admin/types/create', name: 'admin_type_create')]
    #[IsGranted('ROLE_ADMIN')]
    public function createType(Request $request): Response
    {
        $type = new Type();
        $form = $this->createForm(TypeType::class, $type);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($type);
            $this->em->flush();

            return $this->redirectToRoute('admin_type_index');
        }

        return $this->render('admin/type/create.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/admin/types/{id}/edit', name: 'admin_type_edit')]
    #[IsGranted('ROLE_ADMIN')]
    public function editType(int $id, Request $request): Response
    {
        $type = $this->em->getRepository(Type::class)->find($id);
        if (!$type) {
            throw $this->createNotFoundException();
        }

        if ($request->isMethod('POST')) {
            $data = $request->request->all('type');
            $type->setType($data['Type'] ?? '');
            $this->em->flush();
            $this->addFlash('success', 'Type updated successfully.');
            return $this->redirectToRoute('admin_type_index');
        }

        $form = $this->createForm(TypeType::class, $type, ['csrf_protection' => false]);
        return $this->render('admin/type/edit.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/admin/types/{id}/delete', name: 'admin_type_delete', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteType(int $id): Response
    {
        $type = $this->em->getRepository(Type::class)->find($id);
        if ($type) {
            $this->em->remove($type);
            $this->em->flush();
        }

        return $this->redirectToRoute('admin_type_index');
    }

    #[Route('/admin/payments', name: 'admin_payment_index')]
    #[IsGranted('ROLE_ADMIN')]
    public function listPayments(Request $request): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser -> getUserIdentifier();
        $paymentMethod = new PaymentMethod();
        $form = $this->createForm(PaymentMethodType::class, $paymentMethod);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($paymentMethod);
            $this->em->flush();

            return $this->redirectToRoute('admin_payment_index');
        }

        return $this->render('admin/payment/index.html.twig', [
            'username' => $username,
            'payment_methods' => $this->em->getRepository(PaymentMethod::class)->findAll(),
            'form' => $form,
        ]);
    }

    #[Route('/admin/payments/create', name: 'admin_payment_create')]
    #[IsGranted('ROLE_ADMIN')]
    public function createPaymentMethod(Request $request): Response
    {
        $paymentMethod = new PaymentMethod();
        $form = $this->createForm(PaymentMethodType::class, $paymentMethod);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($paymentMethod);
            $this->em->flush();

            return $this->redirectToRoute('admin_payment_index');
        }

        return $this->render('admin/payment/create.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/admin/payments/{id}/edit', name: 'admin_payment_edit')]
    #[IsGranted('ROLE_ADMIN')]
    public function editPaymentMethod(int $id, Request $request): Response
    {
        $paymentMethod = $this->em->getRepository(PaymentMethod::class)->find($id);
        if (!$paymentMethod) {
            throw $this->createNotFoundException();
        }

        if ($request->isMethod('POST')) {
            $data = $request->request->all('payment_method');
            $paymentMethod->setName($data['name'] ?? '');
            $this->em->flush();
            $this->addFlash('success', 'Payment method updated successfully.');
            return $this->redirectToRoute('admin_payment_index');
        }

        $form = $this->createForm(PaymentMethodType::class, $paymentMethod, ['csrf_protection' => false]);
        return $this->render('admin/payment/edit.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/admin/payments/{id}/delete', name: 'admin_payment_delete', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deletePaymentMethod(int $id): Response
    {
        $paymentMethod = $this->em->getRepository(PaymentMethod::class)->find($id);
        if ($paymentMethod) {
            $this->em->remove($paymentMethod);
            $this->em->flush();
        }

        return $this->redirectToRoute('admin_payment_index');
    }

    #[Route('/admin/users', name: 'admin_user_index')]
    #[IsGranted('ROLE_ADMIN')]
    public function listUsers(Request $request): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser->getUserIdentifier();
        
        // Get all users (Individual, Professional, Company, Abstract User)
        // Using User::class with Joined Table Inheritance fetches all types
        $users = $this->em->getRepository(User::class)->findAll();

        return $this->render('admin/user/index.html.twig', [
            'username' => $username,
            'users' => $users,
        ]);
    }

    #[Route('/admin/users/{id}/delete', name: 'admin_user_delete', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteUser(int $id): Response
    {
        $user = $this->em->getRepository(User::class)->find($id);
        if ($user) {
            // Prevent deleting self
            if ($user === $this->getUser()) {
                $this->addFlash('error', 'You cannot delete your own account.');
                return $this->redirectToRoute('admin_user_index');
            }
            
            $this->em->remove($user);
            $this->em->flush();
            $this->addFlash('success', 'User deleted successfully.');
        }

        return $this->redirectToRoute('admin_user_index');
    }

    #[Route('/admin/users/{id}/change-password', name: 'admin_user_change_password', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function changeUserPassword(int $id, Request $request): Response
    {
        $user = $this->em->getRepository(User::class)->find($id);
        if (!$user) {
            throw $this->createNotFoundException('User not found');
        }

        $newPassword = $request->request->get('new_password');
        
        if (!empty($newPassword)) {
            // Hash the new password
            $hashedPassword = $this->passwordHasher->hashPassword(
                $user,
                $newPassword
            );
            $user->setPassword($hashedPassword);
            $this->em->flush();

            $this->addFlash('success', 'Password changed successfully for ' . $user->getEmail());
        } else {
            $this->addFlash('error', 'Password cannot be empty.');
        }

        // Redirect back to the page they came from
        return $this->redirect($request->headers->get('referer'));
    }

    #[Route('/admin/testimonials', name: 'admin_testimonial_index')]
    #[IsGranted('ROLE_ADMIN')]
    public function listTestimonials(): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser->getUserIdentifier();
        $testimonial = new Testimonial();
        $form = $this->createForm(TestimonialType::class, $testimonial);

        return $this->render('admin/testimonial/index.html.twig', [
            'username' => $username,
            'testimonials' => $this->em->getRepository(Testimonial::class)->findAll(),
            'form' => $form,
        ]);
    }

    #[Route('/admin/testimonials/create', name: 'admin_testimonial_create')]
    #[IsGranted('ROLE_ADMIN')]
    public function createTestimonial(Request $request, \App\Service\FileUploader $fileUploader): Response
    {
        $testimonial = new Testimonial();
        $form = $this->createForm(TestimonialType::class, $testimonial, ['csrf_protection' => false]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $imageFile = $form->get('imageFile')->getData();
            if ($imageFile) {
                try {
                    $newFilename = $fileUploader->upload($imageFile, 'testimonials'); 
                    $testimonial->setImage($newFilename);
                } catch (FileException $e) {
                    $this->addFlash('error', 'Error uploading image');
                }
            }
            $this->em->persist($testimonial);
            $this->em->flush();
            $this->addFlash('success', 'Testimonial created successfully.');

            return $this->redirectToRoute('admin_testimonial_index');
        }

        return $this->render('admin/testimonial/create.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/admin/testimonials/{id}/edit', name: 'admin_testimonial_edit')]
    #[IsGranted('ROLE_ADMIN')]
    public function editTestimonial(int $id, Request $request, \App\Service\FileUploader $fileUploader): Response
    {
        $testimonial = $this->em->getRepository(Testimonial::class)->find($id);
        if (!$testimonial) {
            throw $this->createNotFoundException();
        }

        $form = $this->createForm(TestimonialType::class, $testimonial);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $imageFile = $form->get('imageFile')->getData();
            if ($imageFile) {
                try {
                    $newFilename = $fileUploader->upload($imageFile, 'testimonials'); 
                    $testimonial->setImage($newFilename);
                } catch (FileException $e) {
                    $this->addFlash('error', 'Error uploading image');
                }
            }
            $this->em->flush();
            $this->addFlash('success', 'Testimonial updated successfully.');
            return $this->redirectToRoute('admin_testimonial_index');
        }

        return $this->render('admin/testimonial/edit.html.twig', [
            'form' => $form,
            'testimonial' => $testimonial,
        ]);
    }

    #[Route('/admin/testimonials/{id}/delete', name: 'admin_testimonial_delete', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteTestimonial(int $id): Response
    {
        $testimonial = $this->em->getRepository(Testimonial::class)->find($id);
        if ($testimonial) {
            $this->em->remove($testimonial);
            $this->em->flush();
            $this->addFlash('success', 'Testimonial deleted successfully.');
        }

        return $this->redirectToRoute('admin_testimonial_index');
    }

    #[Route('/admin/testimonials/{id}/toggle-active', name: 'admin_testimonial_toggle_active', methods: ['POST', 'GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function toggleTestimonialActive(int $id, Request $request): Response
    {
        $testimonial = $this->em->getRepository(Testimonial::class)->find($id);
        if ($testimonial) {
            $testimonial->setIsActive(!$testimonial->isIsActive());
            $this->em->flush();
            $this->addFlash('success', 'Testimonial status updated.');
        }

        return $this->redirect($request->headers->get('referer', $this->generateUrl('admin_testimonial_index')));
    }

    #[Route('/admin/requests', name: 'admin_request_index')]
    #[IsGranted('ROLE_ADMIN')]
    public function listRequests(): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser->getUserIdentifier();

        $quoteRequests = $this->em->getRepository(QuoteRequest::class)->findBy([], ['creationDate' => 'DESC']);
        $directRequests = $this->em->getRepository(DirectRequest::class)->findBy([], ['creationDate' => 'DESC']);

        return $this->render('admin/request/index.html.twig', [
            'username' => $username,
            'quoteRequests' => $quoteRequests,
            'directRequests' => $directRequests,
        ]);
    }

    #[Route('/admin/requests/quote/{id}', name: 'admin_quote_request_show')]
    #[IsGranted('ROLE_ADMIN')]
    public function showQuoteRequest(QuoteRequest $request): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser->getUserIdentifier();

        return $this->render('admin/request/show.html.twig', [
            'username' => $username,
            'request' => $request,
            'type' => 'quote',
        ]);
    }

    #[Route('/admin/requests/direct/{id}', name: 'admin_direct_request_show')]
    #[IsGranted('ROLE_ADMIN')]
    public function showDirectRequest(DirectRequest $request): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser->getUserIdentifier();

        return $this->render('admin/request/show.html.twig', [
            'username' => $username,
            'request' => $request,
            'type' => 'direct',
        ]);
    }

    #[Route('/admin/projects/{id}/edit', name: 'admin_project_edit', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function editProject(int $id, Request $request): Response
    {
        $project = $this->em->getRepository(Projet::class)->find($id);
        if (!$project) {
            throw $this->createNotFoundException();
        }

        $form = $this->createForm(ProjetType::class, $project);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->flush();
            $this->addFlash('success', 'Project updated successfully.');
        }

        return $this->redirect($request->headers->get('referer', $this->generateUrl('admin_dashboard')));
    }

    #[Route('/admin/projects/{id}/delete', name: 'admin_project_delete', methods: ['POST', 'GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteProject(int $id, Request $request): Response
    {
        $project = $this->em->getRepository(Projet::class)->find($id);
        if ($project) {
            $this->em->remove($project);
            $this->em->flush();
            $this->addFlash('success', 'Project deleted successfully.');
        }

        return $this->redirect($request->headers->get('referer', $this->generateUrl('admin_dashboard')));
    }

    #[Route('/admin/address/{id}/delete', name: 'admin_address_delete', methods: ['POST', 'GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteAddress(int $id, Request $request): Response
    {
        $address = $this->em->getRepository(Adress::class)->find($id);
        if ($address) {
            $this->em->remove($address);
            $this->em->flush();
            $this->addFlash('success', 'Address deleted successfully.');
        }

        return $this->redirect($request->headers->get('referer', $this->generateUrl('admin_dashboard')));
    }

    #[Route('/admin/links/{id}/delete', name: 'admin_link_delete', methods: ['POST', 'GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteLink(int $id, Request $request): Response
    {
        $link = $this->em->getRepository(Link::class)->find($id);
        if ($link) {
            $this->em->remove($link);
            $this->em->flush();
            $this->addFlash('success', 'Link deleted successfully.');
        }

        return $this->redirect($request->headers->get('referer', $this->generateUrl('admin_dashboard')));
    }

    #[Route('/admin/professional/project/update/{id}', name: 'admin_project_update', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function updateProject(int $id, Request $request, \App\Service\FileUploader $fileUploader): Response
    {
        $project = $this->em->getRepository(Projet::class)->find($id);
        if (!$project) {
            throw $this->createNotFoundException();
        }

        $form = $this->createForm(ProjetType::class, $project);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $photoFile = $form->get('mainPhoto')->getData();
            if ($photoFile) {
                try {
                    $newFilename = $fileUploader->upload($photoFile, 'projects');
                    $project->setMainPhoto($newFilename);
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Error uploading project photo');
                }
            }

            $galleryFiles = $form->get('gallery')->getData();
            if ($galleryFiles) {
                $currentGallery = $project->getGallery() ?? [];
                foreach ($galleryFiles as $file) {
                    try {
                        $currentGallery[] = $fileUploader->upload($file, 'projects');
                    } catch (\Exception $e) {
                        // Skip failed
                    }
                }
                $project->setGallery($currentGallery);
            }

            // Handle state if missing from POST (unchecked)
            if ($request->isMethod('POST')) {
                $submittedData = $request->request->all($form->getName());
                if (!isset($submittedData['state'])) {
                    $project->setState(false);
                } else {
                    $project->setState(true);
                }
            }

            $this->em->flush();
            $this->addFlash('success', 'Projet mis à jour avec succès.');
        } else {
            $this->addFlash('error', 'Erreur lors de la mise à jour du projet.');
        }

        return $this->redirect($request->headers->get('referer', $this->generateUrl('admin_dashboard')));
    }

    #[Route('/admin/projects/{id}/delete-image', name: 'admin_project_delete_image', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteProjectImage(int $id, Request $request): Response
    {
        $project = $this->em->getRepository(Projet::class)->find($id);
        if (!$project) {
            if ($request->isXmlHttpRequest()) {
                return $this->json(['success' => false, 'message' => 'Projet non trouvé'], 404);
            }
            throw $this->createNotFoundException();
        }

        $image = $request->query->get('image');
        $type = $request->query->get('type');

        if ($type === 'main') {
            $project->setMainPhoto(null);
        } elseif ($type === 'gallery') {
            $gallery = $project->getGallery();
            if (($key = array_search($image, $gallery)) !== false) {
                unset($gallery[$key]);
                $project->setGallery(array_values($gallery));
            }
        }

        $this->em->flush();

        if ($request->isXmlHttpRequest() || $request->query->get('ajax')) {
            return $this->json(['success' => true, 'message' => 'Image supprimée avec succès.']);
        }

        $this->addFlash('success', 'Image supprimée avec succès.');
        return $this->redirect($request->headers->get('referer', $this->generateUrl('admin_dashboard')));
    }

    #[Route('/admin/professional/{id}/review/add', name: 'admin_professional_review_add', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function addReview(int $id, Request $request): Response
    {
        $professional = $this->em->getRepository(Professional::class)->find($id);
        if (!$professional) {
            throw $this->createNotFoundException();
        }

        $review = new \App\Entity\Review();
        $review->setBusiness($professional);
        $review->setReviewerName($request->request->get('reviewerName'));
        $review->setRating((int)$request->request->get('rating'));
        $review->setComment($request->request->get('comment'));
        $review->setServiceTitle($request->request->get('serviceTitle'));

        $this->em->persist($review);
        $this->em->flush();

        $this->addFlash('success', 'Avis ajouté avec succès.');
        return $this->redirectToRoute('admin_professional_edit', ['id' => $id]);
    }

    #[Route('/admin/review/{id}/delete', name: 'admin_review_delete')]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteReview(int $id, Request $request): Response
    {
        $review = $this->em->getRepository(\App\Entity\Review::class)->find($id);
        if (!$review) {
            throw $this->createNotFoundException();
        }

        $profId = $review->getBusiness()->getId();
        $this->em->remove($review);
        $this->em->flush();

        $this->addFlash('success', 'Avis supprimé avec succès.');
        return $this->redirectToRoute('admin_professional_edit', ['id' => $profId]);
    }

    #[Route('/admin/professional/link/update/{id}', name: 'admin_link_update', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function updateLink(int $id, Request $request): Response
    {
        $link = $this->em->getRepository(Link::class)->find($id);
        if (!$link) {
            throw $this->createNotFoundException();
        }

        $form = $this->createForm(LinkType::class, $link);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->flush();
            $this->addFlash('success', 'Lien mis à jour avec succès.');
        } else {
            $this->addFlash('error', 'Erreur lors de la mise à jour du lien.');
        }

        return $this->redirect($request->headers->get('referer', $this->generateUrl('admin_dashboard')));
    }
}
