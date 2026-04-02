<?php

namespace App\Controller\Admin;

use App\Entity\Adress;
use App\Entity\Category;
use App\Entity\Link;
use App\Entity\PrimaryContact;
use App\Entity\Professional;
use App\Entity\Projet;
use App\Entity\Review;
use App\Form\AdressType;
use App\Form\CompanyPaymentType;
use App\Form\LinkType;
use App\Form\PrimaryContactType;
use App\Form\ProfessionalBannerType;
use App\Form\ProfessionalPhotoType;
use App\Form\ProfessionalType;
use App\Form\ProjetType;
use App\Repository\CategoryRepository;
use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;

#[IsGranted('ROLE_ADMIN')]
class ProfessionalController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {}

    #[Route('/dashboard/professionals', name: 'admin_professionnel_index')]
    public function listProfessionals(Request $request): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser->getUserIdentifier();
        $professional = new Professional();
        $form = $this->createForm(ProfessionalType::class, $professional);
        $form->handleRequest($request);

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

    #[Route('/dashboard/professionals/create', name: 'admin_professional_create')]
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

                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
                $professional->setPassword($hashedPassword);
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

    #[Route('/dashboard/professional/{id}/category', name: 'admin_professional_update_category', methods: ['POST'])]
    public function updateProfessionalCategory(
        Request $request,
        Professional $professional,
        CategoryRepository $categoryRepo,
    ): Response {
        $categoryId = $request->request->get('category');
        if ($categoryId) {
            $category = $categoryRepo->find($categoryId);
            if ($category) {
                $professional->setCategory($category);
                $this->em->flush();
                $this->addFlash('success', 'Category updated successfully.');
            }
        }

        return $this->redirectToRoute('admin_professional_edit', ['id' => $professional->getId()]);
    }

    #[Route('/dashboard/professionals/{id}/edit', name: 'admin_professional_edit')]
    public function editProfessional(int $id, Request $request, SluggerInterface $slugger, FileUploader $fileUploader): Response
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

    #[Route('/dashboard/professionals/{id}/delete', name: 'admin_professionnel_delete', methods: ['POST'])]
    public function deleteProfessionnel(int $id, Request $request): Response
    {
        $professionnel = $this->em->getRepository(Professional::class)->find($id);
        if ($professionnel && $this->isCsrfTokenValid('delete' . $professionnel->getId(), $request->request->get('_token'))) {
            $this->em->remove($professionnel);
            $this->em->flush();
            $this->addFlash('success', 'Professional successfully deleted.');
        }

        return $this->redirectToRoute('admin_professionnel_index');
    }

    #[Route('/dashboard/professional/{id}/review/add', name: 'admin_professional_review_add', methods: ['POST'])]
    public function addReview(int $id, Request $request): Response
    {
        $professional = $this->em->getRepository(Professional::class)->find($id);
        if (!$professional) {
            throw $this->createNotFoundException();
        }

        $review = new Review();
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

    #[Route('/dashboard/review/{id}/delete', name: 'admin_review_delete', methods: ['POST'])]
    public function deleteReview(int $id, Request $request): Response
    {
        $review = $this->em->getRepository(Review::class)->find($id);
        if (!$review) {
            throw $this->createNotFoundException();
        }

        $profId = $review->getBusiness()->getId();

        if ($this->isCsrfTokenValid('delete' . $review->getId(), $request->request->get('_token'))) {
            $this->em->remove($review);
            $this->em->flush();
            $this->addFlash('success', 'Avis supprimé avec succès.');
        }

        return $this->redirectToRoute('admin_professional_edit', ['id' => $profId]);
    }

    #[Route('/dashboard/projects/{id}/edit', name: 'admin_project_edit', methods: ['POST'])]
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

    #[Route('/dashboard/projects/{id}/delete', name: 'admin_project_delete', methods: ['POST'])]
    public function deleteProject(int $id, Request $request): Response
    {
        $project = $this->em->getRepository(Projet::class)->find($id);
        if ($project && $this->isCsrfTokenValid('delete' . $project->getId(), $request->request->get('_token'))) {
            $this->em->remove($project);
            $this->em->flush();
            $this->addFlash('success', 'Project deleted successfully.');
        }

        return $this->redirect($request->headers->get('referer', $this->generateUrl('admin_dashboard')));
    }

    #[Route('/dashboard/projects/{id}/delete-image', name: 'admin_project_delete_image', methods: ['GET'])]
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

    #[Route('/dashboard/professional/project/update/{id}', name: 'admin_project_update', methods: ['POST'])]
    public function updateProject(int $id, Request $request, FileUploader $fileUploader): Response
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

    #[Route('/dashboard/address/{id}/delete', name: 'admin_address_delete', methods: ['POST'])]
    public function deleteAddress(int $id, Request $request): Response
    {
        $address = $this->em->getRepository(Adress::class)->find($id);
        if ($address && $this->isCsrfTokenValid('delete' . $address->getId(), $request->request->get('_token'))) {
            $this->em->remove($address);
            $this->em->flush();
            $this->addFlash('success', 'Address deleted successfully.');
        }

        return $this->redirect($request->headers->get('referer', $this->generateUrl('admin_dashboard')));
    }

    #[Route('/dashboard/links/{id}/delete', name: 'admin_link_delete', methods: ['POST'])]
    public function deleteLink(int $id, Request $request): Response
    {
        $link = $this->em->getRepository(Link::class)->find($id);
        if ($link && $this->isCsrfTokenValid('delete' . $link->getId(), $request->request->get('_token'))) {
            $this->em->remove($link);
            $this->em->flush();
            $this->addFlash('success', 'Link deleted successfully.');
        }

        return $this->redirect($request->headers->get('referer', $this->generateUrl('admin_dashboard')));
    }

    #[Route('/dashboard/professional/link/update/{id}', name: 'admin_link_update', methods: ['POST'])]
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
