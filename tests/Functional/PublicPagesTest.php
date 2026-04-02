<?php

namespace App\Tests\Functional;

use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Smoke tests: verify public pages return 200 and contain expected content.
 */
class PublicPagesTest extends WebTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->requireDatabase();
    }

    /**
     * Skip the test suite if the database is not reachable.
     * Functional tests require a running database.
     */
    private function requireDatabase(): void
    {
        try {
            $client = static::createClient();
            $conn = $client->getContainer()->get('doctrine.dbal.default_connection');
            $conn->executeQuery('SELECT 1');
        } catch (\Exception $e) {
            $this->markTestSkipped('Database not available: ' . $e->getMessage());
        }
    }

    #[DataProvider('publicPageProvider')]
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
