<?php

namespace App\Tests\Functional;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Tests for the public /api/search endpoint.
 */
class ApiSearchTest extends WebTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->requireDatabase();
    }

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

    public function testSearchReturnsJson(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/search', ['q' => 'renovation']);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
        $this->assertArrayHasKey('professionals', $data);
        $this->assertArrayHasKey('companies', $data);
    }

    public function testSearchWithEmptyQueryReturnsValidResponse(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/search', ['q' => '']);

        $statusCode = $client->getResponse()->getStatusCode();
        $this->assertContains($statusCode, [200, 400], "Expected 200 or 400 for empty query, got $statusCode");
    }

    public function testCategoriesChildrenEndpoint(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/categories/99999/children');

        $statusCode = $client->getResponse()->getStatusCode();
        $this->assertContains($statusCode, [200, 404], "Expected 200 or 404 for unknown category, got $statusCode");

        if ($statusCode === 200) {
            $data = json_decode($client->getResponse()->getContent(), true);
            $this->assertIsArray($data);
        }
    }
}
