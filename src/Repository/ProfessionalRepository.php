<?php

namespace App\Repository;

use App\Entity\Professional;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Professional>
 */
class ProfessionalRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Professional::class);
    }

    /**
     * @param array $filters An array of filters (e.g., ['categories' => [1, 2], 'cities' => ['Montreal']])
     * @param int $page The current page number
     * @param int $limit The maximum number of results per page
     * @return \Doctrine\ORM\Tools\Pagination\Paginator Returns a Paginator object
     */
    public function findByFilters(array $filters, int $page = 1, int $limit = 6): \Doctrine\ORM\Tools\Pagination\Paginator
    {
        $qb = $this->createQueryBuilder('p');
        
        if (!empty($filters['categories'])) {
            $qb->leftJoin('p.category', 'c')
               ->andWhere('c.id IN (:categories)')
               ->setParameter('categories', $filters['categories']);
        }

        if (!empty($filters['cities'])) {
            $qb->andWhere('p.city IN (:cities)')
               ->setParameter('cities', $filters['cities']);
        }

        $qb->orderBy('p.id', 'DESC')
           ->setFirstResult(($page - 1) * $limit)
           ->setMaxResults($limit);

        return new \Doctrine\ORM\Tools\Pagination\Paginator($qb->getQuery());
    }

    /**
     * @return array Returns an array of distinct cities
     */
    public function findAllCities(): array
    {
        return $this->createQueryBuilder('p')
            ->select('DISTINCT p.city')
            ->where('p.city IS NOT NULL')
            ->orderBy('p.city', 'ASC')
            ->getQuery()
            ->getSingleColumnResult();
    }

    /**
     * @return array Returns an associative array of category ID => count
     */
    public function countPerCategory(): array
    {
        $results = $this->createQueryBuilder('p')
            ->select('IDENTITY(p.category) as catId, COUNT(p.id) as total')
            ->groupBy('p.category')
            ->getQuery()
            ->getArrayResult();

        $counts = [];
        foreach ($results as $row) {
            if ($row['catId']) {
                $counts[$row['catId']] = (int)$row['total'];
            }
        }
        return $counts;
    }

    /**
     * @return array Returns an associative array of city => count
     */
    public function countPerCity(): array
    {
        $results = $this->createQueryBuilder('p')
            ->select('p.city, COUNT(p.id) as total')
            ->where('p.city IS NOT NULL')
            ->groupBy('p.city')
            ->getQuery()
            ->getArrayResult();

        $counts = [];
        foreach ($results as $row) {
            $counts[$row['city']] = (int)$row['total'];
        }
        return $counts;
    }

    /**
     * Fetches top rated professionals from different categories.
     * Since no rating field exists yet, we sort by experience and ID as a fallback.
     * 
     * @param int $limit
     * @return Professional[]
     */
    public function findTopRatedByDifferentCategories(int $limit = 3): array
    {
        // First, get one professional per category to ensure diversity
        $professionals = $this->createQueryBuilder('p')
            ->join('p.category', 'c')
            ->orderBy('p.expYears', 'DESC')
            ->addOrderBy('p.id', 'DESC')
            ->getQuery()
            ->getResult();

        $featured = [];
        $usedCategories = [];

        foreach ($professionals as $pro) {
            $catId = $pro->getCategory()->getId();
            if (!in_array($catId, $usedCategories)) {
                $featured[] = $pro;
                $usedCategories[] = $catId;
            }

            if (count($featured) >= $limit) {
                break;
            }
        }

        // If we still don't have enough (less than $limit categories available), 
        // fill with any remaining top professionals
        if (count($featured) < $limit) {
            foreach ($professionals as $pro) {
                if (!in_array($pro, $featured, true)) {
                    $featured[] = $pro;
                }
                if (count($featured) >= $limit) {
                    break;
                }
            }
        }

        return $featured;
    }

    /**
     * Search professionals by keyword across name, category, and city.
     *
     * @param string $q The search keyword
     * @param int $limit Max results to return
     * @return array
     */
    public function searchByKeyword(string $q, int $limit = 6): array
    {
        $qb = $this->createQueryBuilder('p')
            ->leftJoin('p.category', 'c')
            ->where('p.company_name LIKE :q')
            ->orWhere('c.name LIKE :q')
            ->orWhere('p.city LIKE :q')
            ->setParameter('q', '%' . $q . '%')
            ->setMaxResults($limit)
            ->orderBy('p.id', 'DESC');

        return $qb->getQuery()->getResult();
    }

    /**
     * Unified search for professionals with filters and sorting.
     */
    public function search(?string $keyword, ?string $category = null, ?array $cities = [], ?array $categories = [], ?string $sort = null, int $page = 1, int $limit = 6): \Doctrine\ORM\Tools\Pagination\Paginator
    {
        $qb = $this->createQueryBuilder('p')
            ->leftJoin('p.category', 'c')
            ->leftJoin('p.stats', 's');

        if ($keyword) {
            $qb->andWhere('p.company_name LIKE :keyword OR c.name LIKE :keyword OR p.city LIKE :keyword')
               ->setParameter('keyword', '%' . $keyword . '%');
        }

        // Single category filter (from top pills)
        if ($category && $category !== 'all') {
            $qb->andWhere('c.slug = :category OR c.id = :category')
               ->setParameter('category', $category);
        }

        // Plural category filter (from sidebar)
        if (!empty($categories)) {
            $qb->andWhere('c.id IN (:sidebar_categories)')
               ->setParameter('sidebar_categories', $categories);
        }

        // Plural city filter (from sidebar)
        if (!empty($cities)) {
            $qb->andWhere('p.city IN (:cities)')
               ->setParameter('cities', $cities);
        }

        if ($sort === 'rating') {
            $qb->orderBy('s.averageRating', 'DESC');
        } elseif ($sort === 'experience') {
            $qb->orderBy('p.expYears', 'DESC');
        } else {
            $qb->orderBy('p.id', 'DESC');
        }

        $qb->setFirstResult(($page - 1) * $limit)
           ->setMaxResults($limit);

        return new \Doctrine\ORM\Tools\Pagination\Paginator($qb->getQuery());
    }
}
