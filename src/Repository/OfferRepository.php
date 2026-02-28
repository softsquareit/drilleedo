<?php

namespace App\Repository;

use App\Entity\Offer;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Offer>
 */
class OfferRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Offer::class);
    }

    /**
     * @return Offer[] Returns an array of Offer objects
     */
    public function findByProvider($provider): array
    {
        return $this->createQueryBuilder('o')
            ->andWhere('o.provider = :val')
            ->setParameter('val', $provider)
            ->orderBy('o.createdAt', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }
}
