<?php

namespace App\Controller\Admin;

use App\Entity\Category;
use App\Form\CategoryType;
use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
class CategoryController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em) {}

    #[Route('/dashboard/categories', name: 'admin_category_index')]
    public function listCategories(): Response
    {
        $username = $this->getUser()->getUserIdentifier();
        return $this->render('admin/category/index.html.twig', [
            'username'   => $username,
            'categories' => $this->em->getRepository(Category::class)->findAll(),
            'form'       => $this->createForm(CategoryType::class, new Category()),
        ]);
    }

    #[Route('/dashboard/categories/create', name: 'admin_category_create')]
    public function createCategory(Request $request, FileUploader $fileUploader): Response
    {
        $category = new Category();
        $form = $this->createForm(CategoryType::class, $category);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $iconFile = $form->get('iconFile')->getData();
            if ($iconFile) {
                try {
                    $category->setIcon($fileUploader->upload($iconFile, 'categories'));
                } catch (\Exception $e) {
                    if ($request->isXmlHttpRequest()) {
                        return new JsonResponse(['success' => false, 'message' => 'Error uploading icon'], 400);
                    }
                    $this->addFlash('error', 'Error uploading icon');
                }
            }
            $bannerFile = $form->get('bannerFile')->getData();
            if ($bannerFile) {
                try {
                    $category->setBanner($fileUploader->upload($bannerFile, 'categories'));
                } catch (\Exception $e) {
                    if ($request->isXmlHttpRequest()) {
                        return new JsonResponse(['success' => false, 'message' => 'Error uploading banner'], 400);
                    }
                    $this->addFlash('error', 'Error uploading banner');
                }
            }
            $this->em->persist($category);
            $this->em->flush();
            if ($request->isXmlHttpRequest()) {
                return new JsonResponse(['success' => true, 'message' => 'Category created successfully.']);
            }
            $this->addFlash('success', 'Category created successfully.');
            return $this->redirectToRoute('admin_category_index');
        }

        if ($form->isSubmitted() && !$form->isValid() && $request->isXmlHttpRequest()) {
            return new JsonResponse(['success' => false, 'message' => 'Validation error', 'errors' => (string) $form->getErrors(true, false)], 400);
        }

        return $this->render('admin/category/create.html.twig', ['form' => $form]);
    }

    #[Route('/dashboard/categories/{id}/edit', name: 'admin_category_edit')]
    public function editCategory(int $id, Request $request, FileUploader $fileUploader): Response
    {
        $category = $this->em->getRepository(Category::class)->find($id);
        if (!$category) {
            throw $this->createNotFoundException();
        }

        $form = $this->createForm(CategoryType::class, $category);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $iconFile = $form->get('iconFile')->getData();
            if ($iconFile) {
                try {
                    $category->setIcon($fileUploader->upload($iconFile, 'categories'));
                } catch (\Exception $e) {
                    if ($request->isXmlHttpRequest()) {
                        return new JsonResponse(['success' => false, 'message' => 'Error uploading icon'], 400);
                    }
                    $this->addFlash('error', 'Error uploading icon');
                }
            }
            $bannerFile = $form->get('bannerFile')->getData();
            if ($bannerFile) {
                try {
                    $category->setBanner($fileUploader->upload($bannerFile, 'categories'));
                } catch (\Exception $e) {
                    if ($request->isXmlHttpRequest()) {
                        return new JsonResponse(['success' => false, 'message' => 'Error uploading banner'], 400);
                    }
                    $this->addFlash('error', 'Error uploading banner');
                }
            }
            $this->em->flush();
            if ($request->isXmlHttpRequest()) {
                return new JsonResponse(['success' => true, 'message' => 'Category updated successfully.']);
            }
            $this->addFlash('success', 'Category updated successfully.');
            return $this->redirectToRoute('admin_category_index');
        }

        if ($form->isSubmitted() && !$form->isValid() && $request->isXmlHttpRequest()) {
            return new JsonResponse(['success' => false, 'message' => 'Validation error', 'errors' => (string) $form->getErrors(true, false)], 400);
        }

        return $this->render('admin/category/edit.html.twig', ['form' => $form]);
    }

    #[Route('/dashboard/categories/{id}/delete', name: 'admin_category_delete', methods: ['POST'])]
    public function deleteCategory(int $id, Request $request): Response
    {
        $category = $this->em->getRepository(Category::class)->find($id);
        if ($category && $this->isCsrfTokenValid('delete' . $category->getId(), $request->request->get('_token'))) {
            $this->em->remove($category);
            $this->em->flush();
            $this->addFlash('success', 'Category successfully deleted.');
        }
        return $this->redirectToRoute('admin_category_index');
    }
}
