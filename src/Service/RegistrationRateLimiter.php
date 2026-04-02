<?php

namespace App\Service;

use Symfony\Component\RateLimiter\RateLimiterFactory;

class RegistrationRateLimiter
{
    public function __construct(
        // Symfony 7.x : le nom du paramètre doit correspondre à l'alias
        // "registration_limiter" → $registrationLimiterLimiter
        private RateLimiterFactory $registrationLimiterLimiter,
    ) {
    }

    /**
     * Consomme 1 jeton pour l'IP donnée.
     * Retourne true si la requête est acceptée, false si la limite est atteinte.
     */
    public function consume(string $ip): bool
    {
        return $this->registrationLimiterLimiter->create($ip)->consume(1)->isAccepted();
    }
}
