<?php

namespace App\Controller\Admin;

use App\Entity\Adress;
use App\Entity\Category;
use App\Entity\Company;
use App\Entity\Link;
use App\Entity\PrimaryContact;
use App\Entity\Projet;
use App\Form\AdressType;
use App\Form\CompanyBasicType;
use App\Form\CompanyBannerType;
use App\Form\CompanyCategoryType;
use App\Form\CompanyLegalType;
use App\Form\CompanyLogoType;
use App\Form\CompanyPaymentType;
use App\Form\CompanyType;
use App\Form\LinkType;
use App\Form\PrimaryContactType;
use App\Form\ProjetType;
use App\Repository\CategoryRepository;
use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
class CompanyController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher,
    ) {}

    #[Route('/dashboard/companies', name: 'admin_company_index')]
    public function listCompanies(Request $request): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser->getUserIdentifier();
        $company = new Company();
        $form = $this->createForm(CompanyType::class, $company);
        $form->handleRequest($request);

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

    #[Route('/dashboard/companies/create', name: 'admin_company_create')]
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

            $hashedPassword = $this->passwordHasher->hashPassword($company, $password);
            $company->setPassword($hashedPassword);

            // IMPORTANT: validate manually or reuse validator
            $this->em->persist($company);
            $this->em->flush();

            return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
        }


        return $this->render('admin/company/create.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/dashboard/company/{id}/categories', name: 'admin_company_update_categories', methods: ['POST'])]
    public function updateCategories(
        Request $request,
        Company $company,
        CategoryRepository $categoryRepo,
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

        $this->em->flush();

        return $this->redirectToRoute('admin_company_edit', ['id' => $company->getId()]);
    }

    #[Route('/dashboard/companies/{id}/edit', name: 'admin_company_edit')]
    public function editCompany(int $id, Request $request, FileUploader $fileUploader): Response
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

    #[Route('/dashboard/companies/{id}/delete', name: 'admin_company_delete', methods: ['POST'])]
    public function deleteCompany(int $id, Request $request): Response
    {
        $company = $this->em->getRepository(Company::class)->find($id);
        if ($company && $this->isCsrfTokenValid('delete' . $company->getId(), $request->request->get('_token'))) {
            $this->em->remove($company);
            $this->em->flush();
            $this->addFlash('success', 'Company successfully deleted.');
        }

        return $this->redirectToRoute('admin_company_index');
    }
}
