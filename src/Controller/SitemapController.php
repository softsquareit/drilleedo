<?php

namespace App\Controller;

use App\Repository\BlogRepository;
use App\Repository\CompanyRepository;
use App\Repository\ProfessionalRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

final class SitemapController extends AbstractController
{
    #[Route('/sitemap.xml', name: 'app_sitemap', defaults: ['_format' => 'xml'])]
    public function index(
        ProfessionalRepository $professionalRepository,
        CompanyRepository $companyRepository,
        BlogRepository $blogRepository
    ): Response {
        $urls = [];

        // Pages statiques
        $staticPages = [
            ['route' => 'app_home', 'params' => [], 'priority' => '1.0', 'changefreq' => 'daily'],
            ['route' => 'professionals_list', 'params' => [], 'priority' => '0.9', 'changefreq' => 'daily'],
            ['route' => 'companies_list', 'params' => [], 'priority' => '0.9', 'changefreq' => 'daily'],
            ['route' => 'smartideas', 'params' => [], 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['route' => 'contact', 'params' => [], 'priority' => '0.5', 'changefreq' => 'monthly'],
            ['route' => 'app_register', 'params' => [], 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['route' => 'app_login', 'params' => [], 'priority' => '0.5', 'changefreq' => 'monthly'],
        ];

        foreach ($staticPages as $page) {
            $urls[] = [
                'loc' => $this->generateUrl($page['route'], $page['params'], UrlGeneratorInterface::ABSOLUTE_URL),
                'lastmod' => date('Y-m-d'),
                'changefreq' => $page['changefreq'],
                'priority' => $page['priority'],
            ];
        }

        // Professionnels — tableau léger, pas de chargement complet des entités
        foreach ($professionalRepository->findForSitemap() as $pro) {
            $urls[] = [
                'loc' => $this->generateUrl('professional_details', [
                    'id' => $pro['id'],
                    'slug' => 'pro-' . $pro['id'],
                ], UrlGeneratorInterface::ABSOLUTE_URL),
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ];
        }

        // Entreprises — tableau léger
        foreach ($companyRepository->findForSitemap() as $company) {
            $slug = strtolower(str_replace(' ', '-', trim($company['company_name'] ?? 'entreprise')));
            $urls[] = [
                'loc' => $this->generateUrl('company_details', [
                    'id' => $company['id'],
                    'slug' => $slug,
                ], UrlGeneratorInterface::ABSOLUTE_URL),
                'lastmod' => isset($company['updatedAt']) ? $company['updatedAt']->format('Y-m-d') : null,
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ];
        }

        // Articles de blog (type Idea)
        foreach ($blogRepository->findBy(['type' => 'Idea']) as $idea) {
            $urls[] = [
                'loc' => $this->generateUrl('ideas_details', ['slug' => $idea->getSlug()], UrlGeneratorInterface::ABSOLUTE_URL),
                'changefreq' => 'monthly',
                'priority' => '0.6',
            ];
        }

        // Pages SEO locales
        foreach (LocalSeoController::SEO_CITIES as $slug => $name) {
            $urls[] = [
                'loc' => $this->generateUrl('city_seo_landing', ['citySlug' => $slug], UrlGeneratorInterface::ABSOLUTE_URL),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($urls as $url) {
            $xml .= '    <url>' . "\n";
            $xml .= '        <loc>' . htmlspecialchars($url['loc']) . '</loc>' . "\n";
            if (!empty($url['lastmod'])) {
                $xml .= '        <lastmod>' . $url['lastmod'] . '</lastmod>' . "\n";
            }
            if (!empty($url['changefreq'])) {
                $xml .= '        <changefreq>' . $url['changefreq'] . '</changefreq>' . "\n";
            }
            if (!empty($url['priority'])) {
                $xml .= '        <priority>' . $url['priority'] . '</priority>' . "\n";
            }
            $xml .= '    </url>' . "\n";
        }

        $xml .= '</urlset>';

        $response = new Response($xml);
        $response->headers->set('Content-Type', 'text/xml');

        // Cache 24h côté navigateur / CDN pour éviter la regénération à chaque requête
        $response->setPublic();
        $response->setMaxAge(86400);
        $response->setSharedMaxAge(86400);

        return $response;
    }
}
