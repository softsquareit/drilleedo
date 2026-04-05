<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Form\ProfessionalType;
use App\Form\ProfessionalProfileType;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Form\ChangePasswordType;

#[Route('/professional-compte')]
#[IsGranted('ROLE_PROFESSIONAL')]
class ProfessionalController extends AbstractController
{
    #[Route('/', name: 'professional_dashboard')]
    public function index(EntityManagerInterface $em): Response
    {
        /** @var \App\Entity\Business $user */
        $user = $this->getUser();
        $projectCount = 0;
        
        // Project Count Logic
        if (method_exists($user, 'getProjets')) {
             $projectCount = $user->getProjets()->count();
        }
        
        // Quotes Count (matching category) — only Active/Pending
        $quoteCount = 0;
        $availableQuotes = [];
        if ($user instanceof \App\Entity\Professional && $user->getCategory()) {
            $allQuotes = $em->getRepository(\App\Entity\QuoteRequest::class)->findBy(['category' => $user->getCategory()]);
            $availableQuotes = array_filter($allQuotes, fn($q) => in_array($q->getStatus(), [\App\Entity\QuoteRequest::STATUS_PUBLISHED]));
            $quoteCount = count($availableQuotes);
        }

        // Offers (sent by provider) — all and recent
        $allOffers = $em->getRepository(\App\Entity\Offer::class)->findBy(
            ['provider' => $user],
            ['createdAt' => 'DESC']
        );
        $offerCount = count($allOffers);
        $acceptedCount = count(array_filter($allOffers, fn($o) => $o->getStatus() === \App\Entity\Offer::STATUS_ACCEPTED));
        $draftCount = count(array_filter($allOffers, fn($o) => $o->getStatus() === \App\Entity\Offer::STATUS_DRAFT));
        $recentOffers = array_slice($allOffers, 0, 5);

        // Conversion Rate (accepted ÷ total published/accepted offers × 100)
        $publishedOrAccepted = array_filter($allOffers, fn($o) => in_array($o->getStatus(), [
            \App\Entity\Offer::STATUS_PUBLISHED,
            \App\Entity\Offer::STATUS_ACCEPTED,
        ]));
        $conversionRate = count($publishedOrAccepted) > 0
            ? round(($acceptedCount / count($publishedOrAccepted)) * 100)
            : 0;

        // Profile Completion Score (0–100)
        $completionFields = [
            'getCompanyName'    => (bool) $user->getCompanyName(),
            'getLogo'           => (bool) $user->getLogo(),
            'getBanner'         => (bool) $user->getBanner(),
            'getAbout'          => (bool) $user->getAbout(),
            'getCategory'       => $user instanceof \App\Entity\Professional && (bool) $user->getCategory(),
            'getPrimaryContact' => (bool) $user->getPrimaryContact(),
        ];
        $filled = count(array_filter($completionFields));
        $profileCompletion = (int) round(($filled / count($completionFields)) * 100);

        // Pending Direct Requests (not yet responded to)
        $pendingDirectRequestsCount = $em->getRepository(\App\Entity\DirectRequest::class)->count([
            'targetProfessional' => $user,
        ]);

        // Notifications — recent, ordered newest first
        $notifications = $em->getRepository(\App\Entity\Notification::class)->findBy(
            ['user' => $user],
            ['createdAt' => 'DESC'],
            10
        );
        $unreadCount = count(array_filter($notifications, fn($n) => !$n->isRead()));

        return $this->render('professional/index.html.twig', [
            'draftCount'                 => $draftCount,
            'projectCount'               => $projectCount,
            'quoteCount'                 => $quoteCount,
            'offerCount'                 => $offerCount,
            'acceptedCount'              => $acceptedCount,
            'conversionRate'             => $conversionRate,
            'profileCompletion'          => $profileCompletion,
            'pendingDirectRequestsCount' => $pendingDirectRequestsCount,
            'recentOffers'               => $recentOffers,
            'notifications'              => $notifications,
            'unreadCount'                => $unreadCount,
            'stats'                      => $user instanceof \App\Entity\Professional ? $user->getStats() : null,
            'userCategory'               => $user instanceof \App\Entity\Professional ? $user->getCategory() : null,
        ]);
    }

    #[Route('/notifications', name: 'professional_notifications')]
    public function notifications(EntityManagerInterface $em): Response
    {
        /** @var \App\Entity\Business $user */
        $user = $this->getUser();
        
        $notifications = $em->getRepository(\App\Entity\Notification::class)->findBy(
            ['user' => $user],
            ['createdAt' => 'DESC']
        );

        return $this->render('professional/notifications.html.twig', [
            'notifications' => $notifications,
        ]);
    }

    #[Route('/update-availability', name: 'professional_update_availability', methods: ['POST'])]
    public function updateAvailability(Request $request, EntityManagerInterface $em): Response
    {
        /** @var \App\Entity\Professional $user */
        $user = $this->getUser();
        $status = $request->request->get('status');

        if (in_array($status, [\App\Entity\Professional::AVAILABILITY_AVAILABLE, \App\Entity\Professional::AVAILABILITY_BUSY, \App\Entity\Professional::AVAILABILITY_UNAVAILABLE])) {
            $user->setAvailabilityStatus($status);
            $em->flush();
            $this->addFlash('success', 'Availability status updated to ' . strtolower($status) . '.');
        }

        return $this->redirectToRoute('professional_dashboard');
    }

    #[Route('/quotes', name: 'professional_quotes')]
    public function quotes(EntityManagerInterface $em): Response
    {
        /** @var \App\Entity\Professional $user */
        $user = $this->getUser();
        
        $quotes = [];
        $myOfferQuoteIds = [];
        if ($user->getCategory()) {
            $allQuotes = $em->getRepository(\App\Entity\QuoteRequest::class)->findByCategory($user->getCategory());
            //$allQuotes = $em->getRepository(\App\Entity\QuoteRequest::class)->findAll();
            // Filter: only show Published or Accepted requests
            $quotes = array_filter($allQuotes, fn($q) => in_array($q->getStatus(), [
                \App\Entity\QuoteRequest::STATUS_PUBLISHED, 
                \App\Entity\QuoteRequest::STATUS_ACCEPTED,
                \App\Entity\QuoteRequest::STATUS_CLOSED
            ]));
            $quotes = array_values($quotes);
            // Find which quotes this provider already sent an offer to
            $myOffers = $em->getRepository(\App\Entity\Offer::class)->findBy(['provider' => $user]);
            foreach ($myOffers as $offer) {
                if ($offer->getQuoteRequest()) {
                    $myOfferQuoteIds[$offer->getQuoteRequest()->getId()] = $offer->getStatus();
                }
            }
        }

        return $this->render('professional/quotes.html.twig', [
            'quotes' => $quotes,
            'myOfferQuoteIds' => $myOfferQuoteIds,
        ]);
    }

    #[Route('/direct-requests', name: 'professional_direct_requests')]
    public function directRequests(EntityManagerInterface $em): Response
    {
        /** @var \App\Entity\Professional $user */
        $user = $this->getUser();
        
        $directRequests = $em->getRepository(\App\Entity\DirectRequest::class)->findBy(['targetProfessional' => $user], ['creationDate' => 'DESC']);

        return $this->render('professional/direct_requests.html.twig', [
            'directRequests' => $directRequests,
        ]);
    }

    #[Route('/offers', name: 'professional_offers')]
    public function offers(EntityManagerInterface $em): Response
    {
        $offers = $em->getRepository(\App\Entity\Offer::class)->findBy(['provider' => $this->getUser()], ['createdAt' => 'DESC']);

        $editForms = [];
        foreach ($offers as $offer) {
            if ($offer->getStatus() === \App\Entity\Offer::STATUS_DRAFT) {
                if ($offer->getQuoteRequest()) {
                    $editForms[$offer->getId()] = $this->createForm(\App\Form\OfferType::class, $offer, [
                        'action' => $this->generateUrl('offer_send', ['id' => $offer->getQuoteRequest()->getId()]),
                    ])->createView();
                } elseif ($offer->getDirectRequest()) {
                    $editForms[$offer->getId()] = $this->createForm(\App\Form\OfferType::class, $offer, [
                        'action' => $this->generateUrl('offer_send_direct', ['id' => $offer->getDirectRequest()->getId()]),
                    ])->createView();
                }
            }
        }

        return $this->render('professional/offers.html.twig', [
            'offers' => $offers,
            'editForms' => $editForms,
        ]);
    }

    #[Route('/profile', name: 'professional_profile')]
    public function profile(Request $request, \App\Service\FileUploader $fileUploader, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        $form = $this->createForm(ProfessionalProfileType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Check if logoFile field exists in ProfessionalType, if not we might need to assume or check
            // Usually ProfessionalType might not have logoFile if it's auto-generated from Entity
            // I'll check if the form has it. If not, I won't handle it here to avoid errors.
            // But let's assume we want to support it similar to Company if the Type allows.
            
            if ($form->has('logoFile')) {
                 $logoFile = $form->get('logoFile')->getData();

                if ($logoFile) {
                    try {
                        $newFilename = $fileUploader->upload($logoFile, 'logos');
                        if (method_exists($user, 'setLogo')) {
                            $user->setLogo($newFilename);
                        }
                    } catch (\Exception $e) {
                        $this->addFlash('error', 'Error uploading image');
                    }
                }
            }
            
            if ($form->has('bannerFile')) {
                 $bannerFile = $form->get('bannerFile')->getData();

                if ($bannerFile) {
                    try {
                        $newFilename = $fileUploader->upload($bannerFile, 'banners');
                        if (method_exists($user, 'setBanner')) {
                            $user->setBanner($newFilename);
                        }
                    } catch (\Exception $e) {
                        $this->addFlash('error', 'Error uploading banner');
                    }
                }
            }

            $em->persist($user);
            $em->flush();
            $this->addFlash('success', 'Profile updated successfully.');

            return $this->redirectToRoute('professional_profile');
        } elseif ($form->isSubmitted()) {
            foreach ($form->getErrors(true) as $error) {
                $this->addFlash('error', $error->getMessage());
            }
        }

        return $this->render('professional/profile.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/projects', name: 'professional_projects')]
    public function projects(Request $request, EntityManagerInterface $em, \App\Service\FileUploader $fileUploader): Response
    {
        // Project Creation Form (for Modal)
        $project = new \App\Entity\Projet();
        $form = $this->createForm(\App\Form\ProjetType::class, $project);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $project->setBusiness($this->getUser());

            // Handle Main Photo
            $mainPhoto = $form->get('mainPhoto')->getData();
            if ($mainPhoto) {
                $filename = $fileUploader->upload($mainPhoto, 'projects');
                $project->setMainPhoto($filename);
            }

            // Handle Gallery
            $galleryFiles = $form->get('gallery')->getData();
            $galleryPaths = [];
            if ($galleryFiles) {
                foreach ($galleryFiles as $file) {
                    $galleryPaths[] = $fileUploader->upload($file, 'projects');
                }
                $project->setGallery($galleryPaths);
            }

            $em->persist($project);
            $em->flush();
            $this->addFlash('success', 'Project created successfully.');
            return $this->redirectToRoute('professional_projects');
        }

        $projects = $this->getUser()->getProjets();
        $editForms = [];
        foreach ($projects as $proj) {
            $editForms[$proj->getId()] = $this->createForm(\App\Form\ProjetType::class, $proj, [
                'action' => $this->generateUrl('professional_project_edit', ['id' => $proj->getId()]),
            ])->createView();
        }

        return $this->render('professional/projects/index.html.twig', [
            'projects' => $projects,
            'projectForm' => $form->createView(),
            'editForms' => $editForms,
        ]);
    }

    #[Route('/projects/{id}/edit', name: 'professional_project_edit')]
    public function editProject(int $id, Request $request, EntityManagerInterface $em, \App\Service\FileUploader $fileUploader): Response
    {
        $project = $em->getRepository(\App\Entity\Projet::class)->find($id);
        
        if (!$project || $project->getBusiness()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createNotFoundException('Project not found');
        }

        $form = $this->createForm(\App\Form\ProjetType::class, $project);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Handle Main Photo
            $mainPhoto = $form->get('mainPhoto')->getData();
            if ($mainPhoto) {
                $filename = $fileUploader->upload($mainPhoto, 'projects');
                $project->setMainPhoto($filename);
            }

            // Handle Gallery
            $galleryFiles = $form->get('gallery')->getData();
            if ($galleryFiles) {
                $currentGallery = $project->getGallery() ?? [];
                foreach ($galleryFiles as $file) {
                    $currentGallery[] = $fileUploader->upload($file, 'projects');
                }
                $project->setGallery($currentGallery);
            }

            $em->flush();
            $this->addFlash('success', 'Project updated successfully.');
            return $this->redirectToRoute('professional_projects');
        } elseif ($form->isSubmitted()) {
            foreach ($form->getErrors(true) as $error) {
                $this->addFlash('error', $error->getMessage());
            }
            return $this->redirectToRoute('professional_projects');
        }

        return $this->render('professional/projects/form.html.twig', [
            'form' => $form->createView(),
            'title' => 'Edit Project'
        ]);
    }

    #[Route('/projects/{id}/delete', name: 'professional_project_delete', methods: ['POST'])]
    public function deleteProject(int $id, Request $request, EntityManagerInterface $em): Response
    {
        $project = $em->getRepository(\App\Entity\Projet::class)->find($id);
        
        if ($project && $project->getBusiness()?->getId() === $this->getUser()?->getId()) {
            if ($this->isCsrfTokenValid('delete' . $project->getId(), $request->request->get('_token'))) {
                $em->remove($project);
                $em->flush();
                $this->addFlash('success', 'Project deleted successfully.');
            } else {
                $this->addFlash('error', 'Invalid security token. Please try again.');
            }
        }

        return $this->redirectToRoute('professional_projects');
    }

    #[Route('/settings', name: 'professional_settings')]
    public function settings(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $userPasswordHasher): Response
    {
        $user = $this->getUser();
        
        // Forms setup
        $address = new \App\Entity\Adress();
        $addressForm = $this->createForm(\App\Form\AdressType::class, $address);
        
        $contact = $user->getPrimaryContact() ?? new \App\Entity\PrimaryContact();
        $contactForm = $this->createForm(\App\Form\PrimaryContactType::class, $contact);

        $passwordForm = $this->createForm(ChangePasswordType::class);
        
        // Prepare Social Links Data
        $socialData = [];
        foreach ($user->getLinks() as $linkEntity) {
            if ($linkEntity->getType()) {
                $socialData[$linkEntity->getType()] = $linkEntity->getLink();
            }
        }
        
        $socialLinksForm = $this->createForm(\App\Form\SocialLinksType::class, $socialData);
        $categoryForm = $this->createForm(\App\Form\ProfessionalCategoryType::class, $user);

        $addressForm->handleRequest($request);
        $contactForm->handleRequest($request);
        $socialLinksForm->handleRequest($request);
        $categoryForm->handleRequest($request);
        $passwordForm->handleRequest($request);

        if ($addressForm->isSubmitted() && $addressForm->isValid()) {
            $user->addAdresse($address);
            $em->persist($address);
            $em->flush();
            $this->addFlash('success', 'Address added.');
            return $this->redirectToRoute('professional_settings');
        }

        if ($contactForm->isSubmitted() && $contactForm->isValid()) {
            $user->setPrimaryContact($contact);
            $em->persist($contact);
            $em->flush();
            $this->addFlash('success', 'Contact info updated.');
            return $this->redirectToRoute('professional_settings');
        }
        
        if ($socialLinksForm->isSubmitted() && $socialLinksForm->isValid()) {
             $data = $socialLinksForm->getData();
             $existingLinks = $user->getLinks();
             
             foreach ($data as $type => $url) {
                 // specific logic to find link by type
                 $found = false;
                 foreach ($existingLinks as $linkEntity) {
                     if ($linkEntity->getType() === $type) {
                         if ($url) {
                             $linkEntity->setLink($url);
                         } else {
                             $user->removeLink($linkEntity);
                             $em->remove($linkEntity);
                         }
                         $found = true;
                         break;
                     }
                 }
                 
                 if (!$found && $url) {
                     $newLink = new \App\Entity\Link();
                     $newLink->setType($type);
                     $newLink->setLink($url);
                     $user->addLink($newLink);
                     $em->persist($newLink);
                 }
             }
             
             $em->flush();
             $this->addFlash('success', 'Social links updated.');
             return $this->redirectToRoute('professional_settings');
        }

        if ($categoryForm->isSubmitted() && $categoryForm->isValid()) {
             $em->flush();
             $this->addFlash('success', 'Category updated.');
             return $this->redirectToRoute('professional_settings');
        }

        if ($passwordForm->isSubmitted() && $passwordForm->isValid()) {
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                    $user,
                    $passwordForm->get('plainPassword')->getData()
                )
            );
            $em->persist($user);
            $em->flush();
            $this->addFlash('success', 'Your password has been changed.');
            return $this->redirectToRoute('professional_settings');
        }

        return $this->render('professional/settings.html.twig', [
            'addressForm' => $addressForm->createView(),
            'contactForm' => $contactForm->createView(),
            'socialLinksForm' => $socialLinksForm->createView(),
            'categoryForm' => $categoryForm->createView(),
            'passwordForm' => $passwordForm->createView(),
            'user' => $user
        ]);
    }
}
