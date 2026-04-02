<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260402160000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add viewed_at datetime to offer table (tracks when individual first viewed an offer)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE offer ADD viewed_at DATETIME DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE offer DROP COLUMN viewed_at');
    }
}
