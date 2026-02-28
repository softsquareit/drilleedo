<?php

namespace App\Repository;

use App\Entity\Testimonial;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Testimonial>
 *
 * @method Testimonial|null find($id, $lockMode = null, $lockVersion = null)
 * @method Testimonial|null findOneBy(array $criteria, array $orderBy = null)
 * @method Testimonial[]    findAll()
 * @method Testimonial[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TestimonialRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Testimonial::class);
    }

    public function findActiveTestimonials(int $limit = 10): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.isActive = :val')
            ->setParameter('val', true)
            ->orderBy('t.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult()
        ;
    }
}
