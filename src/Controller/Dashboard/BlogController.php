<?php

namespace App\Controller\Dashboard;

use App\Entity\Blog;
use App\Entity\Business;
use App\Form\BlogType;
use App\Repository\BlogRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/dashboard/blog', name: 'dashboard_blog_')]
#[IsGranted('ROLE_USER')]
class BlogController extends AbstractController
{
    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(BlogRepository $blogRepository): Response
    {
        /** @var Business $user */
        $user = $this->getUser();
        
        // Ensure the user is a Business (Professional or Company)
        if (!$user instanceof Business) {
            throw $this->createAccessDeniedException('Only Professionals and Companies can manage blogs.');
        }

        $baseTemplate = $user instanceof \App\Entity\Company ? 'company/base_company.html.twig' : 'professional/base_professional.html.twig';

        return $this->render('dashboard/blog/index.html.twig', [
            'blogs' => $blogRepository->findBy(['author' => $user], ['createdAt' => 'DESC']),
            'base_template' => $baseTemplate,
        ]);
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        /** @var Business $user */
        $user = $this->getUser();

        if (!$user instanceof Business) {
             throw $this->createAccessDeniedException('Only Professionals and Companies can create blogs.');
        }

        $baseTemplate = $user instanceof \App\Entity\Company ? 'company/base_company.html.twig' : 'professional/base_professional.html.twig';

        $blog = new Blog();
        $blog->setAuthor($user);
        
        $form = $this->createForm(BlogType::class, $blog);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Handle File Upload
            $imageFile = $form->get('mainImgFile')->getData();
            if ($imageFile) {
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                // Safe filename logic (could use slugger)
                $extension = $imageFile->getClientOriginalExtension() ?: 'jpg';
                $newFilename = uniqid().'.'.$extension;

                try {
                    $imageFile->move(
                        $this->getParameter('kernel.project_dir').'/public/uploads/blogs',
                        $newFilename
                    );
                    // Store the relative path or filename
                    $blog->setMainImg('/uploads/blogs/'.$newFilename);
                } catch (\Exception $e) {
                    // Handle exception if something happens during file upload
                    $this->addFlash('danger', 'Failed to upload image.');
                }
            }
            
            // Handle Multiple Images Upload
            $multipleImages = $form->get('multiple_imgs')->getData();
            $galleryPaths = [];
            if ($multipleImages) {
                foreach ($multipleImages as $imageFile) {
                    $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                    $extension = $imageFile->getClientOriginalExtension() ?: 'jpg';
                    $newFilename = uniqid().'.'.$extension;

                    try {
                        $imageFile->move(
                            $this->getParameter('kernel.project_dir').'/public/uploads/blogs',
                            $newFilename
                        );
                        $galleryPaths[] = '/uploads/blogs/'.$newFilename;
                    } catch (\Exception $e) {
                         // silently ignore failed uploads or handle errors
                    }
                }
                
                if (!empty($galleryPaths)) {
                     $blog->setMultipleImgs($galleryPaths);
                }
            }

            $entityManager->persist($blog);
            $entityManager->flush();

            $this->addFlash('success', 'Blog/Idea created successfully.');

            return $this->redirectToRoute('dashboard_blog_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('dashboard/blog/new.html.twig', [
            'blog' => $blog,
            'form' => $form->createView(),
            'base_template' => $baseTemplate,
        ]);
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Blog $blog, EntityManagerInterface $entityManager): Response
    {
        // Security check: ensure the user owns this blog
        if ($blog->getAuthor() !== $this->getUser()) {
             throw $this->createAccessDeniedException('You do not have permission to edit this item.');
        }
        
        /** @var Business $user */
        $user = $this->getUser();
        $baseTemplate = $user instanceof \App\Entity\Company ? 'company/base_company.html.twig' : 'professional/base_professional.html.twig';

        $form = $this->createForm(BlogType::class, $blog);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            
             // Handle File Upload
            $imageFile = $form->get('mainImgFile')->getData();
            if ($imageFile) {
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $extension = $imageFile->getClientOriginalExtension() ?: 'jpg';
                $newFilename = uniqid().'.'.$extension;

                try {
                    $imageFile->move(
                        $this->getParameter('kernel.project_dir').'/public/uploads/blogs',
                        $newFilename
                    );
                    $blog->setMainImg('/uploads/blogs/'.$newFilename);
                } catch (\Exception $e) {
                    $this->addFlash('danger', 'Failed to upload image.');
                }
            }

            // Handle Multiple Images Upload (Append or Replace? Let's Append for now or reset)
            // Ideally we'd have a way to manage existing images. For simplicity, let's just add new ones to existing or replace if logic demands.
            // If the user uploads new images, we might want to ADD them to the existing array.
            
            $multipleImages = $form->get('multiple_imgs')->getData();
            if ($multipleImages) {
                $currentGallery = $blog->getMultipleImgs() ?? [];
                
                foreach ($multipleImages as $imageFile) {
                    $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                    $extension = $imageFile->getClientOriginalExtension() ?: 'jpg';
                    $newFilename = uniqid().'.'.$extension;

                    try {
                        $imageFile->move(
                            $this->getParameter('kernel.project_dir').'/public/uploads/blogs',
                            $newFilename
                        );
                        $currentGallery[] = '/uploads/blogs/'.$newFilename;
                    } catch (\Exception $e) {
                    }
                }
                $blog->setMultipleImgs($currentGallery);
            }
            
            $entityManager->flush();

            $this->addFlash('success', 'Blog/Idea updated successfully.');

            return $this->redirectToRoute('dashboard_blog_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('dashboard/blog/edit.html.twig', [
            'blog' => $blog,
            'form' => $form->createView(),
            'base_template' => $baseTemplate,
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['POST'])]
    public function delete(Request $request, Blog $blog, EntityManagerInterface $entityManager): Response
    {
        // Security check: ensure the user owns this blog
        if ($blog->getAuthor() !== $this->getUser()) {
             throw $this->createAccessDeniedException('You do not have permission to delete this item.');
        }

        if ($this->isCsrfTokenValid('delete'.$blog->getId(), $request->request->get('_token'))) {
            $entityManager->remove($blog);
            $entityManager->flush();
            $this->addFlash('success', 'Item deleted successfully.');
        }

        return $this->redirectToRoute('dashboard_blog_index', [], Response::HTTP_SEE_OTHER);
    }
}
