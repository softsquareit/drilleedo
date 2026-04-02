<?php

namespace App\Tests\Functional;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Verify that all admin routes are protected — unauthenticated visitors
 * must be redirected to the login page (HTTP 302).
 */
class AdminAccessTest extends WebTestCase
{
    /**
     * @dataProvider adminRouteProvider
     */
    public function testAdminRouteRedirectsToLogin(string $url): void
    {
        $client = static::createClient();
        $client->request('GET', $url);

        // Must not be accessible — expect redirect to login
        $this->assertResponseRedirects('/login');
    }

    public static function adminRouteProvider(): array
    {
        return [
            'dashboard'              => ['/dashboard'],
            'blog list'              => ['/dashboard/blog/'],
            'blog new'               => ['/dashboard/blog/new'],
            'category list'          => ['/dashboard/categories/'],
            'company list'           => ['/dashboard/companies/'],
            'individual list'        => ['/dashboard/individuals/'],
            'professional list'      => ['/dashboard/professionals/'],
            'testimonial list'       => ['/dashboard/testimonials/'],
            'user list'              => ['/dashboard/users/'],
            'request list'           => ['/dashboard/requests/'],
            'payment list'           => ['/dashboard/payments/'],
        ];
    }
}
