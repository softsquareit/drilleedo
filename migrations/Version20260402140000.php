<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260402140000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add FULLTEXT indexes on business.company_name and professional.city for faster keyword search';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE business ADD FULLTEXT INDEX idx_fulltext_company_name (company_name)');
        $this->addSql('ALTER TABLE professional ADD FULLTEXT INDEX idx_fulltext_city (city)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE business DROP INDEX idx_fulltext_company_name');
        $this->addSql('ALTER TABLE professional DROP INDEX idx_fulltext_city');
    }
}
