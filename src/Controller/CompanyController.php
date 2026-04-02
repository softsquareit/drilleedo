<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/company')]
#[IsGranted('ROLE_COMPANY')]
class CompanyController extends AbstractController
{
    #[Route('/', name: 'company_dashboard')]
    public function index(EntityManagerInterface $em): Response
    {
        /** @var \App\Entity\Company $user */
        $user = $this->getUser();
        $projectCount = 0;
        
        // Project Count Logic
        if (method_exists($user, 'getProjets')) {
             $projectCount = $user->getProjets()->count();
        }

        // Quotes Count (matching any company category)
        $quoteCount = 0;
        if ($user->getCategories()->count() > 0) {
            $quoteCount = count($em->getRepository(\App\Entity\QuoteRequest::class)->findByCategories($user->getCategories()->toArray()));
        }

        // Offers Count (sent by company)
        $offerCount = count($em->getRepository(\App\Entity\Offer::class)->findByProvider($user));

        // Notifications Logic
        $notifications = [];
        if (method_exists($user, 'getNotifications')) {
            $notifications = $user->getNotifications();
        }

        return $this->render('company/index.html.twig', [
            'projectCount' => $projectCount,
            'quoteCount' => $quoteCount,
            'offerCount' => $offerCount,
            'notifications' => $notifications,
            'controller_name' => 'CompanyController',
        ]);
    }

    #[Route('/quotes', name: 'company_quotes')]
    public function quotes(EntityManagerInterface $em): Response
    {
        /** @var \App\Entity\Company $user */
        $user = $this->getUser();
        
        $quotes = [];
        if ($user->getCategories()->count() > 0) {
            $quotes = $em->getRepository(\App\Entity\QuoteRequest::class)->findByCategories($user->getCategories()->toArray());
        }

        return $this->render('company/quotes.html.twig', [
            'quotes' => $quotes,
        ]);
    }

    #[Route('/direct-requests', name: 'company_direct_requests')]
    public function directRequests(EntityManagerInterface $em): Response
    {
        /** @var \App\Entity\Company $user */
        $user = $this->getUser();
        
        $directRequests = $em->getRepository(\App\Entity\DirectRequest::class)->findBy(['targetCompany' => $user], ['creationDate' => 'DESC']);

        return $this->render('company/direct_requests.html.twig', [
            'directRequests' => $directRequests,
        ]);
    }

    #[Route('/offers', name: 'company_offers')]
    public function offers(EntityManagerInterface $em): Response
    {
        $offers = $em->getRepository(\App\Entity\Offer::class)->findByProvider($this->getUser());

        return $this->render('company/offers.html.twig', [
            'offers' => $offers,
        ]);
    }

    #[Route('/profile', name: 'company_profile')]
    public function profile(Request $request, \App\Service\FileUploader $fileUploader, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        $form = $this->createForm(\App\Form\CompanyBasicType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Handle Logo Upload
            $logoFile = $form->get('logoFile')->getData();

            if ($logoFile) {
                try {
                    $newFilename = $fileUploader->upload($logoFile, 'logos');
                    $user->setLogo($newFilename);
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Error uploading logo: '.$e->getMessage());
                }
            }
            
            $bannerFile = $form->get('bannerFile')->getData();
            if ($bannerFile) {
                try {
                    $newFilename = $fileUploader->upload($bannerFile, 'banners');
                    $user->setBanner($newFilename);
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Error uploading banner: '.$e->getMessage());
                }
            }

            $em->persist($user);
            $em->flush();
            $this->addFlash('success', 'Profile updated successfully.');

            return $this->redirectToRoute('company_profile');
        }

        return $this->render('company/profile.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/projects', name: 'company_projects')]
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
            return $this->redirectToRoute('company_projects');
        }

        return $this->render('company/projects/index.html.twig', [
            'projects' => $this->getUser()->getProjets(),
            'projectForm' => $form->createView(), // Pass form to view
        ]);
    }

    #[Route('/projects/{id}/edit', name: 'company_project_edit')]
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

            // Handle Gallery (Append to existing?)
            // For now, let's just add new ones to the list.
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
            return $this->redirectToRoute('company_projects');
        }

        return $this->render('company/projects/form.html.twig', [
            'form' => $form->createView(),
            'title' => 'Edit Project'
        ]);
    }

    #[Route('/projects/{id}/delete', name: 'company_project_delete', methods: ['POST'])]
    public function deleteProject(int $id, EntityManagerInterface $em): Response
    {
        $project = $em->getRepository(\App\Entity\Projet::class)->find($id);
        
        if ($project && $project->getBusiness()?->getId() === $this->getUser()?->getId()) {
            $em->remove($project);
            $em->flush();
            $this->addFlash('success', 'Project deleted successfully.');
        }

        return $this->redirectToRoute('company_projects');
    }

    #[Route('/settings', name: 'company_settings')]
    public function settings(Request $request, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        
        // Forms setup
        $address = new \App\Entity\Adress();
        $addressForm = $this->createForm(\App\Form\AdressType::class, $address);
        
        $contact = $user->getPrimaryContact() ?? new \App\Entity\PrimaryContact();
        $contactForm = $this->createForm(\App\Form\PrimaryContactType::class, $contact);
        
        $legalForm = $this->createForm(\App\Form\CompanyLegalType::class, $user);
        
        // Prepare Social Links Data
        $socialData = [];
        foreach ($user->getLinks() as $linkEntity) {
            if ($linkEntity->getType()) {
                $socialData[$linkEntity->getType()] = $linkEntity->getLink();
            }
        }
        
        $socialLinksForm = $this->createForm(\App\Form\SocialLinksType::class, $socialData);

        $categoryForm = $this->createForm(\App\Form\CompanyCategoryType::class, $user);

        $addressForm->handleRequest($request);
        $contactForm->handleRequest($request);
        $legalForm->handleRequest($request);
        $socialLinksForm->handleRequest($request);
        $categoryForm->handleRequest($request);

        if ($addressForm->isSubmitted() && $addressForm->isValid()) {
            $user->addAdresse($address);
            $em->persist($address);
            $em->flush();
            $this->addFlash('success', 'Address added.');
            return $this->redirectToRoute('company_settings');
        }

        if ($contactForm->isSubmitted() && $contactForm->isValid()) {
            $user->setPrimaryContact($contact);
            $em->persist($contact);
            $em->flush();
            $this->addFlash('success', 'Contact info updated.');
            return $this->redirectToRoute('company_settings');
        }

        if ($legalForm->isSubmitted() && $legalForm->isValid()) {
            $em->flush();
            $this->addFlash('success', 'Legal info updated.');
            return $this->redirectToRoute('company_settings');
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
             return $this->redirectToRoute('company_settings');
        }

        if ($categoryForm->isSubmitted() && $categoryForm->isValid()) {
            $em->flush();
            $this->addFlash('success', 'Services updated.');
            return $this->redirectToRoute('company_settings');
       }

        return $this->render('company/settings.html.twig', [
            'addressForm' => $addressForm->createView(),
            'contactForm' => $contactForm->createView(),
            'legalForm' => $legalForm->createView(),
            'socialLinksForm' => $socialLinksForm->createView(),
            'categoryForm' => $categoryForm->createView(),
            'user' => $user
        ]);
    }
}
