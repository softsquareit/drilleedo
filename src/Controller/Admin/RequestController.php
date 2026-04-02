<?php

namespace App\Controller\Admin;

use App\Entity\DirectRequest;
use App\Entity\QuoteRequest;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
class RequestController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em) {}

    #[Route('/dashboard/requests', name: 'admin_request_index')]
    public function listRequests(): Response
    {
        return $this->render('admin/request/index.html.twig', [
            'username'       => $this->getUser()->getUserIdentifier(),
            'quoteRequests'  => $this->em->getRepository(QuoteRequest::class)->findBy([], ['creationDate' => 'DESC']),
            'directRequests' => $this->em->getRepository(DirectRequest::class)->findBy([], ['creationDate' => 'DESC']),
        ]);
    }

    #[Route('/dashboard/requests/quote/{id}', name: 'admin_quote_request_show')]
    public function showQuoteRequest(QuoteRequest $request): Response
    {
        return $this->render('admin/request/show.html.twig', [
            'username' => $this->getUser()->getUserIdentifier(),
            'request'  => $request,
            'type'     => 'quote',
        ]);
    }

    #[Route('/dashboard/requests/direct/{id}', name: 'admin_direct_request_show')]
    public function showDirectRequest(DirectRequest $request): Response
    {
        return $this->render('admin/request/show.html.twig', [
            'username' => $this->getUser()->getUserIdentifier(),
            'request'  => $request,
            'type'     => 'direct',
        ]);
    }
}
