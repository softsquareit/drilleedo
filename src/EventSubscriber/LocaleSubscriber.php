<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Reads the user's preferred locale from the session and applies it
 * to the current request on every page load.
 */
class LocaleSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly string $defaultLocale = 'fr') {}

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        if (!$request->hasPreviousSession()) {
            return;
        }

        // If a _locale has been explicitly set on this request (e.g. route param), respect it
        if ($locale = $request->attributes->get('_locale')) {
            $request->getSession()->set('_locale', $locale);
        } else {
            // Otherwise, restore locale from session (default: fr)
            $request->setLocale(
                $request->getSession()->get('_locale', $this->defaultLocale)
            );
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            // Must run AFTER the session is initialized (priority 15)
            KernelEvents::REQUEST => [['onKernelRequest', 15]],
        ];
    }
}
