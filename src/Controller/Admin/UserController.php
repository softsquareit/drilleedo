<?php

namespace App\Controller\Admin;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher,
    ) {}

    #[Route('/dashboard/users', name: 'admin_user_index')]
    public function listUsers(): Response
    {
        return $this->render('admin/user/index.html.twig', [
            'username' => $this->getUser()->getUserIdentifier(),
            'users'    => $this->em->getRepository(User::class)->findAll(),
        ]);
    }

    #[Route('/dashboard/users/{id}/delete', name: 'admin_user_delete', methods: ['POST'])]
    public function deleteUser(int $id, Request $request): Response
    {
        $user = $this->em->getRepository(User::class)->find($id);
        if ($user && $this->isCsrfTokenValid('delete' . $user->getId(), $request->request->get('_token'))) {
            if ($user === $this->getUser()) {
                $this->addFlash('error', 'You cannot delete your own account.');
                return $this->redirectToRoute('admin_user_index');
            }
            $this->em->remove($user);
            $this->em->flush();
            $this->addFlash('success', 'User deleted successfully.');
        }
        return $this->redirectToRoute('admin_user_index');
    }

    #[Route('/dashboard/users/{id}/change-password', name: 'admin_user_change_password', methods: ['POST'])]
    public function changeUserPassword(int $id, Request $request): Response
    {
        $user = $this->em->getRepository(User::class)->find($id);
        if (!$user) {
            throw $this->createNotFoundException('User not found');
        }

        $newPassword = $request->request->get('new_password');
        if (!empty($newPassword)) {
            $user->setPassword($this->passwordHasher->hashPassword($user, $newPassword));
            $this->em->flush();
            $this->addFlash('success', 'Password changed successfully for ' . $user->getEmail());
        } else {
            $this->addFlash('error', 'Password cannot be empty.');
        }

        return $this->redirect($request->headers->get('referer'));
    }
}
