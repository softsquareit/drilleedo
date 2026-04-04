<?php

namespace App\Command;

use App\Entity\Notification;
use App\Entity\Offer;
use App\Entity\QuoteRequest;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:auto-close-expired-requests',
    description: 'Automatically close PUBLISHED and IN_PROGRESS quote requests whose desired end date (or start date) has passed by more than a configurable number of days.',
)]
class AutoCloseExpiredRequestsCommand extends Command
{
    public function __construct(private EntityManagerInterface $em)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption(
            'grace-days',
            null,
            InputOption::VALUE_OPTIONAL,
            'Number of days after desiredEndDate (or desiredStartDate) before auto-closing',
            30
        );
        $this->addOption(
            'dry-run',
            null,
            InputOption::VALUE_NONE,
            'Preview which requests would be closed without making changes'
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io        = new SymfonyStyle($input, $output);
        $graceDays = (int) $input->getOption('grace-days');
        $dryRun    = (bool) $input->getOption('dry-run');

        $cutoffDate = new \DateTime("-{$graceDays} days");

        // ── 1. PUBLISHED requests with no offers and past their desired date ──
        $publishedQb = $this->em->createQueryBuilder();
        $publishedQb->select('q')
            ->from(QuoteRequest::class, 'q')
            ->where('q.status = :status')
            ->andWhere('(q.desiredEndDate IS NOT NULL AND q.desiredEndDate < :cutoff)
                        OR (q.desiredEndDate IS NULL AND q.desiredStartDate IS NOT NULL AND q.desiredStartDate < :cutoff)')
            ->setParameter('status', QuoteRequest::STATUS_PUBLISHED)
            ->setParameter('cutoff', $cutoffDate);

        /** @var QuoteRequest[] $publishedExpired */
        $publishedExpired = $publishedQb->getQuery()->getResult();

        // ── 2. IN_PROGRESS requests past their desired end date ──
        $inProgressQb = $this->em->createQueryBuilder();
        $inProgressQb->select('q')
            ->from(QuoteRequest::class, 'q')
            ->where('q.status = :status')
            ->andWhere('(q.desiredEndDate IS NOT NULL AND q.desiredEndDate < :cutoff)
                        OR (q.desiredEndDate IS NULL AND q.desiredStartDate IS NOT NULL AND q.desiredStartDate < :cutoff)')
            ->setParameter('status', QuoteRequest::STATUS_IN_PROGRESS)
            ->setParameter('cutoff', $cutoffDate);

        /** @var QuoteRequest[] $inProgressExpired */
        $inProgressExpired = $inProgressQb->getQuery()->getResult();

        $allExpired = array_merge($publishedExpired, $inProgressExpired);

        if (empty($allExpired)) {
            $io->success('Aucune demande expirée trouvée.');
            return Command::SUCCESS;
        }

        $io->section(sprintf('%d demande(s) à clôturer', count($allExpired)));
        $io->table(
            ['ID', 'Titre', 'Statut', 'Date fin', 'Date début', 'Individuel'],
            array_map(fn(QuoteRequest $q) => [
                $q->getId(),
                mb_strimwidth($q->getTitle(), 0, 40, '…'),
                $q->getStatus(),
                $q->getDesiredEndDate()?->format('d/m/Y') ?? '—',
                $q->getDesiredStartDate()?->format('d/m/Y') ?? '—',
                $q->getIndividual()?->getEmail() ?? '—',
            ], $allExpired)
        );

        if ($dryRun) {
            $io->note(sprintf('[dry-run] %d demande(s) seraient clôturées (%d publiées, %d en cours).',
                count($allExpired), count($publishedExpired), count($inProgressExpired)));
            return Command::SUCCESS;
        }

        $closed = 0;
        foreach ($allExpired as $quote) {
            $wasInProgress = $quote->getStatus() === QuoteRequest::STATUS_IN_PROGRESS;
            $quote->setStatus(QuoteRequest::STATUS_CLOSED);

            foreach ($quote->getOffers() as $offer) {
                if ($wasInProgress && $offer->getStatus() === Offer::STATUS_ACCEPTED) {
                    // Close the accepted offer for an in-progress request
                    $offer->setStatus(Offer::STATUS_CLOSED);
                    $offer->setUpdatedAt(new \DateTime());

                    $provider = $offer->getProvider();
                    if ($provider) {
                        $notif = new Notification();
                        $notif->setUser($provider);
                        $notif->setTitle('Mission clôturée automatiquement');
                        $notif->setMessage(sprintf(
                            'La mission "%s" a été clôturée automatiquement car la date de fin est dépassée depuis plus de %d jour(s). Merci pour votre travail !',
                            $quote->getTitle(),
                            $graceDays
                        ));
                        $notif->setRelatedEntityId($quote->getId());
                        $notif->setRelatedEntityType('quote');
                        $this->em->persist($notif);
                    }
                } elseif (in_array($offer->getStatus(), [Offer::STATUS_PUBLISHED, Offer::STATUS_INTERESTED], true)) {
                    // Reject stale open offers on a PUBLISHED request
                    $offer->setStatus(Offer::STATUS_REJECTED);
                    $offer->setUpdatedAt(new \DateTime());

                    $provider = $offer->getProvider();
                    if ($provider) {
                        $notif = new Notification();
                        $notif->setUser($provider);
                        $notif->setTitle('Demande expirée');
                        $notif->setMessage(sprintf(
                            'La demande "%s" a été clôturée automatiquement car la date souhaitée est dépassée.',
                            $quote->getTitle()
                        ));
                        $notif->setRelatedEntityId($offer->getId());
                        $notif->setRelatedEntityType('offer');
                        $this->em->persist($notif);
                    }
                }
            }

            // Notify the individual
            $individual = $quote->getIndividual();
            if ($individual) {
                $notif = new Notification();
                $notif->setUser($individual);
                if ($wasInProgress) {
                    $notif->setTitle('Mission clôturée automatiquement');
                    $notif->setMessage(sprintf(
                        'Votre mission "%s" a été clôturée automatiquement car la date de fin est dépassée depuis plus de %d jour(s). Pensez à laisser un avis au prestataire !',
                        $quote->getTitle(),
                        $graceDays
                    ));
                } else {
                    $notif->setTitle('Demande clôturée automatiquement');
                    $notif->setMessage(sprintf(
                        'Votre demande "%s" a été clôturée automatiquement car la date souhaitée est dépassée depuis plus de %d jour(s). Vous pouvez créer une nouvelle demande si besoin.',
                        $quote->getTitle(),
                        $graceDays
                    ));
                }
                $notif->setRelatedEntityId($quote->getId());
                $notif->setRelatedEntityType('quote');
                $this->em->persist($notif);
            }

            $closed++;
        }

        $this->em->flush();

        $io->success(sprintf('%d demande(s) clôturée(s) avec succès (%d publiées, %d en cours).',
            $closed, count($publishedExpired), count($inProgressExpired)));
        return Command::SUCCESS;
    }
}
