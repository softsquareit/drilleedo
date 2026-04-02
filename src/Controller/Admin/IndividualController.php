<?php

namespace App\Controller\Admin;

use App\Entity\Individual;
use App\Form\ChangePasswordType;
use App\Form\IndividualType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
class IndividualController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher,
    ) {}

    #[Route('/dashboard/individuals', name: 'admin_individual_index')]
    public function listIndividuals(Request $request): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser->getUserIdentifier();
        $individual = new Individual();
        $form = $this->createForm(IndividualType::class, $individual);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($individual);
            $this->em->flush();

            return $this->redirectToRoute('admin_individual_index');
        }

        return $this->render('admin/individual/index.html.twig', [
            'username' => $username,
            'individuals' => $this->em->getRepository(Individual::class)->findAll(),
            'form' => $form,
        ]);
    }

    #[Route('/dashboard/individuals/create', name: 'admin_individual_create')]
    public function createIndividual(Request $request): Response
    {
        $individual = new Individual();
        $form = $this->createForm(IndividualType::class, $individual);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($individual);
            $this->em->flush();

            return $this->redirectToRoute('admin_individual_index');
        }

        // If form is not valid or not submitted, we still redirect to index
        // because creation is handled via modal on index page.
        // Errors would ideally be flashed or handled via AJAX, but for now strict redirect.
        return $this->redirectToRoute('admin_individual_index');
    }

    #[Route('/dashboard/individuals/{id}/edit', name: 'admin_individual_edit')]
    public function editIndividual(int $id, Request $request): Response
    {
        $individual = $this->em->getRepository(Individual::class)->find($id);
        if (!$individual) {
            throw $this->createNotFoundException();
        }

        $form = $this->createForm(IndividualType::class, $individual);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->flush();
            $this->addFlash('success', 'Individual profile updated successfully.');
            return $this->redirectToRoute('admin_individual_edit', ['id' => $id]);
        }

        $passwordForm = $this->createForm(ChangePasswordType::class);
        $passwordForm->handleRequest($request);

        if ($passwordForm->isSubmitted() && $passwordForm->isValid()) {
            $plainPassword = $passwordForm->get('plainPassword')->getData();
            if ($plainPassword) {
                $hashedPassword = $this->passwordHasher->hashPassword($individual, $plainPassword);
                $individual->setPassword($hashedPassword);
                $this->em->flush();
                $this->addFlash('success', 'User password updated successfully.');
                return $this->redirectToRoute('admin_individual_edit', ['id' => $id]);
            }
        }

        return $this->render('admin/individual/edit.html.twig', [
            'form' => $form->createView(),
            'passwordForm' => $passwordForm->createView(),
            'individual' => $individual,
        ]);
    }

    #[Route('/dashboard/individuals/{id}/delete', name: 'admin_individual_delete', methods: ['POST'])]
    public function deleteIndividual(int $id): Response
    {
        $individual = $this->em->getRepository(Individual::class)->find($id);
        if ($individual) {
            $this->em->remove($individual);
            $this->em->flush();
        }

        return $this->redirectToRoute('admin_individual_index');
    }
}
