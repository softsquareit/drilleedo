<?php

namespace App\Controller;

use App\Entity\QuoteRequest;
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
        
        return $this->render('individual/index.html.twig', [
            'user' => $user,
            'quotes' => $user->getQuoteRequests(),
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
            $quoteRequest->setStatus('Pending'); // Default status
            
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
            $em->flush(); // Generate ID for notifications
            
            // Notification Logic
            $category = $quoteRequest->getCategory();
            if ($category) {
                // Find professionals with this category
                $professionals = $em->getRepository(Professional::class)->findBy(['category' => $category]);
                
                foreach ($professionals as $pro) {
                    $notification = new Notification();
                    $notification->setUser($pro);
                    $notification->setMessage('New quote request: ' . $quoteRequest->getTitle());
                    $notification->setRelatedEntityId($quoteRequest->getId());
                    $notification->setRelatedEntityType('quote');
                    $em->persist($notification);
                }

                // Find companies with this category
                $companies = $em->getRepository(\App\Entity\Company::class)
                    ->createQueryBuilder('c')
                    ->where(':category MEMBER OF c.categories')
                    ->setParameter('category', $category)
                    ->getQuery()
                    ->getResult();

                 foreach ($companies as $comp) {
                    $notification = new Notification();
                    $notification->setUser($comp);
                    $notification->setMessage('New quote request: ' . $quoteRequest->getTitle());
                    $notification->setRelatedEntityId($quoteRequest->getId());
                    $notification->setRelatedEntityType('quote');
                    $em->persist($notification);
                }
                
                $em->flush(); // Save notifications
            }
            $this->addFlash('success', 'Quote request posted and professionals notified.');
            return $this->redirectToRoute('individual_dashboard');
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
        $form = $this->createForm(QuoteRequestType::class, $quote);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            
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
        $user = $this->getUser();
        $offers = [];
        foreach ($user->getQuoteRequests() as $quote) {
            foreach ($quote->getOffers() as $offer) {
                $offers[] = $offer;
            }
        }
        
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
}
