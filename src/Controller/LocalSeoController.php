<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\ProfessionalRepository;
use App\Repository\CategoryRepository;

final class LocalSeoController extends AbstractController
{
    /**
     * Define the major cities we explicitly support for SEO routes.
     */
    const SEO_CITIES = [
        'toronto'     => 'Toronto',
        'montreal'    => 'Montreal',
        'vancouver'   => 'Vancouver',
        'calgary'     => 'Calgary',
        'ottawa'      => 'Ottawa',
        'edmonton'    => 'Edmonton',
        'mississauga' => 'Mississauga',
        'winnipeg'    => 'Winnipeg',
        'quebec-city' => 'Québec City',
        'hamilton'    => 'Hamilton',
    ];

    // ──────────────────────────────────────────────
    // City Landing Pages
    // ──────────────────────────────────────────────

    #[Route('/{citySlug}-renovations', name: 'city_seo_landing', requirements: ['citySlug' => '[a-z0-9-]+'])]
    public function cityLanding(
        string $citySlug,
        Request $request,
        ProfessionalRepository $professionalRepository
    ): Response {
        $citySlugLower = strtolower($citySlug);

        if (!array_key_exists($citySlugLower, self::SEO_CITIES)) {
            throw $this->createNotFoundException('City landing page not found.');
        }

        $cityName      = self::SEO_CITIES[$citySlugLower];
        $filters       = ['cities' => [$cityName]];
        $professionals = $professionalRepository->findByFilters($filters, 1, 12);
        $totalResults  = count($professionals);

        return $this->render('home/city_landing.html.twig', [
            'cityName'     => $cityName,
            'citySlug'     => $citySlugLower,
            'professionals' => $professionals,
            'totalResults'  => $totalResults,
        ]);
    }

    // ──────────────────────────────────────────────
    // Service Category Landing Pages
    // ──────────────────────────────────────────────

    #[Route('/services/{categorySlug}', name: 'service_category_landing', requirements: ['categorySlug' => '[a-z0-9-]+'])]
    public function categoryLanding(
        string $categorySlug,
        Request $request,
        CategoryRepository $categoryRepository,
        ProfessionalRepository $professionalRepository
    ): Response {
        // Fetch all categories to find a match by slug
        $allCategories = $categoryRepository->findBy([], ['name' => 'ASC']);
        $category = null;
        $slugger = new \Symfony\Component\String\Slugger\AsciiSlugger();

        foreach ($allCategories as $cat) {
            $catSlug = strtolower($slugger->slug($cat->getName())->toString());
            if ($catSlug === $categorySlug) {
                $category = $cat;
                break;
            }
        }

        if (!$category) {
            throw $this->createNotFoundException('Service category not found.');
        }

        // --- Filtering & Pagination Logic (Mirroring HomeController::professionals) ---
        $page = $request->query->getInt('page', 1);
        $limit = 6;
        $keyword = $request->query->get('keyword');
        $sort = $request->query->get('sort');
        $cities = $request->query->all('cities');

        // Gather category IDs: parent + all children for logic
        $categoryIds = [$category->getId()];
        foreach ($category->getChilds() as $child) {
            $categoryIds[] = $child->getId();
        }

        // We use the same search method as the general list but restricted to these categories
        $professionals = $professionalRepository->search($keyword, null, $cities, $categoryIds, $sort, $page, $limit);
        
        $totalResults = count($professionals);
        $totalPages = ceil($totalResults / $limit);

        // Data for sidebars and bars
        $allCities = $professionalRepository->findAllCities();
        $categoryCounts = $professionalRepository->countPerCategory();
        $cityCounts = $professionalRepository->countPerCity();

        return $this->render('home/service_category.html.twig', [
            'category'      => $category,
            'categorySlug'  => $categorySlug,
            'professionals' => $professionals,
            'allCategories' => $allCategories,
            'allCities'     => $allCities,
            'categoryCounts'=> $categoryCounts,
            'cityCounts'    => $cityCounts,
            'activeFilters' => [
                'keyword'    => $keyword,
                'category'   => $category->getId(),
                'sort'       => $sort,
                'cities'     => $cities,
                'categories' => [$category->getId()],
            ],
            'currentPage'   => $page,
            'totalPages'    => $totalPages,
            'totalResults'  => $totalResults,
        ]);
    }
}

