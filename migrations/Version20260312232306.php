<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260312232306 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE business_stats (id INT AUTO_INCREMENT NOT NULL, average_rating DOUBLE PRECISION DEFAULT 0 NOT NULL, review_count INT DEFAULT 0 NOT NULL, avg_response_time INT DEFAULT NULL, completion_rate DOUBLE PRECISION DEFAULT 0 NOT NULL, business_id INT NOT NULL, UNIQUE INDEX UNIQ_29A68015A89DB457 (business_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE business_stats ADD CONSTRAINT FK_29A68015A89DB457 FOREIGN KEY (business_id) REFERENCES business (id)');
        $this->addSql('ALTER TABLE business ADD is_verified TINYINT DEFAULT 0 NOT NULL, ADD is_top_rated TINYINT DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE professional ADD availability_status VARCHAR(20) DEFAULT \'AVAILABLE\' NOT NULL');
        $this->addSql('ALTER TABLE user ADD language_code VARCHAR(5) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE business_stats DROP FOREIGN KEY FK_29A68015A89DB457');
        $this->addSql('DROP TABLE business_stats');
        $this->addSql('ALTER TABLE business DROP is_verified, DROP is_top_rated');
        $this->addSql('ALTER TABLE professional DROP availability_status');
        $this->addSql('ALTER TABLE `user` DROP language_code');
    }
}
