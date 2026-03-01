<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Http\Event\LoginSuccessEvent;

class LoginSuccessSubscriber implements EventSubscriberInterface
{
    private UrlGeneratorInterface $urlGenerator;

    public function __construct(UrlGeneratorInterface $urlGenerator)
    {
        $this->urlGenerator = $urlGenerator;
    }

    public function onLoginSuccess(LoginSuccessEvent $event): void
    {
        $user = $event->getUser();
        $roles = $user->getRoles();

        if (in_array('ROLE_ADMIN', $roles, true)) {
            $response = new RedirectResponse($this->urlGenerator->generate('admin_dashboard'));
        } elseif (in_array('ROLE_PROFESSIONAL', $roles, true) || in_array('ROLE_BUSINESS', $roles, true)) {
            $response = new RedirectResponse($this->urlGenerator->generate('professional_dashboard'));
        } elseif (in_array('ROLE_INDIVIDUAL', $roles, true)) {
            $response = new RedirectResponse($this->urlGenerator->generate('individual_dashboard'));
        } else {
            $response = new RedirectResponse($this->urlGenerator->generate('home'));
        }

        $event->setResponse($response);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            LoginSuccessEvent::class => 'onLoginSuccess',
        ];
    }
}
