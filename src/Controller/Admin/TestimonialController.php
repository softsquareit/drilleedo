<?php

namespace App\Controller\Admin;

use App\Entity\Testimonial;
use App\Form\TestimonialType;
use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
class TestimonialController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em) {}

    #[Route('/dashboard/testimonials', name: 'admin_testimonial_index')]
    public function listTestimonials(): Response
    {
        return $this->render('admin/testimonial/index.html.twig', [
            'username'     => $this->getUser()->getUserIdentifier(),
            'testimonials' => $this->em->getRepository(Testimonial::class)->findAll(),
            'form'         => $this->createForm(TestimonialType::class, new Testimonial()),
        ]);
    }

    #[Route('/dashboard/testimonials/create', name: 'admin_testimonial_create')]
    public function createTestimonial(Request $request, FileUploader $fileUploader): Response
    {
        $testimonial = new Testimonial();
        $form = $this->createForm(TestimonialType::class, $testimonial, ['csrf_protection' => false]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $imageFile = $form->get('imageFile')->getData();
            if ($imageFile) {
                try {
                    $testimonial->setImage($fileUploader->upload($imageFile, 'testimonials'));
                } catch (FileException $e) {
                    $this->addFlash('error', 'Error uploading image');
                }
            }
            $this->em->persist($testimonial);
            $this->em->flush();
            $this->addFlash('success', 'Testimonial created successfully.');
            return $this->redirectToRoute('admin_testimonial_index');
        }

        return $this->render('admin/testimonial/create.html.twig', ['form' => $form]);
    }

    #[Route('/dashboard/testimonials/{id}/edit', name: 'admin_testimonial_edit')]
    public function editTestimonial(int $id, Request $request, FileUploader $fileUploader): Response
    {
        $testimonial = $this->em->getRepository(Testimonial::class)->find($id);
        if (!$testimonial) {
            throw $this->createNotFoundException();
        }

        $form = $this->createForm(TestimonialType::class, $testimonial);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $imageFile = $form->get('imageFile')->getData();
            if ($imageFile) {
                try {
                    $testimonial->setImage($fileUploader->upload($imageFile, 'testimonials'));
                } catch (FileException $e) {
                    $this->addFlash('error', 'Error uploading image');
                }
            }
            $this->em->flush();
            $this->addFlash('success', 'Testimonial updated successfully.');
            return $this->redirectToRoute('admin_testimonial_index');
        }

        return $this->render('admin/testimonial/edit.html.twig', [
            'form'        => $form,
            'testimonial' => $testimonial,
        ]);
    }

    #[Route('/dashboard/testimonials/{id}/delete', name: 'admin_testimonial_delete', methods: ['POST'])]
    public function deleteTestimonial(int $id, Request $request): Response
    {
        $testimonial = $this->em->getRepository(Testimonial::class)->find($id);
        if ($testimonial && $this->isCsrfTokenValid('delete' . $testimonial->getId(), $request->request->get('_token'))) {
            $this->em->remove($testimonial);
            $this->em->flush();
            $this->addFlash('success', 'Testimonial deleted successfully.');
        }
        return $this->redirectToRoute('admin_testimonial_index');
    }

    #[Route('/dashboard/testimonials/{id}/toggle-active', name: 'admin_testimonial_toggle_active', methods: ['POST'])]
    public function toggleTestimonialActive(int $id, Request $request): Response
    {
        if (!$this->isCsrfTokenValid('toggle' . $id, $request->request->get('_token'))) {
            $this->addFlash('error', 'Invalid CSRF token.');
            return $this->redirectToRoute('admin_testimonial_index');
        }

        $testimonial = $this->em->getRepository(Testimonial::class)->find($id);
        if ($testimonial) {
            $testimonial->setIsActive(!$testimonial->isIsActive());
            $this->em->flush();
            $this->addFlash('success', 'Testimonial status updated.');
        }

        return $this->redirect($request->headers->get('referer', $this->generateUrl('admin_testimonial_index')));
    }
}
