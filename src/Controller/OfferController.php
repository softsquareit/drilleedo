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
    #[IsGranted('ROLE_BUSINESS')] // Covers Professional and Company
    public function send(QuoteRequest $quote, Request $request, EntityManagerInterface $em, \App\Service\FileUploader $fileUploader): Response
    {
        $user = $this->getUser();
        if (!$user instanceof Business) {
            throw $this->createAccessDeniedException('Only businesses can send offers.');
        }

        // Check if offer already sent? (Optional, but good UX)
        // For now, allow sending multiple offers or check simply:
        $offer = $em->getRepository(Offer::class)->findOneBy(['quoteRequest' => $quote, 'provider' => $user]);
        
        if (!$offer) {
            $offer = new Offer();
            $offer->setQuoteRequest($quote);
            $offer->setProvider($user);
        }

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

            $em->persist($offer);
            
            // Notification for Individual
            $individual = $quote->getIndividual();
            if ($individual) {
                $notification = new Notification();
                $notification->setUser($individual);
                $notification->setTitle('New Offer Received');
                $notification->setMessage(sprintf(
                    'You received an offer of %s from %s for your request "%s".',
                    $offer->getPrice(),
                    $user->getCompanyName() ?? $user->getTradeName() ?? 'a provider',
                    $quote->getTitle()
                ));
                $notification->setRelatedEntityId($offer->getId());
                $notification->setRelatedEntityType('offer'); 
                $notification->setRead(false);
                $em->persist($notification);
            }

            $em->flush();

            $this->addFlash('success', 'Offer sent successfully!');
            
            // Redirect back to dashboard based on role
            if ($this->isGranted('ROLE_COMPANY')) {
                return $this->redirectToRoute('company_dashboard');
            }
            return $this->redirectToRoute('professional_dashboard');
        }

        return $this->render('offer/new.html.twig', [
            'quote' => $quote,
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

            $em->persist($offer);
            
            // Notification for Individual
            $individual = $directRequest->getIndividual();
            if ($individual) {
                $notification = new Notification();
                $notification->setUser($individual);
                $notification->setTitle('New Offer Received');
                $notification->setMessage(sprintf(
                    'You received an offer of $%s from %s for your direct request "%s".',
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
            return $this->redirectToRoute('professional_dashboard');
        }

        return $this->render('offer/new.html.twig', [
            'directRequest' => $directRequest,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/manage/{id}', name: 'offer_manage')]
    #[IsGranted('ROLE_INDIVIDUAL')]
    public function manage(QuoteRequest $quote, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if ($quote->getIndividual() !== $user) {
            throw $this->createAccessDeniedException('You are not the owner of this quote.');
        }

        $offers = $quote->getOffers();

        return $this->render('offer/manage.html.twig', [
            'quote' => $quote,
            'offers' => $offers,
        ]);
    }

    #[Route('/status/{id}/{status}', name: 'offer_status')]
    #[IsGranted('ROLE_INDIVIDUAL')]
    public function changeStatus(Offer $offer, string $status, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if ($offer->getQuoteRequest()->getIndividual() !== $user) {
            throw $this->createAccessDeniedException();
        }

        $validStatuses = ['REJECTED', 'INTERESTED', 'SELECTED'];
        if (!in_array($status, $validStatuses)) {
            throw $this->createNotFoundException('Invalid status');
        }

        // Logic for 'SELECTED': Only one offer can be selected? Or multiple?
        // Prompt says: "finally he chooses an offer from the interested ones". Implies single selection for finalization.
        if ($status === 'SELECTED') {
            // Check if another offer is already selected/accepted?
            // For now, let's just proceed.
            $offer->setStatus('SELECTED');
            
            // Notification to Provider
            $notification = new Notification();
            $notification->setUser($offer->getProvider());
            $notification->setTitle('Offer Selected');
            $notification->setMessage(sprintf(
                'Your offer for "%s" has been selected by the individual. Please confirm acceptance to exchange contact info.',
                $offer->getQuoteRequest()->getTitle()
            ));
            $notification->setRelatedEntityId($offer->getId());
            $notification->setRelatedEntityType('offer_finalize'); // Special type to link to finalize page
            $notification->setRead(false);
            $em->persist($notification);
        } else {
             $offer->setStatus($status);
        }

        $em->flush();
        $this->addFlash('success', 'Offer status updated.');

        return $this->redirectToRoute('offer_manage', ['id' => $offer->getQuoteRequest()->getId()]);
    }

    #[Route('/finalize/{id}', name: 'offer_finalize_view')]
    #[IsGranted('ROLE_BUSINESS')]
    public function finalizeView(Offer $offer): Response
    {
        $user = $this->getUser();
        if ($offer->getProvider() !== $user) {
             throw $this->createAccessDeniedException();
        }

        return $this->render('offer/finalize.html.twig', [
            'offer' => $offer,
            'quote' => $offer->getQuoteRequest()
        ]);
    }

    #[Route('/finalize/{id}/{decision}', name: 'offer_finalize_action')]
    #[IsGranted('ROLE_BUSINESS')]
    public function finalizeAction(Offer $offer, string $decision, EntityManagerInterface $em): Response
    {
         $user = $this->getUser();
         if ($offer->getProvider() !== $user) {
              throw $this->createAccessDeniedException();
         }

         if ($decision === 'ACCEPT') {
             $offer->setStatus('ACCEPTED');
             
             // NOTIFY INDIVIDUAL with CONTACT INFO
             $individual = $offer->getQuoteRequest()->getIndividual();
             $notification = new Notification();
             $notification->setUser($individual);
             $notification->setTitle('Offer Accepted!');
             $notification->setMessage(sprintf(
                 'Great news! %s has accepted the job. Contact them at: %s / %s',
                 $user->getCompanyName() ?? 'Provider',
                 $user->getEmail(),
                 $user->getPhoneNum() ?? 'No phone'
             ));
             $notification->setRelatedEntityId($offer->getId()); // Link back to offer or quote?
             $notification->setRelatedEntityType('offer_accepted');
             $notification->setRead(false);
             $em->persist($notification);
             
             $this->addFlash('success', 'You accepted the job. The individual has been notified with your contact info.');
             
         } elseif ($decision === 'REJECT') {
             $offer->setStatus('DECLINED_BY_PROVIDER');
             
             // Notify Individual
             $individual = $offer->getQuoteRequest()->getIndividual();
             $notification = new Notification();
             $notification->setUser($individual);
             $notification->setTitle('Offer Declined by Provider');
             $notification->setMessage('The provider has declined the final selection. Please choose another offer.');
             $notification->setRelatedEntityId($offer->getQuoteRequest()->getId());
             $notification->setRelatedEntityType('quote'); // Link back to quote manage
             $notification->setRead(false);
             $em->persist($notification);
             
             $this->addFlash('info', 'You declined the job.');
         } else {
             throw $this->createNotFoundException();
         }

         $em->flush();
         
         if ($this->isGranted('ROLE_COMPANY')) {
             return $this->redirectToRoute('company_dashboard');
         }
         return $this->redirectToRoute('professional_dashboard');
    }

    #[Route('/redirect/{id}', name: 'offer_redirect')]
    public function redirectAction(int $id, EntityManagerInterface $em): Response
    {
        $offer = $em->getRepository(Offer::class)->find($id);
        if (!$offer) {
            throw $this->createNotFoundException('Offer not found');
        }

        $user = $this->getUser();
        
        // If Role Individual: Redirect to Manage (Quote)
        if ($this->isGranted('ROLE_INDIVIDUAL')) {
             return $this->redirectToRoute('offer_manage', ['id' => $offer->getQuoteRequest()->getId()]);
        }
        
        // If Role Business:
        // Maybe go to Finalize if status is selected?
        if ($this->isGranted('ROLE_BUSINESS')) {
             if ($offer->getStatus() === 'SELECTED') {
                 return $this->redirectToRoute('offer_finalize_view', ['id' => $offer->getId()]);
             }
             // Else maybe show quote details? Reuse send view?
             return $this->redirectToRoute('offer_send', ['id' => $offer->getQuoteRequest()->getId()]);
        }
        
        throw $this->createAccessDeniedException();
    }
}
