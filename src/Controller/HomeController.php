<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Professional;
final class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(
        \App\Repository\ProfessionalRepository $professionalRepository,
        \App\Repository\TestimonialRepository $testimonialRepository
    ): Response {
        $featuredProfessionals = $professionalRepository->findTopRatedByDifferentCategories(3);
        $activeTestimonials = $testimonialRepository->findActiveTestimonials(10);

        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'featuredProfessionals' => $featuredProfessionals,
            'testimonials' => $activeTestimonials,
        ]);
    }
    
    #[Route('/professionals', name: 'professionals_list')]
    public function professionals(
        \Symfony\Component\HttpFoundation\Request $request,
        \App\Repository\ProfessionalRepository $professionalRepository,
        \App\Repository\CategoryRepository $categoryRepository
    ): Response {
        $filters = [
            'categories' => $request->query->all('categories'),
            'cities' => $request->query->all('cities'),
        ];
        
        $page = $request->query->getInt('page', 1);
        $limit = 6; // 6 professionals per page (2 rows of 3)

        $professionals = $professionalRepository->findByFilters($filters, $page, $limit);
        
        // Paginator object counts the total items correctly
        $totalProfessionals = count($professionals); 
        $totalPages = ceil($totalProfessionals / $limit);

        $allCategories = $categoryRepository->findBy([], ['name' => 'ASC']);
        $allCities = $professionalRepository->findAllCities();

        $categoryCounts = $professionalRepository->countPerCategory();
        $cityCounts = $professionalRepository->countPerCity();

        return $this->render('home/professionals.html.twig', [
            'controller_name' => 'HomeController',
            'professionals' => $professionals,
            'allCategories' => $allCategories,
            'allCities' => $allCities,
            'activeFilters' => $filters,
            'categoryCounts' => $categoryCounts,
            'cityCounts' => $cityCounts,
            'currentPage' => $page,
            'totalPages' => $totalPages,
        ]);
    }
    #[Route('/companies-list', name: 'companies_list')]
    public function companies(
        \Symfony\Component\HttpFoundation\Request $request,
        \App\Repository\CompanyRepository $companyRepository,
        \App\Repository\CategoryRepository $categoryRepository
    ): Response {
        $filters = [
            'categories' => $request->query->all('categories'),
            'cities' => $request->query->all('cities'),
        ];
        
        $page = $request->query->getInt('page', 1);
        $limit = 6;

        $companies = $companyRepository->findByFilters($filters, $page, $limit);
        
        $totalCompanies = count($companies); 
        $totalPages = ceil($totalCompanies / $limit);

        $allCategories = $categoryRepository->findBy([], ['name' => 'ASC']);
        $allCities = $companyRepository->findAllCities();

        $categoryCounts = $companyRepository->countPerCategory();
        $cityCounts = $companyRepository->countPerCity();

        return $this->render('home/companies.html.twig', [
            'controller_name' => 'HomeController',
            'companies' => $companies,
            'allCategories' => $allCategories,
            'allCities' => $allCities,
            'activeFilters' => $filters,
            'categoryCounts' => $categoryCounts,
            'cityCounts' => $cityCounts,
            'currentPage' => $page,
            'totalPages' => $totalPages,
        ]);
    }

    #[Route('/company/{id}', name: 'company_details')]
    public function companyDetails(\App\Entity\Company $company): Response
    {
        return $this->render('home/company.html.twig', [
            'company' => $company,
            'controller_name' => 'HomeController',
        ]);
    }

    #[Route('/contact', name: 'contact')]
    public function contact(): Response
    {
        return $this->render('home/contact.html.twig');
    }

    #[Route('/professional-details/{id}', name: 'professional_details')]
    public function professionalDetails(Professional $professional): Response
    {
        // $professional is automatically fetched by Doctrine ParamConverter
        // If not found, a 404 is thrown automatically

        return $this->render('home/professional.html.twig', [
            'professional' => $professional,
            'controller_name' => 'HomeController',
        ]);
    }
    #[Route('/smartideas', name: 'smartideas')]
    public function smartideas(Request $request, \App\Repository\BlogRepository $blogRepository): Response
    {
        $page = $request->query->getInt('page', 1);
        $limit = 6;
        $ideas = $blogRepository->findPaginatedByType('Idea', $page, $limit);
        
        $totalIdeas = count($ideas);
        $totalPages = ceil($totalIdeas / $limit);
        $ideasArray = iterator_to_array($ideas->getIterator());

        return $this->render('home/smartideas.html.twig', [
            'ideas' => $ideasArray,
            'currentPage' => $page,
            'totalPages' => $totalPages,
        ]);
    }

    #[Route('/login', name: 'app_login')]
    public function login(): Response
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
    #[Route('/register', name: 'app_register')]
    public function register(): Response
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
    #[Route('/register-pro', name: 'app_register_pro')]
    public function registerPro(): Response
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
    #[Route('/register-company', name: 'app_register_company')]
    public function registerCompany(): Response
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
    #[Route('/public-blog-list', name: 'public_blog_list')]
    public function publicBlogList(): Response
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
    #[Route('/public-blog-details', name: 'public_blog_details')]
    public function publicBlogDetails(): Response
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
    #[Route('/packages', name: 'packages')]
    public function packages(): Response
    {
        return $this->render('home/packages.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
    #[Route('/smartideas/{slug}', name: 'ideas_details')]
    public function ideasDetails(string $slug, \App\Repository\BlogRepository $blogRepository): Response
    {
        $idea = $blogRepository->findOneBy(['slug' => $slug, 'type' => 'Idea']);
        
        if (!$idea) {
            throw $this->createNotFoundException('L\'article demandé n\'existe pas.');
        }

        $similarIdeas = $blogRepository->findSimilarByType('Idea', $idea->getId(), 3);

        return $this->render('home/ideas-details.html.twig', [
            'idea' => $idea,
            'similarIdeas' => $similarIdeas,
            'controller_name' => 'HomeController',
        ]);
    }
}