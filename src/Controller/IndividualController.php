<?php

namespace App\Controller;

use App\Entity\QuoteRequest;
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

#[Route('/individual')]
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

        return $this->render('individual/index.html.twig', [
            'user' => $user,
            'quotes' => $user->getQuoteRequests(),
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
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
            'form' => $form->createView()
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
            'form' => $form->createView(),
            'user' => $user
        ]);
    }
    #[Route('/quotes', name: 'individual_quotes')]
    public function myQuotes(EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        
        return $this->render('individual/quotes.html.twig', [
            'quotes' => $user->getQuoteRequests(),
        ]);
    }

    #[Route('/quote/{id}', name: 'individual_quote_show', requirements: ['id' => '\d+'])]
    public function showQuote(QuoteRequest $quote, Request $request, EntityManagerInterface $em, \App\Service\FileUploader $fileUploader): Response
    {
        // Security check
        if ($quote->getIndividual() !== $this->getUser()) {
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
            'quote' => $quote,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/direct-requests', name: 'individual_direct_requests')]
    public function directRequests(): Response
    {
        /** @var \App\Entity\Individual $user */
        $user = $this->getUser();
        
        return $this->render('individual/direct_requests.html.twig', [
            'directRequests' => $user->getDirectRequests(),
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
            'offers' => $offers,
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
            'form' => $form->createView(),
            'user' => $user
        ]);
    }
 
    #[Route('/quote/{id}/publish', name: 'individual_quote_publish', methods: ['POST'])]
    public function publishQuote(QuoteRequest $quote, Request $request, EntityManagerInterface $em): Response
    {
        if ($quote->getIndividual() !== $this->getUser()) {
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
        if ($quote->getIndividual() !== $this->getUser()) {
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
        if ($quote->getIndividual() !== $this->getUser()) {
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

        if (!$parentRequest || $parentRequest->getIndividual() !== $this->getUser()) {
            throw $this->createAccessDeniedException('You do not have access to this offer.');
        }

        return $this->render('individual/offer_detail.html.twig', [
            'offer' => $offer,
            'quote' => $quoteRequest,
            'directRequest' => $directRequest,
            'parentRequest' => $parentRequest,
        ]);
    }

    #[Route('/offer/{id}/accept', name: 'individual_offer_accept', methods: ['POST'])]
    public function acceptOffer(Offer $offer, Request $request, EntityManagerInterface $em): Response
    {
        $quoteRequest = $offer->getQuoteRequest();
        $directRequest = $offer->getDirectRequest();
        $parentRequest = $quoteRequest ?? $directRequest;

        if (!$parentRequest || $parentRequest->getIndividual() !== $this->getUser()) {
            throw $this->createAccessDeniedException('You do not have access to this offer.');
        }

        if (!$this->isCsrfTokenValid('offer-action-' . $offer->getId(), $request->request->get('_token'))) {
            $this->addFlash('danger', 'Invalid security token.');
            return $this->redirectToRoute('individual_offers');
        }

        if ($parentRequest->getStatus() === QuoteRequest::STATUS_CLOSED) {
            $this->addFlash('warning', 'This request is already closed.');
            return $this->returnToParentRequest($offer);
        }

        // Accept this offer
        $offer->setStatus(Offer::STATUS_ACCEPTED);
        $offer->setUpdatedAt(new \DateTime());

        // Update parent request
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
            $notification->setMessage('Your offer for "' . $parentRequest->getTitle() . '" has been accepted!');
            $notification->setRelatedEntityId($offer->getId());
            $notification->setRelatedEntityType('offer');
            $em->persist($notification);
        }

        $em->flush();

        $this->addFlash('success', 'Offer accepted! The provider has been notified.');
        return $this->returnToParentRequest($offer);
    }

    #[Route('/offer/{id}/reject', name: 'individual_offer_reject', methods: ['POST'])]
    public function rejectOffer(Offer $offer, Request $request, EntityManagerInterface $em): Response
    {
        $quoteRequest = $offer->getQuoteRequest();
        $directRequest = $offer->getDirectRequest();
        $parentRequest = $quoteRequest ?? $directRequest;

        if (!$parentRequest || $parentRequest->getIndividual() !== $this->getUser()) {
            throw $this->createAccessDeniedException('You do not have access to this offer.');
        }

        if (!$this->isCsrfTokenValid('offer-action-' . $offer->getId(), $request->request->get('_token'))) {
            $this->addFlash('danger', 'Invalid security token.');
            return $this->returnToParentRequest($offer);
        }

        $offer->setStatus(Offer::STATUS_REJECTED);
        $offer->setUpdatedAt(new \DateTime());

        // Notify the provider
        $provider = $offer->getProvider();
        if ($provider) {
            $notification = new Notification();
            $notification->setUser($provider);
            $notification->setTitle('Offer Rejected');
            $notification->setMessage(sprintf('Your offer for "%s" has been rejected.', $parentRequest->getTitle()));
            $notification->setRelatedEntityId($offer->getId());
            $notification->setRelatedEntityType('offer');
            $em->persist($notification);
        }

        $em->flush();

        $this->addFlash('success', 'Offer has been rejected.');
        return $this->returnToParentRequest($offer);
    }

    // Removed revertOfferPending as it is not part of the target workflow

    private function returnToParentRequest(Offer $offer): Response
    {
        if ($offer->getQuoteRequest()) {
            return $this->redirectToRoute('individual_quote_show', ['id' => $offer->getQuoteRequest()->getId()]);
        }
        if ($offer->getDirectRequest()) {
            // Assuming there's a show route for direct requests, or redirect to offers list
            return $this->redirectToRoute('individual_offers');
        }
        return $this->redirectToRoute('individual_offers');
    }
}
