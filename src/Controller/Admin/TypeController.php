<?php

namespace App\Controller\Admin;

use App\Entity\Type;
use App\Form\TypeType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
class TypeController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em) {}

    #[Route('/dashboard/types', name: 'admin_type_index')]
    public function listTypes(Request $request): Response
    {
        $username = $this->getUser()->getUserIdentifier();
        $type = new Type();
        $form = $this->createForm(TypeType::class, $type);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($type);
            $this->em->flush();
            return $this->redirectToRoute('admin_type_index');
        }

        return $this->render('admin/type/index.html.twig', [
            'username' => $username,
            'types'    => $this->em->getRepository(Type::class)->findAll(),
            'form'     => $form,
        ]);
    }

    #[Route('/dashboard/types/create', name: 'admin_type_create')]
    public function createType(Request $request): Response
    {
        $type = new Type();
        $form = $this->createForm(TypeType::class, $type);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($type);
            $this->em->flush();
            return $this->redirectToRoute('admin_type_index');
        }

        return $this->render('admin/type/create.html.twig', ['form' => $form]);
    }

    #[Route('/dashboard/types/{id}/edit', name: 'admin_type_edit')]
    public function editType(int $id, Request $request): Response
    {
        $type = $this->em->getRepository(Type::class)->find($id);
        if (!$type) {
            throw $this->createNotFoundException();
        }

        if ($request->isMethod('POST')) {
            $data = $request->request->all('type');
            $type->setType($data['Type'] ?? '');
            $this->em->flush();
            $this->addFlash('success', 'Type updated successfully.');
            return $this->redirectToRoute('admin_type_index');
        }

        return $this->render('admin/type/edit.html.twig', [
            'form' => $this->createForm(TypeType::class, $type, ['csrf_protection' => false]),
        ]);
    }

    #[Route('/dashboard/types/{id}/delete', name: 'admin_type_delete', methods: ['POST'])]
    public function deleteType(int $id, Request $request): Response
    {
        $type = $this->em->getRepository(Type::class)->find($id);
        if ($type && $this->isCsrfTokenValid('delete' . $type->getId(), $request->request->get('_token'))) {
            $this->em->remove($type);
            $this->em->flush();
            $this->addFlash('success', 'Type successfully deleted.');
        }
        return $this->redirectToRoute('admin_type_index');
    }
}
