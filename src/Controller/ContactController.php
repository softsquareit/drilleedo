<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ContactController extends AbstractController
{
    #[Route('/contact', name: 'contact', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('home/contact.html.twig');
    }

    #[Route('/contact/send', name: 'app_contact_send', methods: ['POST'])]
    public function send(Request $request): Response
    {
        $name    = trim($request->request->getString('contact-name', ''));
        $email   = trim($request->request->getString('contact-email', ''));
        $message = trim($request->request->getString('contact-message', ''));

        if ($name === '' || $email === '' || $message === '') {
            $this->addFlash('danger', 'Please fill in all required fields (Name, Email, Message).');

            return $this->redirectToRoute('contact');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->addFlash('danger', 'Please enter a valid email address.');

            return $this->redirectToRoute('contact');
        }

        // In a real application you'd send an email or persist to DB here.
        // For now: log and show a success message.
        $this->addFlash('success', sprintf(
            'Thank you %s! Your message has been received. We\'ll get back to you at %s within 24 hours.',
            htmlspecialchars($name, ENT_QUOTES),
            htmlspecialchars($email, ENT_QUOTES)
        ));

        return $this->redirectToRoute('contact');
    }
}
