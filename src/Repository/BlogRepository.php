<?php

namespace App\Repository;

use App\Entity\Blog;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;


class BlogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Blog::class);
    }



















    /**
     * @return \Doctrine\ORM\Tools\Pagination\Paginator
     */
    public function findPaginatedByType(string $type, int $page = 1, int $limit = 6): \Doctrine\ORM\Tools\Pagination\Paginator
    {
        $query = $this->createQueryBuilder('b')
            ->andWhere('b.type = :type')
            ->andWhere('b.isActive = :active')
            ->setParameter('type', $type)
            ->setParameter('active', true)
            ->orderBy('b.createdAt', 'DESC')
            ->getQuery()
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        return new \Doctrine\ORM\Tools\Pagination\Paginator($query);
    }

    /**
     * @return Blog[]
     */
    public function findSimilarByType(string $type, int $excludeId, int $limit = 3): array
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.type = :type')
            ->andWhere('b.id != :excludeId')
            ->andWhere('b.isActive = :active')
            ->setParameter('type', $type)
            ->setParameter('excludeId', $excludeId)
            ->setParameter('active', true)
            ->orderBy('b.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
