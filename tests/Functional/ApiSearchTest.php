<?php

namespace App\Tests\Functional;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Tests for the public /api/search endpoint.
 */
class ApiSearchTest extends WebTestCase
{
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

    public function testSearchWithEmptyQueryReturnsJson(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/search', ['q' => '']);

        // Should return 200 with empty results or 400, not 500
        $this->assertResponseStatusCodeSame(
            in_array($client->getResponse()->getStatusCode(), [200, 400]) ? $client->getResponse()->getStatusCode() : 200
        );
    }

    public function testCategoriesChildrenEndpoint(): void
    {
        $client = static::createClient();
        // Request children for a non-existent category — should return 200 with empty array or 404
        $client->request('GET', '/api/categories/99999/children');

        $statusCode = $client->getResponse()->getStatusCode();
        $this->assertContains($statusCode, [200, 404], "Expected 200 or 404 for unknown category, got $statusCode");

        if ($statusCode === 200) {
            $data = json_decode($client->getResponse()->getContent(), true);
            $this->assertIsArray($data);
        }
    }
}
