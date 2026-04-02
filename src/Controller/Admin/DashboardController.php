<?php

namespace App\Controller\Admin;

use App\Entity\Blog;
use App\Entity\Category;
use App\Entity\Company;
use App\Entity\DirectRequest;
use App\Entity\Individual;
use App\Entity\Offer;
use App\Entity\Professional;
use App\Entity\QuoteRequest;
use App\Entity\Type;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
class DashboardController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em) {}

    #[Route('/dashboard', name: 'admin_dashboard')]
    public function dashboard(): Response
    {
        $adminUser = $this->getUser();
        $username = $adminUser->getUserIdentifier();

        // Basic Counts
        $companiesCount = $this->em->getRepository(Company::class)->count([]);
        $professionalsCount = $this->em->getRepository(Professional::class)->count([]);
        $individualsCount = $this->em->getRepository(Individual::class)->count([]);

        // Workflow Metrics
        $totalOffers = $this->em->getRepository(Offer::class)->count([]);
        $totalRequests = $this->em->getRepository(QuoteRequest::class)->count([]) + $this->em->getRepository(DirectRequest::class)->count([]);

        // --- Trend Logic ---
        $now = new \DateTime();
        $thirtyDaysAgo = (clone $now)->modify('-30 days');
        $sixtyDaysAgo = (clone $now)->modify('-60 days');

        // Offers Trend
        $offersThisMonth = (int) $this->em->getRepository(Offer::class)->createQueryBuilder('o')
            ->select('count(o.id)')
            ->where('o.createdAt >= :date')
            ->setParameter('date', $thirtyDaysAgo)
            ->getQuery()->getSingleScalarResult();

        $offersLastMonth = (int) $this->em->getRepository(Offer::class)->createQueryBuilder('o')
            ->select('count(o.id)')
            ->where('o.createdAt >= :dateStart')
            ->andWhere('o.createdAt < :dateEnd')
            ->setParameter('dateStart', $sixtyDaysAgo)
            ->setParameter('dateEnd', $thirtyDaysAgo)
            ->getQuery()->getSingleScalarResult();
        $offersTrend = $offersLastMonth > 0 ? round((($offersThisMonth - $offersLastMonth) / $offersLastMonth) * 100, 1) : ($offersThisMonth > 0 ? 100 : 0);

        // Requests Trend (Quote + Direct)
        $requestsThisMonthQ = (int) $this->em->getRepository(QuoteRequest::class)->createQueryBuilder('q')
            ->select('count(q.id)')
            ->where('q.creationDate >= :date')
            ->setParameter('date', $thirtyDaysAgo)
            ->getQuery()->getSingleScalarResult();
        $requestsThisMonthD = (int) $this->em->getRepository(DirectRequest::class)->createQueryBuilder('d')
            ->select('count(d.id)')
            ->where('d.creationDate >= :date')
            ->setParameter('date', $thirtyDaysAgo)
            ->getQuery()->getSingleScalarResult();
        $requestsThisMonth = $requestsThisMonthQ + $requestsThisMonthD;

        $requestsLastMonthQ = (int) $this->em->getRepository(QuoteRequest::class)->createQueryBuilder('q')
            ->select('count(q.id)')
            ->where('q.creationDate >= :dateStart')
            ->andWhere('q.creationDate < :dateEnd')
            ->setParameter('dateStart', $sixtyDaysAgo)
            ->setParameter('dateEnd', $thirtyDaysAgo)
            ->getQuery()->getSingleScalarResult();
        $requestsLastMonthD = (int) $this->em->getRepository(DirectRequest::class)->createQueryBuilder('d')
            ->select('count(d.id)')
            ->where('d.creationDate >= :dateStart')
            ->andWhere('d.creationDate < :dateEnd')
            ->setParameter('dateStart', $sixtyDaysAgo)
            ->setParameter('dateEnd', $thirtyDaysAgo)
            ->getQuery()->getSingleScalarResult();
        $requestsLastMonth = $requestsLastMonthQ + $requestsLastMonthD;
        $requestsTrend = $requestsLastMonth > 0 ? round((($requestsThisMonth - $requestsLastMonth) / $requestsLastMonth) * 100, 1) : ($requestsThisMonth > 0 ? 100 : 0);

        // Trends — mocked (no createdAt on user entities yet)
        $companiesTrend = 12.4;
        $prosTrend      = 5.2;
        $indivTrend     = 8.1;

        // --- End Trend Logic ---

        // Acceptance Rate — single query using CASE WHEN aggregation
        $offerStatusCounts = $this->em->getRepository(Offer::class)->createQueryBuilder('o')
            ->select(
                'COUNT(o.id) AS total',
                'SUM(CASE WHEN o.status = :accepted THEN 1 ELSE 0 END) AS accepted',
                'SUM(CASE WHEN o.status = :published THEN 1 ELSE 0 END) AS published'
            )
            ->setParameter('accepted', Offer::STATUS_ACCEPTED)
            ->setParameter('published', Offer::STATUS_PUBLISHED)
            ->getQuery()->getSingleResult();

        $acceptedOffers  = (int) $offerStatusCounts['accepted'];
        $publishedOffers = (int) $offerStatusCounts['published'];
        $conversionRate  = $publishedOffers > 0 ? round(($acceptedOffers / $publishedOffers) * 100, 1) : 0;

        // Content counts — single query per table
        $blogsCount      = $this->em->getRepository(Blog::class)->count([]);
        $categoriesCount = $this->em->getRepository(Category::class)->count([]);
        $typesCount      = $this->em->getRepository(Type::class)->count([]);

        // Call once, reuse result
        $closedConversion = $this->getClosedConversion();

        // Static Financial Placeholder
        $monthlyRevenue = 12450; // Mocked CA
        $paymentAlerts = 3;      // Mocked Alerts

        return $this->render('admin/index.html.twig', [
            'username'            => $username,
            'companies'           => $companiesCount,
            'individuals'         => $individualsCount,
            'professionals'       => $professionalsCount,
            'blogs'               => $blogsCount,
            'categories'          => $categoriesCount,
            'types'               => $typesCount,

            // New metrics
            'totalOffers'         => $totalOffers,
            'totalRequests'       => $totalRequests,
            'conversionRate'      => $conversionRate,
            'monthlyRevenue'      => $monthlyRevenue,
            'paymentAlerts'       => $paymentAlerts,
            'offersTrend'         => $offersTrend,
            'requestsTrend'       => $requestsTrend,
            'companiesTrend'      => $companiesTrend,
            'prosTrend'           => $prosTrend,
            'indivTrend'          => $indivTrend,

            // Advanced Analytics (Closed Requests)
            'closedWithOffersPercent'    => $closedConversion['with'],
            'closedWithoutOffersPercent' => $closedConversion['without'],
            'totalClosed'                => $closedConversion['total'],

            // Market Insights (Categories)
            'topDemandCategories'        => $this->getTopDemandCategories(),
            'topSupplyCategories'        => $this->getTopSupplyCategories(),
            'marketReport'               => $this->getMarketReport(),

            'latest_blogs'        => $this->em->getRepository(Blog::class)->findBy([], ['id' => 'DESC'], 5),
            'latest_professionals' => $this->em->getRepository(Professional::class)->findBy([], ['id' => 'DESC'], 5),
            'latest_companies'    => $this->em->getRepository(Company::class)->findBy([], ['id' => 'DESC'], 5),
            'latest_individuals'  => $this->em->getRepository(Individual::class)->findBy([], ['id' => 'DESC'], 5),
        ]);
    }

    private function getClosedConversion(): array
    {
        $closedQuotes = $this->em->getRepository(QuoteRequest::class)->findBy(['status' => QuoteRequest::STATUS_CLOSED]);
        $closedDirects = $this->em->getRepository(DirectRequest::class)->findBy(['status' => DirectRequest::STATUS_CLOSED]);
        $allClosed = array_merge($closedQuotes, $closedDirects);

        $total = count($allClosed);
        $withOffers = 0;
        foreach ($allClosed as $req) {
            if ($req->getOffers()->count() > 0) {
                $withOffers++;
            }
        }

        return [
            'total'   => $total,
            'with'    => $total > 0 ? round(($withOffers / $total) * 100, 1) : 0,
            'without' => $total > 0 ? round((($total - $withOffers) / $total) * 100, 1) : 0,
        ];
    }

    private function getTopDemandCategories(): array
    {
        $qData = $this->em->createQuery('SELECT c.name, COUNT(q.id) as cnt FROM App\Entity\QuoteRequest q JOIN q.category c GROUP BY c.id ORDER BY cnt DESC')->setMaxResults(10)->getResult();
        $dData = $this->em->createQuery('SELECT c.name, COUNT(d.id) as cnt FROM App\Entity\DirectRequest d JOIN d.category c GROUP BY c.id ORDER BY cnt DESC')->setMaxResults(10)->getResult();

        $merged = [];
        foreach ($qData as $row) { $merged[$row['name']] = ($merged[$row['name']] ?? 0) + $row['cnt']; }
        foreach ($dData as $row) { $merged[$row['name']] = ($merged[$row['name']] ?? 0) + $row['cnt']; }
        arsort($merged);
        return array_slice($merged, 0, 5, true);
    }

    private function getTopSupplyCategories(): array
    {
        $qOffers = $this->em->createQuery('SELECT c.name, COUNT(o.id) as cnt FROM App\Entity\Offer o JOIN o.quoteRequest q JOIN q.category c GROUP BY c.id ORDER BY cnt DESC')->setMaxResults(10)->getResult();
        $dOffers = $this->em->createQuery('SELECT c.name, COUNT(o.id) as cnt FROM App\Entity\Offer o JOIN o.directRequest d JOIN d.category c GROUP BY c.id ORDER BY cnt DESC')->setMaxResults(10)->getResult();

        $merged = [];
        foreach ($qOffers as $row) { $merged[$row['name']] = ($merged[$row['name']] ?? 0) + $row['cnt']; }
        foreach ($dOffers as $row) { $merged[$row['name']] = ($merged[$row['name']] ?? 0) + $row['cnt']; }
        arsort($merged);
        return array_slice($merged, 0, 5, true);
    }

    private function getMarketReport(): array
    {
        $categories = $this->em->getRepository(Category::class)->findBy([], null, 10);
        $report = [];
        foreach ($categories as $cat) {
            $reqs = $this->em->getRepository(QuoteRequest::class)->count(['category' => $cat]) + $this->em->getRepository(DirectRequest::class)->count(['category' => $cat]);
            $offers = 0;
            $qs = $this->em->getRepository(QuoteRequest::class)->findBy(['category' => $cat]);
            foreach ($qs as $q) { $offers += $q->getOffers()->count(); }
            $ds = $this->em->getRepository(DirectRequest::class)->findBy(['category' => $cat]);
            foreach ($ds as $d) { $offers += $d->getOffers()->count(); }

            if ($reqs > 0 || $offers > 0) {
                $report[] = [
                    'name'     => $cat->getName(),
                    'requests' => $reqs,
                    'offers'   => $offers,
                    'ratio'    => $reqs > 0 ? round($offers / $reqs, 1) : $offers
                ];
            }
        }
        usort($report, fn($a, $b) => $b['requests'] <=> $a['requests']);
        return array_slice($report, 0, 6);
    }
}
