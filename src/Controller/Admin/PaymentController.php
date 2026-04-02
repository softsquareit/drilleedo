<?php

namespace App\Controller\Admin;

use App\Entity\PaymentMethod;
use App\Form\PaymentMethodType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
class PaymentController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em) {}

    #[Route('/dashboard/payments', name: 'admin_payment_index')]
    public function listPayments(Request $request): Response
    {
        $username = $this->getUser()->getUserIdentifier();
        $paymentMethod = new PaymentMethod();
        $form = $this->createForm(PaymentMethodType::class, $paymentMethod);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($paymentMethod);
            $this->em->flush();
            return $this->redirectToRoute('admin_payment_index');
        }

        return $this->render('admin/payment/index.html.twig', [
            'username'        => $username,
            'payment_methods' => $this->em->getRepository(PaymentMethod::class)->findAll(),
            'form'            => $form,
        ]);
    }

    #[Route('/dashboard/payments/create', name: 'admin_payment_create')]
    public function createPaymentMethod(Request $request): Response
    {
        $paymentMethod = new PaymentMethod();
        $form = $this->createForm(PaymentMethodType::class, $paymentMethod);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($paymentMethod);
            $this->em->flush();
            return $this->redirectToRoute('admin_payment_index');
        }

        return $this->render('admin/payment/create.html.twig', ['form' => $form]);
    }

    #[Route('/dashboard/payments/{id}/edit', name: 'admin_payment_edit')]
    public function editPaymentMethod(int $id, Request $request): Response
    {
        $paymentMethod = $this->em->getRepository(PaymentMethod::class)->find($id);
        if (!$paymentMethod) {
            throw $this->createNotFoundException();
        }

        if ($request->isMethod('POST')) {
            $data = $request->request->all('payment_method');
            $paymentMethod->setName($data['name'] ?? '');
            $this->em->flush();
            $this->addFlash('success', 'Payment method updated successfully.');
            return $this->redirectToRoute('admin_payment_index');
        }

        return $this->render('admin/payment/edit.html.twig', [
            'form' => $this->createForm(PaymentMethodType::class, $paymentMethod, ['csrf_protection' => false]),
        ]);
    }

    #[Route('/dashboard/payments/{id}/delete', name: 'admin_payment_delete', methods: ['POST'])]
    public function deletePaymentMethod(int $id, Request $request): Response
    {
        $paymentMethod = $this->em->getRepository(PaymentMethod::class)->find($id);
        if ($paymentMethod && $this->isCsrfTokenValid('delete' . $paymentMethod->getId(), $request->request->get('_token'))) {
            $this->em->remove($paymentMethod);
            $this->em->flush();
            $this->addFlash('success', 'Payment method successfully deleted.');
        }
        return $this->redirectToRoute('admin_payment_index');
    }
}
