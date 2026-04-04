<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260404110000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add deposit_percent, warranty_months, payment_method to offer table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE offer ADD deposit_percent INT DEFAULT NULL');
        $this->addSql('ALTER TABLE offer ADD warranty_months INT DEFAULT NULL');
        $this->addSql('ALTER TABLE offer ADD payment_method VARCHAR(100) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE offer DROP COLUMN deposit_percent');
        $this->addSql('ALTER TABLE offer DROP COLUMN warranty_months');
        $this->addSql('ALTER TABLE offer DROP COLUMN payment_method');
    }
}
