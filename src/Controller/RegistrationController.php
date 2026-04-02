<?php

namespace App\Controller;

use App\Entity\Individual;
use App\Entity\Professional;
use App\Form\RegistrationFormType;
use App\Form\ProfessionalRegistrationFormType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Service\RegistrationRateLimiter;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\SecurityBundle\Security;

class RegistrationController extends AbstractController
{
    #[Route('/register', name: 'app_register')]
    public function register(
        Request $request,
        UserPasswordHasherInterface $userPasswordHasher,
        EntityManagerInterface $entityManager,
        Security $security,
        RegistrationRateLimiter $registrationRateLimiter
    ): Response {
        // Rate limiting — 3 inscriptions par heure par IP
        if ($request->isMethod('POST')) {
            if (!$registrationRateLimiter->consume($request->getClientIp() ?? '0.0.0.0')) {
                $this->addFlash('error', 'Trop d\'inscriptions depuis cette adresse IP. Veuillez réessayer dans une heure.');
                return $this->redirectToRoute('app_register');
            }
        }

        $individual = new Individual();
        $individualForm = $this->container->get('form.factory')->createNamed('individual', RegistrationFormType::class, $individual, [
            'data_class' => Individual::class
        ]);
        $individualForm->handleRequest($request);

        if ($individualForm->isSubmitted() && $individualForm->isValid()) {
            /** @var string $plainPassword */
            $plainPassword = $individualForm->get('plainPassword')->getData();
            $individual->setPassword($userPasswordHasher->hashPassword($individual, $plainPassword));
            $entityManager->persist($individual);
            $entityManager->flush();
            $security->login($individual, 'security.authenticator.form_login.main');
            return $this->redirectToRoute('individual_dashboard');
        }

        $professional = new Professional();
        $professionalForm = $this->container->get('form.factory')->createNamed('professional', ProfessionalRegistrationFormType::class, $professional);
        $professionalForm->handleRequest($request);

        if ($professionalForm->isSubmitted() && $professionalForm->isValid()) {
            /** @var string $plainPassword */
            $plainPassword = $professionalForm->get('plainPassword')->getData();
            $professional->setPassword($userPasswordHasher->hashPassword($professional, $plainPassword));
            $entityManager->persist($professional);
            $entityManager->flush();
            $security->login($professional, 'security.authenticator.form_login.main');
            return $this->redirectToRoute('professional_dashboard');
        }

        return $this->render('registration/register.html.twig', [
            'individualForm' => $individualForm,
            'professionalForm' => $professionalForm,
        ]);
    }
}
