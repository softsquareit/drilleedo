<?php

namespace App\Repository;

use App\Entity\QuoteRequest;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<QuoteRequest>
 */
class QuoteRequestRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, QuoteRequest::class);
    }

    /**
     * @return QuoteRequest[] Returns an array of QuoteRequest objects
     */
    public function findByCategory($category): array
    {
        return $this->createQueryBuilder('q')
            ->andWhere('q.category = :val')
            ->setParameter('val', $category)
            ->orderBy('q.creationDate', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * @return QuoteRequest[] Returns an array of QuoteRequest objects matching any of the categories
     */
    public function findByCategories($categories): array
    {
        return $this->createQueryBuilder('q')
            ->andWhere('q.category IN (:categories)')
            ->setParameter('categories', $categories)
            ->orderBy('q.creationDate', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }
}
