<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Ajout des champs de préférences sur QuoteRequest et DirectRequest,
 * et des champs d'engagement sur Offer.
 */
final class Version20260402120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajout : languages, desired_start_date, availabilities, urgent_intervention sur quote_request et direct_request ; prior_visit, possible_start_date, estimated_duration, estimated_duration_unit sur offer.';
    }

    public function up(Schema $schema): void
    {
        // quote_request
        $this->addSql('ALTER TABLE quote_request
            ADD languages JSON DEFAULT NULL,
            ADD desired_start_date DATE DEFAULT NULL,
            ADD availabilities JSON DEFAULT NULL,
            ADD urgent_intervention TINYINT(1) NOT NULL DEFAULT 0
        ');

        // direct_request
        $this->addSql('ALTER TABLE direct_request
            ADD languages JSON DEFAULT NULL,
            ADD desired_start_date DATE DEFAULT NULL,
            ADD availabilities JSON DEFAULT NULL,
            ADD urgent_intervention TINYINT(1) NOT NULL DEFAULT 0
        ');

        // offer
        $this->addSql('ALTER TABLE offer
            ADD prior_visit TINYINT(1) DEFAULT NULL,
            ADD possible_start_date DATE DEFAULT NULL,
            ADD estimated_duration INT DEFAULT NULL,
            ADD estimated_duration_unit VARCHAR(20) DEFAULT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        // quote_request
        $this->addSql('ALTER TABLE quote_request
            DROP COLUMN languages,
            DROP COLUMN desired_start_date,
            DROP COLUMN availabilities,
            DROP COLUMN urgent_intervention
        ');

        // direct_request
        $this->addSql('ALTER TABLE direct_request
            DROP COLUMN languages,
            DROP COLUMN desired_start_date,
            DROP COLUMN availabilities,
            DROP COLUMN urgent_intervention
        ');

        // offer
        $this->addSql('ALTER TABLE offer
            DROP COLUMN prior_visit,
            DROP COLUMN possible_start_date,
            DROP COLUMN estimated_duration,
            DROP COLUMN estimated_duration_unit
        ');
    }
}
