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
            $this->addFlash('error', 'This request is closed and no longer accepts offers.');
            return $this->redirectToRoute('professional_offers');
        }

        // Check if offer already sent
        $offer = $em->getRepository(Offer::class)->findOneBy(['quoteRequest' => $quote, 'provider' => $user]);
        
        if ($offer && $offer->getStatus() !== Offer::STATUS_DRAFT) {
            $this->addFlash('warning', 'Only draft offers can be edited.');
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
            
            // Notification for Individual (only if published/updated)
            $individual = $quote->getIndividual();
            if ($individual && $shouldNotify) {
                $providerName = $user->getCompanyName() ?? $user->getTradeName() ?? 'a provider';
                $notification = new Notification();
                $notification->setUser($individual);
                $notification->setTitle($isEdit ? 'Offer Updated' : 'New Offer Received');
                $notification->setMessage(sprintf(
                    '%s %s an offer of %s$ for your request "%s".',
                    $providerName,
                    $isEdit ? 'updated' : 'sent',
                    $offer->getPrice(),
                    $quote->getTitle()
                ));
                $notification->setRelatedEntityId($quote->getId());
                $notification->setRelatedEntityType('quote');
                $notification->setRead(false);
                $em->persist($notification);
            }

            $em->flush();

            $this->addFlash('success', $isEdit ? 'Offer updated successfully!' : 'Offer sent successfully!');
            
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
            $this->addFlash('error', 'This request is closed and no longer accepts offers.');
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
            
            // Notification for Individual
            $individual = $directRequest->getIndividual();
            if ($individual) {
                $notification = new Notification();
                $notification->setUser($individual);
                $notification->setTitle('New Offer Received');
                $notification->setMessage(sprintf(
                    'You received an offer of %s$ from %s for your direct request "%s".',
                    $offer->getPrice(),
                    $user->getCompanyName() ?? $user->getTradeName() ?? 'a provider',
                    $directRequest->getTitle()
                ));
                $notification->setRelatedEntityId($offer->getId());
                $notification->setRelatedEntityType('offer');
                $notification->setRead(false);
                $em->persist($notification);
            }

            $em->flush();

            $this->addFlash('success', 'Offer sent successfully!');
            
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
            $this->addFlash('error', 'Only draft offers can be deleted.');
            return $this->redirectToRoute('professional_offers');
        }

        if (!$this->isCsrfTokenValid('delete-offer-' . $offer->getId(), $request->request->get('_token'))) {
            $this->addFlash('error', 'Invalid security token.');
            return $this->redirectToRoute('professional_offers');
        }

        // Notify the individual
        $quote = $offer->getQuoteRequest();
        if ($quote && $quote->getIndividual()) {
            $notification = new Notification();
            $notification->setUser($quote->getIndividual());
            $notification->setTitle('Offer Withdrawn');
            $notification->setMessage(sprintf(
                '%s has withdrawn their offer for your request "%s".',
                $user->getCompanyName() ?? 'A provider',
                $quote->getTitle()
            ));
            $notification->setRelatedEntityId($quote->getId());
            $notification->setRelatedEntityType('quote');
            $notification->setRead(false);
            $em->persist($notification);
        }

        $em->remove($offer);
        $em->flush();

        $this->addFlash('success', 'Offer deleted successfully.');
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

        if ($offer->getStatus() !== 'ACCEPTED') {
            $this->addFlash('error', 'Only accepted offers can be finalized.');
            return $this->redirectToRoute('professional_offers');
        }

        if (!$this->isCsrfTokenValid('finalize-offer-' . $offer->getId(), $request->request->get('_token'))) {
            $this->addFlash('error', 'Invalid security token.');
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
            $notification->setTitle('Request Completed');
            $notification->setMessage(sprintf(
                'Good news! %s has confirmed the work for your request "%s" as completed and closed.',
                $user->getCompanyName() ?? 'Your provider',
                $parentRequest->getTitle()
            ));
            $notification->setRelatedEntityId($parentRequest->getId());
            $notification->setRelatedEntityType($quote ? 'quote' : 'direct_request');
            $notification->setRead(false);
            $em->persist($notification);
        }

        $em->flush();

        $this->addFlash('success', 'Request finalized and closed. Thank you for your service!');

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
