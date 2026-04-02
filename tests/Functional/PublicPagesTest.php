<?php

namespace App\Tests\Functional;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Smoke tests: verify public pages return 200 and contain expected content.
 * These tests do NOT require a database connection — they only check HTTP status
 * and basic HTML structure for routes that may redirect or show login forms.
 */
class PublicPagesTest extends WebTestCase
{
    /**
     * @dataProvider publicPageProvider
     */
    public function testPublicPageIsAccessible(string $url, int $expectedStatus = 200): void
    {
        $client = static::createClient();
        $client->request('GET', $url);

        $this->assertResponseStatusCodeSame($expectedStatus);
    }

    public static function publicPageProvider(): array
    {
        return [
            'home'               => ['/'],
            'find professionals' => ['/find-professionals'],
            'companies list'     => ['/renovation-companies'],
            'contact page'       => ['/contact'],
            'login page'         => ['/login'],
            'register page'      => ['/register'],
            'register pro'       => ['/register-pro'],
            'register company'   => ['/register-company'],
            'blog list'          => ['/blogs'],
            'ideas list'         => ['/ideas'],
            'sitemap.xml'        => ['/sitemap.xml'],
        ];
    }

    public function testHomepageContainsExpectedContent(): void
    {
        $client = static::createClient();
        $client->request('GET', '/');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorExists('body');
    }

    public function testProfessionalsListReturnsHtml(): void
    {
        $client = static::createClient();
        $client->request('GET', '/find-professionals');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorExists('body');
    }

    public function testProfessionalsListWithKeywordFilter(): void
    {
        $client = static::createClient();
        $client->request('GET', '/find-professionals', ['keyword' => 'renovation']);

        $this->assertResponseIsSuccessful();
    }

    public function testCompaniesListReturnsHtml(): void
    {
        $client = static::createClient();
        $client->request('GET', '/renovation-companies');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorExists('body');
    }

    public function testLoginPageContainsForm(): void
    {
        $client = static::createClient();
        $client->request('GET', '/login');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorExists('form');
    }

    public function testSitemapIsValidXml(): void
    {
        $client = static::createClient();
        $client->request('GET', '/sitemap.xml');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('Content-Type', 'application/xml');
    }
}
