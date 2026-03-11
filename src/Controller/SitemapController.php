<?php

namespace App\Controller;

use App\Repository\ProfessionalRepository;
use App\Repository\CompanyRepository;
use App\Repository\BlogRepository;
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
        $hostname = $this->getParameter('router.request_context.host');
        // Fallback for CLI/local if host is empty
        if (empty($hostname) || $hostname === 'localhost') {
            $hostname = "https://www.drilleedo.com"; // Adjust protocol/domain as needed for production
        } else {
            $scheme = $this->getParameter('router.request_context.scheme') ?: 'https';
            $hostname = $scheme . '://' . $hostname;
        }

        // Static Pages
        $urls[] = ['loc' => $this->generateUrl('app_home', [], UrlGeneratorInterface::ABSOLUTE_URL), 'priority' => '1.0'];
        $urls[] = ['loc' => $this->generateUrl('professionals_list', [], UrlGeneratorInterface::ABSOLUTE_URL), 'priority' => '0.8'];
        $urls[] = ['loc' => $this->generateUrl('companies_list', [], UrlGeneratorInterface::ABSOLUTE_URL), 'priority' => '0.8'];
        $urls[] = ['loc' => $this->generateUrl('contact', [], UrlGeneratorInterface::ABSOLUTE_URL), 'priority' => '0.5'];
        $urls[] = ['loc' => $this->generateUrl('smartideas', [], UrlGeneratorInterface::ABSOLUTE_URL), 'priority' => '0.8'];
        $urls[] = ['loc' => $this->generateUrl('app_register', [], UrlGeneratorInterface::ABSOLUTE_URL), 'priority' => '0.7'];
        $urls[] = ['loc' => $this->generateUrl('app_login', [], UrlGeneratorInterface::ABSOLUTE_URL), 'priority' => '0.7'];

        // Dynamic Pages: Professionals
        foreach ($professionalRepository->findAll() as $pro) {
            $urls[] = [
                'loc' => $this->generateUrl('professional_details', ['id' => $pro->getId(), 'slug' => 'prio-' . $pro->getId()], UrlGeneratorInterface::ABSOLUTE_URL),
                'priority' => '0.7'
            ];
        }

        // Dynamic Pages: Companies
        foreach ($companyRepository->findAll() as $company) {
            $urls[] = [
                'loc' => $this->generateUrl('company_details', ['id' => $company->getId()], UrlGeneratorInterface::ABSOLUTE_URL),
                'priority' => '0.7'
            ];
        }

        // Dynamic Pages: Ideas (Blog posts of type Idea)
        foreach ($blogRepository->findBy(['type' => 'Idea']) as $idea) {
            $urls[] = [
                'loc' => $this->generateUrl('ideas_details', ['slug' => $idea->getSlug()], UrlGeneratorInterface::ABSOLUTE_URL),
                'priority' => '0.6'
            ];
        }

        // Dynamic Pages: City SEO Landing Pages
        foreach (\App\Controller\LocalSeoController::SEO_CITIES as $slug => $name) {
            $urls[] = [
                'loc' => $this->generateUrl('city_seo_landing', ['citySlug' => $slug], UrlGeneratorInterface::ABSOLUTE_URL),
                'priority' => '0.8'
            ];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
        $xml .= 'xmlns:xhtml="http://www.w3.org/1999/xhtml" ';
        $xml .= 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" ';
        $xml .= 'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">' . "\n";

        foreach ($urls as $url) {
            $xml .= '    <url>' . "\n";
            $xml .= '        <loc>' . htmlspecialchars($url['loc']) . '</loc>' . "\n";
            if (isset($url['priority'])) {
                $xml .= '        <priority>' . $url['priority'] . '</priority>' . "\n";
            }
            $xml .= '    </url>' . "\n";
        }

        $xml .= '</urlset>';

        $response = new Response($xml);
        $response->headers->set('Content-Type', 'text/xml');

        return $response;
    }
}
