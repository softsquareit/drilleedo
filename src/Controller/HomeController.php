<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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
        $featuredProfessionals = $professionalRepository->findTopRatedByDifferentCategories(4);
        $activeTestimonials = $testimonialRepository->findActiveTestimonials(10);

        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'featuredProfessionals' => $featuredProfessionals,
            'testimonials' => $activeTestimonials,
        ]);
    }

    #[Route('/about-us', name: 'app_about')]
    public function about(): Response
    {
        return $this->render('home/about.html.twig');
    }

    #[Route('/careers', name: 'app_careers')]
    public function careers(): Response
    {
        return $this->render('home/careers.html.twig');
    }

    #[Route('/how-it-works', name: 'app_how_it_works')]
    public function howItWorks(): Response
    {
        return $this->render('home/how_it_works.html.twig');
    }

    #[Route('/receive-quotes', name: 'app_receive_quotes')]
    public function receiveQuotes(): Response
    {
        return $this->render('home/receive_quotes.html.twig');
    }

    #[Route('/project-photos', name: 'app_project_photos')]
    public function projectPhotos(): Response
    {
        return $this->render('home/project_photos.html.twig');
    }

    #[Route('/decoration-ideas', name: 'app_decoration_ideas')]
    public function decorationIdeas(): Response
    {
        return $this->render('home/decoration_ideas.html.twig');
    }

    #[Route('/completed-projects', name: 'app_completed_projects')]
    public function completedProjects(): Response
    {
        return $this->render('home/completed_projects.html.twig');
    }

    #[Route('/for-professionals', name: 'app_for_professionals')]
    public function forProfessionals(): Response
    {
        return $this->render('home/for_professionals.html.twig');
    }

    #[Route('/grow-your-business', name: 'app_grow_business')]
    public function growBusiness(): Response
    {
        return $this->render('home/grow_business.html.twig');
    }

    #[Route('/how-it-works-for-pros', name: 'app_how_it_works_pros')]
    public function howItWorksPros(): Response
    {
        return $this->render('home/how_it_works_pros.html.twig');
    }
    
    #[Route('/find-professionals', name: 'professionals_list')]
    public function professionals(
        \Symfony\Component\HttpFoundation\Request $request,
        \App\Repository\ProfessionalRepository $professionalRepository,
        \App\Repository\CategoryRepository $categoryRepository
    ): Response {
        $keyword = $request->query->get('keyword');
        $category = $request->query->get('category');
        $sort = $request->query->get('sort');
        $page = $request->query->getInt('page', 1);
        $limit = 6;

        $cities = $request->query->all('cities');
        $categoriesFilter = $request->query->all('categories');

        $professionals = $professionalRepository->search($keyword, $category, $cities, $categoriesFilter, $sort, $page, $limit);
        
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
            'activeFilters' => [
                'keyword' => $keyword,
                'category' => $category,
                'sort' => $sort,
                'categories' => $request->query->all('categories'),
                'cities' => $request->query->all('cities'),
            ],
            'categoryCounts' => $categoryCounts,
            'cityCounts' => $cityCounts,
            'currentPage' => $page,
            'totalPages' => $totalPages,
        ]);
    }
    #[Route('/renovation-companies', name: 'companies_list')]
    public function companies(
        \Symfony\Component\HttpFoundation\Request $request,
        \App\Repository\CompanyRepository $companyRepository,
        \App\Repository\CategoryRepository $categoryRepository
    ): Response {
        $filters = [
            'categories' => $request->query->all('categories'),
            'cities' => $request->query->all('cities'),
            'keyword' => $request->query->get('keyword'),
            'category' => $request->query->get('category'),
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

    #[Route('/professional/{id}/{slug}', name: 'professional_details', defaults: ['slug' => ''])]
    public function professionalDetails(
        Professional $professional,
        Request $request,
        \Doctrine\ORM\EntityManagerInterface $em,
        \App\Service\FileUploader $fileUploader
    ): Response {
        $user = $this->getUser();
        $directRequest = new \App\Entity\DirectRequest();
        $directRequest->setTargetProfessional($professional);
        
        $form = $this->createForm(\App\Form\DirectRequestType::class, $directRequest);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            if (!$this->isGranted('ROLE_INDIVIDUAL')) {
                $this->addFlash('error', 'You must be logged in as an individual to send requests.');
                return $this->redirectToRoute('professional_details', ['id' => $professional->getId()]);
            }

            $directRequest->setIndividual($user);
            $directRequest->setStatus(\App\Entity\DirectRequest::STATUS_PUBLISHED);

            // Handle Images
            $images = $form->get('images')->getData();
            if ($images) {
                $imagePaths = [];
                foreach ($images as $image) {
                    $imagePaths[] = $fileUploader->upload($image, 'quote_requests');
                }
                $directRequest->setImages($imagePaths);
            }

            $em->persist($directRequest);

            // Notification for the professional
            $notification = new \App\Entity\Notification();
            $notification->setUser($professional);
            $notification->setMessage('New direct request from ' . ($user->getPersonalInfos()?->getFirstName() ?? 'an individual') . ': ' . $directRequest->getTitle());
            $notification->setRelatedEntityId($directRequest->getId());
            $notification->setRelatedEntityType('direct_request');
            $em->persist($notification);

            $em->flush();

            $this->addFlash('success', 'Your request has been sent successfully to ' . $professional->getCompanyName());
            return $this->redirectToRoute('professional_details', ['id' => $professional->getId()]);
        }

        return $this->render('home/professional.html.twig', [
            'professional' => $professional,
            'controller_name' => 'HomeController',
            'directRequestForm' => $form->createView(),
        ]);
    }
    #[Route('/home-renovation-ideas', name: 'smartideas')]
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
        return $this->render('home/register_pro.html.twig', [
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
    #[Route('/blog', name: 'public_blog_list')]
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
    #[Route('/ideas/{slug}', name: 'ideas_details')]
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

    /**
     * Autocomplete search API for the header search overlay.
     * Returns a JSON array of matched professionals and companies.
     */
    #[Route('/api/search', name: 'api_search', methods: ['GET'])]
    public function search(
        Request $request,
        \App\Repository\ProfessionalRepository $proRepo,
        \App\Repository\CompanyRepository $coRepo
    ): JsonResponse {
        $q = trim($request->query->getString('q', ''));

        if (strlen($q) < 2) {
            return new JsonResponse([]);
        }

        $results = [];

        $professionals = $proRepo->searchByKeyword($q, 4);
        foreach ($professionals as $pro) {
            $results[] = [
                'type'     => 'pro',
                'label'    => $pro->getCompanyName() ?? $pro->getEmail(),
                'category' => $pro->getCategory()?->getName() ?? '',
                'city'     => $pro->getCity() ?? '',
                'url'      => $this->generateUrl('professional_details', ['id' => $pro->getId()]),
                'logo'     => $pro->getLogo() ? '/uploads/logos/' . $pro->getLogo() : null,
            ];
        }

        $companies = $coRepo->searchByKeyword($q, 4);
        foreach ($companies as $co) {
            $results[] = [
                'type'     => 'company',
                'label'    => $co->getCompanyName() ?? $co->getEmail(),
                'category' => 'Company',
                'city'     => '',
                'url'      => $this->generateUrl('company_details', ['id' => $co->getId()]),
                'logo'     => $co->getLogo() ? '/uploads/logos/' . $co->getLogo() : null,
            ];
        }

        return new JsonResponse(array_slice($results, 0, 8));
    }
}