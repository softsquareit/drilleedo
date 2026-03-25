<?php

namespace App\Repository;

use App\Entity\Company;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Company>
 */
class CompanyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Company::class);
    }

    /**
     * @param array $filters An array of filters (e.g., ['categories' => [1, 2], 'cities' => ['Montreal'], 'keyword' => '...', 'category' => '...'])
     * @param int $page The current page number
     * @param int $limit The maximum number of results per page
     * @return \Doctrine\ORM\Tools\Pagination\Paginator Returns a Paginator object
     */
    public function findByFilters(array $filters, int $page = 1, int $limit = 6): \Doctrine\ORM\Tools\Pagination\Paginator
    {
        $qb = $this->createQueryBuilder('c')
            ->leftJoin('c.categories', 'cat')
            ->leftJoin('c.Adresse', 'a');
        
        if (!empty($filters['keyword'])) {
            $qb->andWhere('c.company_name LIKE :keyword OR cat.name LIKE :keyword OR a.city LIKE :keyword')
               ->setParameter('keyword', '%' . $filters['keyword'] . '%');
        }

        // Single category (from top pills)
        if (!empty($filters['category']) && $filters['category'] !== 'all') {
            $qb->andWhere('cat.slug = :single_cat OR cat.id = :single_cat')
               ->setParameter('single_cat', $filters['category']);
        }

        // Multiple categories (from sidebar)
        if (!empty($filters['categories'])) {
            $qb->andWhere('cat.id IN (:sidebar_categories)')
               ->setParameter('sidebar_categories', $filters['categories']);
        }

        if (!empty($filters['cities'])) {
            $qb->andWhere('a.city IN (:cities)')
               ->setParameter('cities', $filters['cities']);
        }

        $qb->orderBy('c.id', 'DESC')
           ->setFirstResult(($page - 1) * $limit)
           ->setMaxResults($limit);

        return new \Doctrine\ORM\Tools\Pagination\Paginator($qb->getQuery());
    }

    /**
     * @return array Returns an array of distinct cities
     */
    public function findAllCities(): array
    {
        return $this->createQueryBuilder('c')
            ->select('DISTINCT a.city')
            ->join('c.Adresse', 'a')
            ->where('a.city IS NOT NULL')
            ->orderBy('a.city', 'ASC')
            ->getQuery()
            ->getSingleColumnResult();
    }

    /**
     * @return array Returns an associative array of category ID => count
     */
    public function countPerCategory(): array
    {
        $results = $this->createQueryBuilder('c')
            ->select('cat.id as catId, COUNT(c.id) as total')
            ->join('c.categories', 'cat')
            ->groupBy('cat.id')
            ->getQuery()
            ->getArrayResult();

        $counts = [];
        foreach ($results as $row) {
            $counts[$row['catId']] = (int)$row['total'];
        }
        return $counts;
    }

    /**
     * @return array Returns an associative array of city => count
     */
    public function countPerCity(): array
    {
        $results = $this->createQueryBuilder('c')
            ->select('a.city, COUNT(c.id) as total')
            ->join('c.Adresse', 'a')
            ->where('a.city IS NOT NULL')
            ->groupBy('a.city')
            ->getQuery()
            ->getArrayResult();

        $counts = [];
        foreach ($results as $row) {
            $counts[$row['city']] = (int)$row['total'];
        }
        return $counts;
    }

    /**
     * Search companies by keyword across name and city.
     *
     * @param string $q The search keyword
     * @param int $limit Max results to return
     * @return array
     */
    public function searchByKeyword(string $q, int $limit = 6): array
    {
        $qb = $this->createQueryBuilder('c')
            ->leftJoin('c.Adresse', 'a')
            ->where('c.company_name LIKE :q')
            ->orWhere('c.email LIKE :q')
            ->orWhere('a.city LIKE :q')
            ->setParameter('q', '%' . $q . '%')
            ->setMaxResults($limit)
            ->orderBy('c.id', 'DESC');

        return $qb->getQuery()->getResult();
    }
}
