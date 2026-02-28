<?php

namespace App\Controller;

use App\Entity\Company;
use App\Entity\Category;
use App\Repository\CompanyRepository;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CompanyListController extends AbstractController
{
    #[Route('/companies', name: 'companies_list')]
    public function index(Request $request, CompanyRepository $companyRepository, CategoryRepository $categoryRepository): Response
    {
        $categoryId = $request->query->get('category');
        $location = $request->query->get('location');
        
        $queryBuilder = $companyRepository->createQueryBuilder('co')
            ->leftJoin('co.categories', 'ca')
            ->leftJoin('co.Adresse', 'ad')
            ->addSelect('ca', 'ad');

        if ($categoryId) {
            $queryBuilder->andWhere('ca.id = :categoryId')
                ->setParameter('categoryId', $categoryId);
        }

        if ($location) {
            $queryBuilder->andWhere('ad.city LIKE :location')
                ->setParameter('location', '%' . $location . '%');
        }

        $companies = $queryBuilder->getQuery()->getResult();
        
        // Fetch categories that have companies
        $categories = $categoryRepository->createQueryBuilder('c')
            ->innerJoin('c.companies', 'co')
            ->distinct()
            ->getQuery()
            ->getResult();

        return $this->render('company/public_list.html.twig', [
            'companies' => $companies,
            'categories' => $categories,
            'currentCategory' => $categoryId,
            'currentLocation' => $location,
        ]);
    }

    #[Route('/companies/{id}', name: 'company_show')]
    public function show(Company $company): Response
    {
        return $this->render('company/public_show.html.twig', [
            'company' => $company,
        ]);
    }
}
