<?php

namespace App\Tests\Functional;

use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Verify that all admin routes are protected — unauthenticated visitors
 * must be redirected to the login page (HTTP 302).
 *
 * These tests do NOT require a database connection: the firewall fires
 * before any Doctrine query is executed.
 */
class AdminAccessTest extends WebTestCase
{
    #[DataProvider('adminRouteProvider')]
    public function testAdminRouteRedirectsToLogin(string $url): void
    {
        $client = static::createClient();
        $client->request('GET', $url);

        $this->assertResponseRedirects('/login');
    }

    public static function adminRouteProvider(): array
    {
        return [
            'dashboard'         => ['/dashboard'],
            'blog list'         => ['/dashboard/blogs'],
            'category list'     => ['/dashboard/categories'],
            'company list'      => ['/dashboard/companies'],
            'individual list'   => ['/dashboard/individuals'],
            'professional list' => ['/dashboard/professionals'],
            'testimonial list'  => ['/dashboard/testimonials'],
            'user list'         => ['/dashboard/users'],
            'request list'      => ['/dashboard/requests'],
            'payment list'      => ['/dashboard/payments'],
        ];
    }
}
