<?php

namespace App\Controller;

use App\Entity\QuoteRequest;
use App\Entity\DirectRequest;
use App\Entity\Offer;
use App\Entity\Notification;
use App\Entity\Professional;
use App\Form\QuoteRequestType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Form\ChangePasswordType;

#[Route('/individual-compte')]
#[IsGranted('ROLE_INDIVIDUAL')]
class IndividualController extends AbstractController
{
    #[Route('/', name: 'individual_dashboard')]
    public function index(EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        
        $notifications = $em->getRepository(Notification::class)->findBy(
            ['user' => $user],
            ['createdAt' => 'DESC'],
            50
        );

        $unreadCount = $em->getRepository(Notification::class)->count([
            'user' => $user,
            'isRead' => false
        ]);

        // KPI metrics
        $quotes = $user->getQuoteRequests();
        $totalRequests = count($quotes);

        $publishedCount = 0;
        $receivedOffersCount = 0;
        $acceptedOffersCount = 0;

        foreach ($quotes as $q) {
            if ($q->getStatus() === QuoteRequest::STATUS_PUBLISHED) {
                $publishedCount++;
            }
            foreach ($q->getOffers() as $offer) {
                if ($offer->getStatus() !== Offer::STATUS_DRAFT) {
                    $receivedOffersCount++;
                }
                if ($offer->getStatus() === Offer::STATUS_ACCEPTED) {
                    $acceptedOffersCount++;
                }
            }
        }

        return $this->render('individual/index.html.twig', [
            'user'                => $user,
            'quotes'              => $quotes,
            'notifications'       => $notifications,
            'unreadCount'         => $unreadCount,
            'totalRequests'       => $totalRequests,
            'publishedCount'      => $publishedCount,
            'receivedOffersCount' => $receivedOffersCount,
            'acceptedOffersCount' => $acceptedOffersCount,
        ]);
    }

    #[Route('/notifications', name: 'individual_notifications')]
    public function notifications(EntityManagerInterface $em): Response
    {
        $user = $this->getUser();

        $notifications = $em->getRepository(Notification::class)->findBy(
            ['user' => $user],
            ['createdAt' => 'DESC'],
            100
        );

        $unreadCount = 0;
        foreach ($notifications as $n) {
            if (!$n->isRead()) {
                $n->setRead(true);
                $unreadCount++;
            }
        }
        if ($unreadCount > 0) {
            $em->flush();
        }

        return $this->render('individual/notifications.html.twig', [
            'notifications' => $notifications,
            'unreadCount'   => 0,
        ]);
    }

    #[Route('/quote/new', name: 'individual_quote_new')]
    public function createQuote(Request $request, EntityManagerInterface $em, \App\Service\FileUploader $fileUploader): Response
    {
        $user = $this->getUser();
        $quoteRequest = new QuoteRequest();
        $form = $this->createForm(QuoteRequestType::class, $quoteRequest);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $quoteRequest->setIndividual($user);
            $quoteRequest->setStatus(QuoteRequest::STATUS_DRAFT); // Default status is now Draft
            
            // Handle Images
            $images = $form->get('images')->getData();
            if ($images) {
                $imagePaths = [];
                foreach ($images as $image) {
                    $imagePaths[] = $fileUploader->upload($image, 'quote_requests');
                }
                $quoteRequest->setImages($imagePaths);
            }

            $em->persist($quoteRequest);
            $em->flush();
            $this->addFlash('success', 'Quote request saved as draft. You can publish it when ready.');
            return $this->redirectToRoute('individual_quote_show', ['id' => $quoteRequest->getId()]);
        }

        return $this->render('individual/new_quote.html.twig', [
            'form'        => $form->createView(),
            'unreadCount' => $this->getUnreadCount($em),
        ]);
    }

    #[Route('/profile', name: 'individual_profile')]
    public function profile(Request $request, EntityManagerInterface $em): Response
    {
        /** @var \App\Entity\Individual $user */
        $user = $this->getUser();
        
        $personalInfos = $user->getPersonalInfos();
        if (!$personalInfos) {
            $personalInfos = new \App\Entity\PersonalInfos();
            $user->setPersonalInfos($personalInfos);
        }

        $form = $this->createForm(\App\Form\PersonalInfosType::class, $personalInfos);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($personalInfos);
            $em->persist($user);
            $em->flush();

            $this->addFlash('success', 'Profile updated successfully.');
            return $this->redirectToRoute('individual_profile');
        }

        return $this->render('individual/profile.html.twig', [
            'form'        => $form->createView(),
            'user'        => $user,
            'unreadCount' => $this->getUnreadCount($em),
        ]);
    }
    #[Route('/quotes', name: 'individual_quotes')]
    public function myQuotes(EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        
        return $this->render('individual/quotes.html.twig', [
            'quotes'      => $user->getQuoteRequests(),
            'unreadCount' => $this->getUnreadCount($em),
        ]);
    }

    #[Route('/quote/{id}', name: 'individual_quote_show', requirements: ['id' => '\d+'])]
    public function showQuote(QuoteRequest $quote, Request $request, EntityManagerInterface $em, \App\Service\FileUploader $fileUploader): Response
    {
        // Security check
        if ($quote->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException('You do not own this quote request.');
        }

        // Edit form
        $isDraft = $quote->getStatus() === QuoteRequest::STATUS_DRAFT;
        $form = $this->createForm(QuoteRequestType::class, $quote, [
            'disabled' => !$isDraft
        ]);
        $form->handleRequest($request);

        if ($isDraft && $form->isSubmitted() && $form->isValid()) {
            
            // Handle Images
            $images = $form->get('images')->getData();
            if ($images) {
                // Get existing images or start an empty array
                $imagePaths = $quote->getImages() ?? [];
                foreach ($images as $image) {
                    $imagePaths[] = $fileUploader->upload($image, 'quote_requests');
                }
                $quote->setImages($imagePaths);
            }

            $em->persist($quote);
            $em->flush();

            $this->addFlash('success', 'Your quote request has been updated successfully.');
            return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
        }

        return $this->render('individual/quote_show.html.twig', [
            'quote'       => $quote,
            'form'        => $form->createView(),
            'unreadCount' => $this->getUnreadCount($em),
        ]);
    }

    #[Route('/direct-request/{id}', name: 'individual_direct_request_show', requirements: ['id' => '\d+'])]
    public function showDirectRequest(DirectRequest $directRequest, EntityManagerInterface $em): Response
    {
        if ($directRequest->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException('You do not own this direct request.');
        }

        return $this->render('individual/direct_request_show.html.twig', [
            'request'     => $directRequest,
            'unreadCount' => $this->getUnreadCount($em),
        ]);
    }

    #[Route('/direct-requests', name: 'individual_direct_requests')]
    public function directRequests(EntityManagerInterface $em): Response
    {
        /** @var \App\Entity\Individual $user */
        $user = $this->getUser();

        return $this->render('individual/direct_requests.html.twig', [
            'directRequests' => $user->getDirectRequests(),
            'unreadCount'    => $this->getUnreadCount($em),
        ]);
    }

    #[Route('/offers', name: 'individual_offers')]
    public function receivedOffers(EntityManagerInterface $em): Response
    {
        /** @var \App\Entity\Individual $user */
        $user = $this->getUser();
        $offers = [];
        
        // Offers from Quote Requests
        foreach ($user->getQuoteRequests() as $quote) {
            foreach ($quote->getOffers() as $offer) {
                if ($offer->getStatus() !== Offer::STATUS_DRAFT) {
                    $offers[] = $offer;
                }
            }
        }
        
        // Offers from Direct Requests
        foreach ($user->getDirectRequests() as $directRequest) {
            foreach ($directRequest->getOffers() as $offer) {
                if ($offer->getStatus() !== Offer::STATUS_DRAFT) {
                    $offers[] = $offer;
                }
            }
        }
        
        // Sort by creation date descending
        usort($offers, function($a, $b) {
            return $b->getCreatedAt() <=> $a->getCreatedAt();
        });
        
        return $this->render('individual/offers.html.twig', [
            'offers'      => $offers,
            'unreadCount' => $this->getUnreadCount($em),
        ]);
    }

    #[Route('/settings', name: 'individual_settings')]
    public function settings(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher): Response
    {
        /** @var \App\Entity\Individual $user */
        $user = $this->getUser();
        
        $form = $this->createForm(ChangePasswordType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $newPassword = $form->get('plainPassword')->getData();
            if ($newPassword) {
                $user->setPassword(
                    $passwordHasher->hashPassword(
                        $user,
                        $newPassword
                    )
                );
                $em->persist($user);
                $em->flush();

                $this->addFlash('success', 'Your password has been successfully updated.');
                return $this->redirectToRoute('individual_settings');
            }
        }

        return $this->render('individual/settings.html.twig', [
            'form'        => $form->createView(),
            'user'        => $user,
            'unreadCount' => $this->getUnreadCount($em),
        ]);
    }
 
    #[Route('/quote/{id}/publish', name: 'individual_quote_publish', methods: ['POST'])]
    public function publishQuote(QuoteRequest $quote, Request $request, EntityManagerInterface $em): Response
    {
        if ($quote->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException('You do not own this quote request.');
        }

        if (!$this->isCsrfTokenValid('publish-quote-' . $quote->getId(), $request->request->get('_token'))) {
            $this->addFlash('danger', 'Invalid security token.');
            return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
        }
 
        if ($quote->getStatus() !== QuoteRequest::STATUS_DRAFT) {
            $this->addFlash('warning', 'Only draft requests can be published.');
            return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
        }
 
        $quote->setStatus(QuoteRequest::STATUS_PUBLISHED);
        
        // Notification Logic for Professionals (Moved from createQuote)
        $category = $quote->getCategory();
        if ($category) {
            $professionals = $em->getRepository(Professional::class)->findBy(['category' => $category]);
            foreach ($professionals as $pro) {
                $notification = new Notification();
                $notification->setUser($pro);
                $notification->setMessage('New quote request published: ' . $quote->getTitle());
                $notification->setRelatedEntityId($quote->getId());
                $notification->setRelatedEntityType('quote');
                $em->persist($notification);
            }
 
            $companies = $em->getRepository(\App\Entity\Company::class)
                ->createQueryBuilder('c')
                ->where(':category MEMBER OF c.categories')
                ->setParameter('category', $category)
                ->getQuery()
                ->getResult();
 
            foreach ($companies as $comp) {
                $notification = new Notification();
                $notification->setUser($comp);
                $notification->setMessage('New quote request published: ' . $quote->getTitle());
                $notification->setRelatedEntityId($quote->getId());
                $notification->setRelatedEntityType('quote');
                $em->persist($notification);
            }
        }
 
        $em->flush();
 
        $this->addFlash('success', 'Quote request is now published and visible to professionals!');
        return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
    }

    // ========================================================
    // WORKFLOW STEP 1 – Request Management & Offer Actions
    // ========================================================

    // Removed toggleQuote as it used legacy statuses (Active/Inactive)

    #[Route('/quote/{id}/delete', name: 'individual_quote_delete', methods: ['POST'])]
    public function deleteQuote(QuoteRequest $quote, Request $request, EntityManagerInterface $em): Response
    {
        if ($quote->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException('You do not own this quote request.');
        }

        if (!$this->isCsrfTokenValid('delete-quote-' . $quote->getId(), $request->request->get('_token'))) {
            $this->addFlash('danger', 'Invalid security token.');
            return $this->redirectToRoute('individual_quotes');
        }

        $title = $quote->getTitle();

        // Delete uploaded images from disk
        $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/quote_requests/';
        if ($quote->getImages()) {
            foreach ($quote->getImages() as $img) {
                $filePath = $uploadDir . $img;
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
        }

        $em->remove($quote);
        $em->flush();

        $this->addFlash('success', 'Request "' . $title . '" has been permanently deleted.');
        return $this->redirectToRoute('individual_quotes');
    }

    #[Route('/quote/{id}/remove-image/{index}', name: 'individual_quote_remove_image', methods: ['POST'], requirements: ['index' => '\d+'])]
    public function removeQuoteImage(QuoteRequest $quote, int $index, Request $request, EntityManagerInterface $em): Response
    {
        if ($quote->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException('You do not own this quote request.');
        }

        if (!$this->isCsrfTokenValid('remove-image-' . $quote->getId(), $request->request->get('_token'))) {
            $this->addFlash('danger', 'Invalid security token.');
            return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
        }

        $images = $quote->getImages() ?? [];
        if (isset($images[$index])) {
            // Delete file from disk
            $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/quote_requests/';
            $filePath = $uploadDir . $images[$index];
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            // Remove from array and re-index
            array_splice($images, $index, 1);
            $quote->setImages($images);
            $em->flush();

            $this->addFlash('success', 'Image removed successfully.');
        } else {
            $this->addFlash('warning', 'Image not found.');
        }

        return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
    }

    #[Route('/offer/{id}', name: 'individual_offer_show', requirements: ['id' => '\d+'])]
    public function showOffer(Offer $offer, EntityManagerInterface $em): Response
    {
        $quoteRequest = $offer->getQuoteRequest();
        $directRequest = $offer->getDirectRequest();
        $parentRequest = $quoteRequest ?? $directRequest;

        if (!$parentRequest || $parentRequest->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException('You do not have access to this offer.');
        }

        // Auto-mark viewed on first open
        if (!$offer->isViewed()) {
            $offer->setViewedAt(new \DateTime());
            $em->flush();
        }

        return $this->render('individual/offer_detail.html.twig', [
            'offer'         => $offer,
            'quote'         => $quoteRequest,
            'directRequest' => $directRequest,
            'parentRequest' => $parentRequest,
            'unreadCount'   => $this->getUnreadCount($em),
        ]);
    }

    #[Route('/offer/{id}/interested', name: 'individual_offer_interested', methods: ['POST'])]
    public function markOfferInterested(Offer $offer, Request $request, EntityManagerInterface $em): Response
    {
        $quoteRequest = $offer->getQuoteRequest();
        $directRequest = $offer->getDirectRequest();
        $parentRequest = $quoteRequest ?? $directRequest;

        if (!$parentRequest || $parentRequest->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException();
        }

        if (!$this->isCsrfTokenValid('offer-action-' . $offer->getId(), $request->request->get('_token'))) {
            $this->addFlash('danger', 'Jeton de sécurité invalide.');
            return $this->returnToParentRequest($offer);
        }

        // Only PUBLISHED offers can be marked interested
        if ($offer->getStatus() !== Offer::STATUS_PUBLISHED) {
            $this->addFlash('warning', 'Action non disponible pour cette offre.');
            return $this->returnToParentRequest($offer);
        }

        $offer->setStatus(Offer::STATUS_INTERESTED);
        $offer->setUpdatedAt(new \DateTime());

        // Notify the provider
        $provider = $offer->getProvider();
        if ($provider) {
            $notification = new Notification();
            $notification->setUser($provider);
            $notification->setTitle('Offre en cours d\'examen');
            $notification->setMessage('Le client a marqué votre offre pour "' . $parentRequest->getTitle() . '" comme intéressante. Décision en attente.');
            $notification->setRelatedEntityId($offer->getId());
            $notification->setRelatedEntityType('offer');
            $em->persist($notification);
        }

        $em->flush();

        $this->addFlash('success', 'Offre marquée comme intéressante. Le prestataire en sera informé.');
        return $this->returnToParentRequest($offer);
    }

    #[Route('/offer/{id}/accept', name: 'individual_offer_accept', methods: ['POST'])]
    public function acceptOffer(Offer $offer, Request $request, EntityManagerInterface $em): Response
    {
        $quoteRequest = $offer->getQuoteRequest();
        $directRequest = $offer->getDirectRequest();
        $parentRequest = $quoteRequest ?? $directRequest;

        if (!$parentRequest || $parentRequest->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException('You do not have access to this offer.');
        }

        if (!$this->isCsrfTokenValid('offer-action-' . $offer->getId(), $request->request->get('_token'))) {
            $this->addFlash('danger', 'Invalid security token.');
            return $this->redirectToRoute('individual_offers');
        }

        if ($parentRequest->getStatus() === QuoteRequest::STATUS_CLOSED) {
            $this->addFlash('warning', 'Cette demande est déjà clôturée.');
            return $this->returnToParentRequest($offer);
        }

        // Accept this offer → parent request becomes ACCEPTED (not CLOSED)
        $offer->setStatus(Offer::STATUS_ACCEPTED);
        $offer->setUpdatedAt(new \DateTime());

        $parentRequest->setStatus(QuoteRequest::STATUS_ACCEPTED);

        // Auto-reject other published offers
        foreach ($parentRequest->getOffers() as $otherOffer) {
            if ($otherOffer->getId() !== $offer->getId() && $otherOffer->getStatus() === Offer::STATUS_PUBLISHED) {
                $otherOffer->setStatus(Offer::STATUS_REJECTED);
                $otherOffer->setUpdatedAt(new \DateTime());
            }
        }

        // Notify the accepted provider
        $provider = $offer->getProvider();
        if ($provider) {
            $notification = new Notification();
            $notification->setUser($provider);
            $notification->setTitle('Offre acceptée');
            $notification->setMessage('Votre offre pour "' . $parentRequest->getTitle() . '" a été acceptée !');
            $notification->setRelatedEntityId($offer->getId());
            $notification->setRelatedEntityType('offer');
            $em->persist($notification);
        }

        $em->flush();

        $this->addFlash('success', 'Offre acceptée ! Le prestataire a été notifié.');
        return $this->returnToParentRequest($offer);
    }

    #[Route('/offer/{id}/reject', name: 'individual_offer_reject', methods: ['POST'])]
    public function rejectOffer(Offer $offer, Request $request, EntityManagerInterface $em): Response
    {
        $quoteRequest = $offer->getQuoteRequest();
        $directRequest = $offer->getDirectRequest();
        $parentRequest = $quoteRequest ?? $directRequest;

        if (!$parentRequest || $parentRequest->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException('You do not have access to this offer.');
        }

        if (!$this->isCsrfTokenValid('offer-action-' . $offer->getId(), $request->request->get('_token'))) {
            $this->addFlash('danger', 'Jeton de sécurité invalide.');
            return $this->returnToParentRequest($offer);
        }

        $offer->setStatus(Offer::STATUS_REJECTED);
        $offer->setUpdatedAt(new \DateTime());

        // Notify the provider
        $provider = $offer->getProvider();
        if ($provider) {
            $notification = new Notification();
            $notification->setUser($provider);
            $notification->setTitle('Offre refusée');
            $notification->setMessage(sprintf('Votre offre pour "%s" a été refusée.', $parentRequest->getTitle()));
            $notification->setRelatedEntityId($offer->getId());
            $notification->setRelatedEntityType('offer');
            $em->persist($notification);
        }

        $em->flush();

        $this->addFlash('success', 'Offre refusée.');
        return $this->returnToParentRequest($offer);
    }

    // ── Revert ACCEPTED / IN_PROGRESS → PUBLISHED ──────────────────────────
    #[Route('/quote/{id}/revert-published', name: 'individual_quote_revert_published', methods: ['POST'])]
    public function revertQuoteToPublished(QuoteRequest $quote, Request $request, EntityManagerInterface $em): Response
    {
        if ($quote->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException();
        }

        if (!$this->isCsrfTokenValid('revert-quote-' . $quote->getId(), $request->request->get('_token'))) {
            $this->addFlash('danger', 'Jeton de sécurité invalide.');
            return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
        }

        $allowed = [QuoteRequest::STATUS_ACCEPTED, QuoteRequest::STATUS_IN_PROGRESS];
        if (!in_array($quote->getStatus(), $allowed, true)) {
            $this->addFlash('warning', 'Seules les demandes acceptées ou en cours peuvent repasser à publiée.');
            return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
        }

        // Reset accepted offer back to published so pros can re-bid
        foreach ($quote->getOffers() as $offer) {
            if ($offer->getStatus() === Offer::STATUS_ACCEPTED) {
                $offer->setStatus(Offer::STATUS_PUBLISHED);
                $offer->setUpdatedAt(new \DateTime());

                // Notify the provider
                $provider = $offer->getProvider();
                if ($provider) {
                    $notification = new Notification();
                    $notification->setUser($provider);
                    $notification->setTitle('Statut de l\'offre modifié');
                    $notification->setMessage('La demande "' . $quote->getTitle() . '" est revenue en attente.');
                    $notification->setRelatedEntityId($offer->getId());
                    $notification->setRelatedEntityType('offer');
                    $em->persist($notification);
                }
            }
        }

        $quote->setStatus(QuoteRequest::STATUS_PUBLISHED);
        $em->flush();

        $this->addFlash('success', 'La demande est revenue en statut "Publiée". Les offres sont à nouveau disponibles.');
        return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
    }

    // ── ACCEPTED → IN_PROGRESS ─────────────────────────────────────────────
    #[Route('/quote/{id}/start', name: 'individual_quote_start', methods: ['POST'])]
    public function startQuote(QuoteRequest $quote, Request $request, EntityManagerInterface $em): Response
    {
        if ($quote->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException();
        }

        if (!$this->isCsrfTokenValid('start-quote-' . $quote->getId(), $request->request->get('_token'))) {
            $this->addFlash('danger', 'Jeton de sécurité invalide.');
            return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
        }

        if ($quote->getStatus() !== QuoteRequest::STATUS_ACCEPTED) {
            $this->addFlash('warning', 'Seules les demandes acceptées peuvent être démarrées.');
            return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
        }

        $quote->setStatus(QuoteRequest::STATUS_IN_PROGRESS);

        // Notify the accepted provider
        foreach ($quote->getOffers() as $offer) {
            if ($offer->getStatus() === Offer::STATUS_ACCEPTED) {
                $provider = $offer->getProvider();
                if ($provider) {
                    $notification = new Notification();
                    $notification->setUser($provider);
                    $notification->setTitle('Chantier démarré');
                    $notification->setMessage('Le chantier pour "' . $quote->getTitle() . '" est officiellement démarré !');
                    $notification->setRelatedEntityId($quote->getId());
                    $notification->setRelatedEntityType('quote');
                    $em->persist($notification);
                }
            }
        }

        $em->flush();

        $this->addFlash('success', 'La mission est maintenant "En cours". Bonne réalisation !');
        return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
    }

    // ── Close request (ACCEPTED / IN_PROGRESS → CLOSED) ───────────────────
    #[Route('/quote/{id}/close', name: 'individual_quote_close', methods: ['POST'])]
    public function closeQuote(QuoteRequest $quote, Request $request, EntityManagerInterface $em): Response
    {
        if ($quote->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException();
        }

        if (!$this->isCsrfTokenValid('close-quote-' . $quote->getId(), $request->request->get('_token'))) {
            $this->addFlash('danger', 'Jeton de sécurité invalide.');
            return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
        }

        $allowed = [QuoteRequest::STATUS_ACCEPTED, QuoteRequest::STATUS_IN_PROGRESS];
        if (!in_array($quote->getStatus(), $allowed, true)) {
            $this->addFlash('warning', 'Seules les demandes acceptées ou en cours peuvent être clôturées.');
            return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
        }

        $quote->setStatus(QuoteRequest::STATUS_CLOSED);

        // Close all related offers + notify provider + send feedback request
        foreach ($quote->getOffers() as $offer) {
            if ($offer->getStatus() === Offer::STATUS_ACCEPTED) {
                $offer->setStatus(Offer::STATUS_CLOSED);
                $offer->setUpdatedAt(new \DateTime());

                $provider = $offer->getProvider();
                if ($provider) {
                    // Notification clôture
                    $notif = new Notification();
                    $notif->setUser($provider);
                    $notif->setTitle('Demande clôturée');
                    $notif->setMessage('La demande "' . $quote->getTitle() . '" a été clôturée par le client. Merci pour votre travail !');
                    $notif->setRelatedEntityId($quote->getId());
                    $notif->setRelatedEntityType('quote');
                    $em->persist($notif);

                    // Feedback request notification (to the individual)
                    $feedbackNotif = new Notification();
                    $feedbackNotif->setUser($this->getUser());
                    $feedbackNotif->setTitle('Laissez un avis');
                    $feedbackNotif->setMessage('Votre mission "' . $quote->getTitle() . '" est terminée. Pensez à laisser un avis au prestataire !');
                    $feedbackNotif->setRelatedEntityId($quote->getId());
                    $feedbackNotif->setRelatedEntityType('quote');
                    $em->persist($feedbackNotif);
                }
            }
        }

        $em->flush();

        $this->addFlash('success', 'Demande clôturée définitivement. Un rappel pour laisser un avis a été envoyé.');
        return $this->redirectToRoute('individual_quote_show', ['id' => $quote->getId()]);
    }

    // ── Direct Request: ACCEPTED/IN_PROGRESS → PUBLISHED ────────────────────
    #[Route('/direct-request/{id}/revert-published', name: 'individual_direct_request_revert_published', methods: ['POST'])]
    public function revertDirectRequestToPublished(DirectRequest $directRequest, Request $request, EntityManagerInterface $em): Response
    {
        if ($directRequest->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException();
        }

        if (!$this->isCsrfTokenValid('revert-direct-request-' . $directRequest->getId(), $request->request->get('_token'))) {
            $this->addFlash('danger', 'Jeton de sécurité invalide.');
            return $this->redirectToRoute('individual_direct_request_show', ['id' => $directRequest->getId()]);
        }

        $allowed = [DirectRequest::STATUS_ACCEPTED, DirectRequest::STATUS_IN_PROGRESS];
        if (!in_array($directRequest->getStatus(), $allowed, true)) {
            $this->addFlash('warning', 'Seules les demandes acceptées ou en cours peuvent être rouvertes.');
            return $this->redirectToRoute('individual_direct_request_show', ['id' => $directRequest->getId()]);
        }

        foreach ($directRequest->getOffers() as $offer) {
            if ($offer->getStatus() === Offer::STATUS_ACCEPTED) {
                $offer->setStatus(Offer::STATUS_PUBLISHED);
                $offer->setUpdatedAt(new \DateTime());

                $provider = $offer->getProvider();
                if ($provider) {
                    $notification = new Notification();
                    $notification->setUser($provider);
                    $notification->setTitle('Statut de l\'offre modifié');
                    $notification->setMessage('La demande directe "' . $directRequest->getTitle() . '" est revenue en attente.');
                    $notification->setRelatedEntityId($offer->getId());
                    $notification->setRelatedEntityType('offer');
                    $em->persist($notification);
                }
            }
        }

        $directRequest->setStatus(DirectRequest::STATUS_PUBLISHED);
        $em->flush();

        $this->addFlash('success', 'La demande directe est revenue en statut "Publiée".');
        return $this->redirectToRoute('individual_direct_request_show', ['id' => $directRequest->getId()]);
    }

    // ── Direct Request: ACCEPTED → IN_PROGRESS ──────────────────────────────
    #[Route('/direct-request/{id}/start', name: 'individual_direct_request_start', methods: ['POST'])]
    public function startDirectRequest(DirectRequest $directRequest, Request $request, EntityManagerInterface $em): Response
    {
        if ($directRequest->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException();
        }

        if (!$this->isCsrfTokenValid('start-direct-request-' . $directRequest->getId(), $request->request->get('_token'))) {
            $this->addFlash('danger', 'Jeton de sécurité invalide.');
            return $this->redirectToRoute('individual_direct_request_show', ['id' => $directRequest->getId()]);
        }

        if ($directRequest->getStatus() !== DirectRequest::STATUS_ACCEPTED) {
            $this->addFlash('warning', 'Seules les demandes acceptées peuvent être démarrées.');
            return $this->redirectToRoute('individual_direct_request_show', ['id' => $directRequest->getId()]);
        }

        $directRequest->setStatus(DirectRequest::STATUS_IN_PROGRESS);

        foreach ($directRequest->getOffers() as $offer) {
            if ($offer->getStatus() === Offer::STATUS_ACCEPTED) {
                $provider = $offer->getProvider();
                if ($provider) {
                    $notification = new Notification();
                    $notification->setUser($provider);
                    $notification->setTitle('Chantier démarré');
                    $notification->setMessage('La demande directe "' . $directRequest->getTitle() . '" est officiellement démarrée !');
                    $notification->setRelatedEntityId($directRequest->getId());
                    $notification->setRelatedEntityType('direct_request');
                    $em->persist($notification);
                }
            }
        }

        $em->flush();

        $this->addFlash('success', 'La mission est maintenant "En cours". Bonne réalisation !');
        return $this->redirectToRoute('individual_direct_request_show', ['id' => $directRequest->getId()]);
    }

    // ── Direct Request: ACCEPTED/IN_PROGRESS → CLOSED ───────────────────────
    #[Route('/direct-request/{id}/close', name: 'individual_direct_request_close', methods: ['POST'])]
    public function closeDirectRequest(DirectRequest $directRequest, Request $request, EntityManagerInterface $em): Response
    {
        if ($directRequest->getIndividual()?->getId() !== $this->getUser()?->getId()) {
            throw $this->createAccessDeniedException();
        }

        if (!$this->isCsrfTokenValid('close-direct-request-' . $directRequest->getId(), $request->request->get('_token'))) {
            $this->addFlash('danger', 'Jeton de sécurité invalide.');
            return $this->redirectToRoute('individual_direct_request_show', ['id' => $directRequest->getId()]);
        }

        $allowed = [DirectRequest::STATUS_ACCEPTED, DirectRequest::STATUS_IN_PROGRESS];
        if (!in_array($directRequest->getStatus(), $allowed, true)) {
            $this->addFlash('warning', 'Seules les demandes acceptées ou en cours peuvent être clôturées.');
            return $this->redirectToRoute('individual_direct_request_show', ['id' => $directRequest->getId()]);
        }

        $directRequest->setStatus(DirectRequest::STATUS_CLOSED);

        foreach ($directRequest->getOffers() as $offer) {
            if ($offer->getStatus() === Offer::STATUS_ACCEPTED) {
                $offer->setStatus(Offer::STATUS_CLOSED);
                $offer->setUpdatedAt(new \DateTime());

                $provider = $offer->getProvider();
                if ($provider) {
                    $notif = new Notification();
                    $notif->setUser($provider);
                    $notif->setTitle('Demande clôturée');
                    $notif->setMessage('La demande directe "' . $directRequest->getTitle() . '" a été clôturée par le client. Merci pour votre travail !');
                    $notif->setRelatedEntityId($directRequest->getId());
                    $notif->setRelatedEntityType('direct_request');
                    $em->persist($notif);

                    $feedbackNotif = new Notification();
                    $feedbackNotif->setUser($this->getUser());
                    $feedbackNotif->setTitle('Laissez un avis');
                    $feedbackNotif->setMessage('Votre mission "' . $directRequest->getTitle() . '" est terminée. Pensez à laisser un avis au prestataire !');
                    $feedbackNotif->setRelatedEntityId($directRequest->getId());
                    $feedbackNotif->setRelatedEntityType('direct_request');
                    $em->persist($feedbackNotif);
                }
            }
        }

        $em->flush();

        $this->addFlash('success', 'Demande directe clôturée définitivement. Un rappel pour laisser un avis a été envoyé.');
        return $this->redirectToRoute('individual_direct_request_show', ['id' => $directRequest->getId()]);
    }

    private function getUnreadCount(EntityManagerInterface $em): int
    {
        return $em->getRepository(Notification::class)->count([
            'user'   => $this->getUser(),
            'isRead' => false,
        ]);
    }

    private function returnToParentRequest(Offer $offer): Response
    {
        if ($offer->getQuoteRequest()) {
            return $this->redirectToRoute('individual_quote_show', ['id' => $offer->getQuoteRequest()->getId()]);
        }
        if ($offer->getDirectRequest()) {
            return $this->redirectToRoute('individual_direct_request_show', ['id' => $offer->getDirectRequest()->getId()]);
        }
        return $this->redirectToRoute('individual_offers');
    }
}
