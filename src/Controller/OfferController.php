<?php

namespace App\Controller;

use App\Entity\Business;
use App\Entity\Offer;
use App\Entity\QuoteRequest;
use App\Form\OfferType;
use App\Entity\Notification;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/offer')]
class OfferController extends AbstractController
{
    #[Route('/send/{id}', name: 'offer_send')]
    #[IsGranted('ROLE_BUSINESS')]
    public function send(QuoteRequest $quote, Request $request, EntityManagerInterface $em, \App\Service\FileUploader $fileUploader): Response
    {
        $user = $this->getUser();
        if (!$user instanceof Business) {
            throw $this->createAccessDeniedException('Only businesses can send offers.');
        }

        // Check if parent request is closed
        if ($quote->getStatus() === QuoteRequest::STATUS_CLOSED) {
            $this->addFlash('error', 'Cette demande est clôturée et n\'accepte plus d\'offres.');
            return $this->redirectToRoute('professional_offers');
        }

        // Check if offer already sent
        $offer = $em->getRepository(Offer::class)->findOneBy(['quoteRequest' => $quote, 'provider' => $user]);

        if ($offer && $offer->getStatus() !== Offer::STATUS_DRAFT) {
            $this->addFlash('warning', 'Seules les offres en brouillon peuvent être modifiées.');
            return $this->redirectToRoute('professional_offers');
        }

        $isEdit = (bool) $offer;
        if (!$offer) {
            $offer = new Offer();
            $offer->setQuoteRequest($quote);
            $offer->setProvider($user);
            $offer->setStatus(Offer::STATUS_DRAFT);
        }

        $form = $this->createForm(OfferType::class, $offer);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Handle Documents
            $documents = $form->get('documents')->getData();
            if ($documents) {
                $docPaths = $offer->getDocuments() ?? [];
                foreach ($documents as $doc) {
                    $docPaths[] = $fileUploader->upload($doc, 'offers');
                }
                $offer->setDocuments($docPaths);
            }

            if ($isEdit) {
                $offer->setUpdatedAt(new \DateTime());
            }

            // Handle Transitions
            $shouldNotify = false;
            $action = $request->request->get('action'); // draft or publish

            if ($action === 'publish' && $offer->getStatus() === Offer::STATUS_DRAFT) {
                $offer->setStatus(Offer::STATUS_PUBLISHED);
                $shouldNotify = true;
            } elseif ($offer->getStatus() === Offer::STATUS_PUBLISHED) {
                 // In theory forbidden by the controller check above, but for consistency:
                 $shouldNotify = $isEdit; 
            }

            $em->persist($offer);
            $em->flush(); // flush first so $offer->getId() is available for the notification link

            // Notification for Individual (only if published/updated)
            $individual = $quote->getIndividual();
            if ($individual && $shouldNotify) {
                $providerName = $user->getCompanyName() ?? $user->getTradeName() ?? 'un prestataire';
                $notification = new Notification();
                $notification->setUser($individual);
                $notification->setTitle($isEdit ? 'Offre mise à jour' : 'Nouvelle offre reçue');
                $notification->setMessage(sprintf(
                    '%s %s une offre de %s$ pour votre demande "%s".',
                    $providerName,
                    $isEdit ? 'a mis à jour' : 'a envoyé',
                    $offer->getPrice(),
                    $quote->getTitle()
                ));
                $notification->setRelatedEntityId($offer->getId());
                $notification->setRelatedEntityType('offer');
                $notification->setRead(false);
                $em->persist($notification);
                $em->flush();
            }

            $this->addFlash('success', $isEdit ? 'Offre mise à jour avec succès !' : 'Offre envoyée avec succès !');
            
            if ($this->isGranted('ROLE_COMPANY')) {
                return $this->redirectToRoute('company_dashboard');
            }
            return $this->redirectToRoute('professional_offers');
        }

        return $this->render('offer/new.html.twig', [
            'quote' => $quote,
            'offer' => $offer,
            'isEdit' => $isEdit,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/send-direct/{id}', name: 'offer_send_direct')]
    #[IsGranted('ROLE_BUSINESS')]
    public function sendDirect(int $id, Request $request, EntityManagerInterface $em, \App\Service\FileUploader $fileUploader): Response
    {
        $user = $this->getUser();
        if (!$user instanceof Business) {
            throw $this->createAccessDeniedException('Only businesses can send offers.');
        }

        $directRequest = $em->getRepository(\App\Entity\DirectRequest::class)->find($id);
        if (!$directRequest) {
            throw $this->createNotFoundException('Direct request not found');
        }

        if ($directRequest->getStatus() === \App\Entity\DirectRequest::STATUS_CLOSED) {
            $this->addFlash('error', 'Cette demande est clôturée et n\'accepte plus d\'offres.');
            return $this->redirectToRoute('professional_offers');
        }

        $offer = new Offer();
        $offer->setDirectRequest($directRequest);
        $offer->setProvider($user);

        $form = $this->createForm(OfferType::class, $offer);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Handle Documents
            $documents = $form->get('documents')->getData();
            if ($documents) {
                $docPaths = [];
                foreach ($documents as $doc) {
                    $docPaths[] = $fileUploader->upload($doc, 'offers');
                }
                $offer->setDocuments($docPaths);
            }

            $offer->setStatus(Offer::STATUS_PUBLISHED);
            $em->persist($offer);
            $em->flush(); // flush first so $offer->getId() is available

            // Notification for Individual
            $individual = $directRequest->getIndividual();
            if ($individual) {
                $notification = new Notification();
                $notification->setUser($individual);
                $notification->setTitle('Nouvelle offre reçue');
                $notification->setMessage(sprintf(
                    'Vous avez reçu une offre de %s$ de %s pour votre demande directe "%s".',
                    $offer->getPrice(),
                    $user->getCompanyName() ?? $user->getTradeName() ?? 'un prestataire',
                    $directRequest->getTitle()
                ));
                $notification->setRelatedEntityId($offer->getId());
                $notification->setRelatedEntityType('offer');
                $notification->setRead(false);
                $em->persist($notification);
                $em->flush();
            }

            $this->addFlash('success', 'Offre envoyée avec succès !');
            
            if ($this->isGranted('ROLE_COMPANY')) {
                return $this->redirectToRoute('company_dashboard');
            }
            return $this->redirectToRoute('professional_offers');
        }

        return $this->render('offer/new.html.twig', [
            'directRequest' => $directRequest,
            'form' => $form->createView(),
        ]);
    }

    /**
     * Professional withdraws their own PUBLISHED offer (sets it to REJECTED and notifies the individual)
     */
    #[Route('/{id}/withdraw', name: 'offer_withdraw', methods: ['POST'])]
    #[IsGranted('ROLE_BUSINESS')]
    public function withdraw(Offer $offer, Request $request, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if ($offer->getProvider() !== $user) {
            throw $this->createAccessDeniedException('This is not your offer.');
        }

        if (!in_array($offer->getStatus(), [Offer::STATUS_PUBLISHED, Offer::STATUS_INTERESTED], true)) {
            $this->addFlash('error', 'Seules les offres envoyées ou en examen peuvent être retirées.');
            return $this->redirectToRoute('professional_offers');
        }

        if (!$this->isCsrfTokenValid('withdraw-offer-' . $offer->getId(), $request->request->get('_token'))) {
            $this->addFlash('error', 'Jeton de sécurité invalide.');
            return $this->redirectToRoute('professional_offers');
        }

        $offer->setStatus(Offer::STATUS_REJECTED);
        $offer->setUpdatedAt(new \DateTime());

        // Notify the individual
        $quote = $offer->getQuoteRequest();
        $directRequest = $offer->getDirectRequest();
        $parentRequest = $quote ?? $directRequest;
        if ($parentRequest && $parentRequest->getIndividual()) {
            $notification = new Notification();
            $notification->setUser($parentRequest->getIndividual());
            $notification->setTitle('Offre retirée');
            $notification->setMessage(sprintf(
                '%s a retiré son offre pour votre demande "%s".',
                $user->getCompanyName() ?? 'Un prestataire',
                $parentRequest->getTitle()
            ));
            $notification->setRelatedEntityId($parentRequest->getId());
            $notification->setRelatedEntityType($quote ? 'quote' : 'direct_request');
            $em->persist($notification);
        }

        $em->flush();

        $this->addFlash('success', 'Votre offre a été retirée.');
        return $this->redirectToRoute('professional_offers');
    }

    /**
     * Professional deletes their own DRAFT offer
     */
    #[Route('/{id}/delete', name: 'offer_delete', methods: ['POST'])]
    #[IsGranted('ROLE_BUSINESS')]
    public function delete(Offer $offer, Request $request, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if ($offer->getProvider() !== $user) {
            throw $this->createAccessDeniedException('This is not your offer.');
        }

        if ($offer->getStatus() !== Offer::STATUS_DRAFT) {
            $this->addFlash('error', 'Seules les offres en brouillon peuvent être supprimées.');
            return $this->redirectToRoute('professional_offers');
        }

        if (!$this->isCsrfTokenValid('delete-offer-' . $offer->getId(), $request->request->get('_token'))) {
            $this->addFlash('error', 'Jeton de sécurité invalide.');
            return $this->redirectToRoute('professional_offers');
        }

        // DRAFT was never visible to the individual — no notification needed
        $em->remove($offer);
        $em->flush();

        $this->addFlash('success', 'Brouillon supprimé avec succès.');
        return $this->redirectToRoute('professional_offers');
    }

    /**
     * Professional finalizes an accepted offer → marks the QuoteRequest as "Closed"
     */
    #[Route('/{id}/finalize', name: 'offer_finalize', methods: ['POST'])]
    #[IsGranted('ROLE_BUSINESS')]
    public function finalize(Offer $offer, Request $request, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if ($offer->getProvider() !== $user) {
            throw $this->createAccessDeniedException('This is not your offer.');
        }

        if ($offer->getStatus() !== Offer::STATUS_ACCEPTED) {
            $this->addFlash('error', 'Seules les offres acceptées peuvent être finalisées.');
            return $this->redirectToRoute('professional_offers');
        }

        if (!$this->isCsrfTokenValid('finalize-offer-' . $offer->getId(), $request->request->get('_token'))) {
            $this->addFlash('error', 'Jeton de sécurité invalide.');
            return $this->redirectToRoute('professional_offers');
        }

        // Mark the Parent Request as Closed
        $quote = $offer->getQuoteRequest();
        $directRequest = $offer->getDirectRequest();
        $parentRequest = $quote ?? $directRequest;

        if ($parentRequest) {
            $parentRequest->setStatus($parentRequest instanceof QuoteRequest ? QuoteRequest::STATUS_CLOSED : \App\Entity\DirectRequest::STATUS_CLOSED);
        }

        // Mark the Offer as Closed
        $offer->setStatus(Offer::STATUS_CLOSED);

        // Notify the Individual
        if ($parentRequest && $parentRequest->getIndividual()) {
            $notification = new Notification();
            $notification->setUser($parentRequest->getIndividual());
            $notification->setTitle('Demande finalisée');
            $notification->setMessage(sprintf(
                'Bonne nouvelle ! %s a confirmé la fin des travaux pour votre demande "%s".',
                $user->getCompanyName() ?? 'Votre prestataire',
                $parentRequest->getTitle()
            ));
            $notification->setRelatedEntityId($parentRequest->getId());
            $notification->setRelatedEntityType($quote ? 'quote' : 'direct_request');
            $notification->setRead(false);
            $em->persist($notification);
        }

        $em->flush();

        $this->addFlash('success', 'Demande finalisée et clôturée. Merci pour votre service !');

        if ($this->isGranted('ROLE_COMPANY')) {
            return $this->redirectToRoute('company_dashboard');
        }
        return $this->redirectToRoute('professional_offers');
    }

    /**
     * View offer detail from Professional side  
     */
    #[Route('/{id}/view', name: 'offer_view')]
    #[IsGranted('ROLE_BUSINESS')]
    public function view(Offer $offer): Response
    {
        $user = $this->getUser();
        if ($offer->getProvider() !== $user) {
            throw $this->createAccessDeniedException('This is not your offer.');
        }

        return $this->render('offer/view.html.twig', [
            'offer' => $offer,
            'quote' => $offer->getQuoteRequest(),
            'directRequest' => $offer->getDirectRequest(),
        ]);
    }

    /**
     * Lightweight polling endpoint — returns unread notification count for the current user
     */
    #[Route('/notifications/unread-count', name: 'notification_unread_count', methods: ['GET'])]
    public function unreadCount(EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['count' => 0]);
        }

        $count = $em->getRepository(Notification::class)->count([
            'user'   => $user,
            'isRead' => false,
        ]);

        return $this->json(['count' => $count]);
    }

    /**
     * Mark a notification as read (AJAX-friendly)
     */
    #[Route('/notification/{id}/read', name: 'notification_mark_read', methods: ['POST'])]
    public function markNotificationRead(int $id, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        $notification = $em->getRepository(Notification::class)->find($id);
        
        if (!$notification || $notification->getUser() !== $user) {
            return $this->json(['error' => 'Not found'], 404);
        }

        $notification->setRead(true);
        $em->flush();

        return $this->json(['success' => true]);
    }

    /**
     * Mark all notifications as read
     */
    #[Route('/notifications/read-all', name: 'notification_mark_all_read', methods: ['POST'])]
    public function markAllRead(Request $request, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        
        if (!$this->isCsrfTokenValid('mark-all-read', $request->request->get('_token'))) {
            $this->addFlash('error', 'Invalid security token.');
            
            if ($this->isGranted('ROLE_INDIVIDUAL')) {
                return $this->redirectToRoute('individual_dashboard');
            }
            if ($this->isGranted('ROLE_COMPANY')) {
                return $this->redirectToRoute('company_dashboard');
            }
            return $this->redirectToRoute('professional_dashboard');
        }

        $notifications = $em->getRepository(Notification::class)->findBy([
            'user' => $user,
            'isRead' => false,
        ]);

        foreach ($notifications as $notification) {
            $notification->setRead(true);
        }

        $em->flush();
        $this->addFlash('success', 'All notifications marked as read.');

        // Redirect back based on role
        if ($this->isGranted('ROLE_INDIVIDUAL')) {
            return $this->redirectToRoute('individual_dashboard');
        }
        if ($this->isGranted('ROLE_COMPANY')) {
            return $this->redirectToRoute('company_dashboard');
        }
        return $this->redirectToRoute('professional_dashboard');
    }
}
