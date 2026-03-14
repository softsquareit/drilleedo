<?php

namespace App\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class AppExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('format_response_time', [$this, 'formatResponseTime']),
        ];
    }

    public function formatResponseTime(?int $seconds): string
    {
        if ($seconds === null || $seconds <= 0) {
            return '24 hours';
        }

        if ($seconds < 60) {
            return 'less than a minute';
        }

        if ($seconds < 3600) {
            $minutes = round($seconds / 60);
            return $minutes . ' ' . ($minutes > 1 ? 'minutes' : 'minute');
        }

        if ($seconds < 86400) {
            $hours = round($seconds / 3600);
            return $hours . ' ' . ($hours > 1 ? 'hours' : 'hour');
        }

        $days = round($seconds / 86400);
        return $days . ' ' . ($days > 1 ? 'days' : 'day');
    }
}
