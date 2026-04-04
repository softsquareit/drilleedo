<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260404100000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add budget, address, desired_end_date to quote_request table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE quote_request ADD budget DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE quote_request ADD address VARCHAR(500) DEFAULT NULL');
        $this->addSql('ALTER TABLE quote_request ADD desired_end_date DATE DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE quote_request DROP COLUMN budget');
        $this->addSql('ALTER TABLE quote_request DROP COLUMN address');
        $this->addSql('ALTER TABLE quote_request DROP COLUMN desired_end_date');
    }
}
