<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260226051201 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE admin (id INT NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE adress (id INT AUTO_INCREMENT NOT NULL, street VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, postal_code INT NOT NULL, business_id INT DEFAULT NULL, INDEX IDX_5CECC7BEA89DB457 (business_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE blog (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, short_desc VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, main_img VARCHAR(255) NOT NULL, multiple_imgs JSON DEFAULT NULL, type VARCHAR(255) DEFAULT NULL, created_at DATETIME DEFAULT NULL, category_id INT DEFAULT NULL, author_id INT DEFAULT NULL, INDEX IDX_C015514312469DE2 (category_id), INDEX IDX_C0155143F675F31B (author_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE business (company_name VARCHAR(255) DEFAULT NULL, trade_name VARCHAR(255) DEFAULT NULL, licence_num VARCHAR(50) DEFAULT NULL, company_num VARCHAR(50) DEFAULT NULL, logo VARCHAR(255) DEFAULT NULL, banner VARCHAR(255) DEFAULT NULL, phone_num VARCHAR(20) DEFAULT NULL, about LONGTEXT DEFAULT NULL, why_choose_us JSON DEFAULT NULL, services JSON DEFAULT NULL, primary_contact_id INT DEFAULT NULL, entrepreneur_type_id INT DEFAULT NULL, id INT NOT NULL, UNIQUE INDEX UNIQ_8D36E38D905C92C (primary_contact_id), INDEX IDX_8D36E3821882C23 (entrepreneur_type_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE business_payment_method (business_id INT NOT NULL, payment_method_id INT NOT NULL, INDEX IDX_F15643D0A89DB457 (business_id), INDEX IDX_F15643D05AA1164F (payment_method_id), PRIMARY KEY (business_id, payment_method_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, category VARCHAR(50) NOT NULL, parent_id INT DEFAULT NULL, INDEX IDX_64C19C1727ACA70 (parent_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE city (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, postal_code VARCHAR(10) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE comment (id INT AUTO_INCREMENT NOT NULL, content LONGTEXT NOT NULL, created_at DATETIME NOT NULL, user_id INT NOT NULL, blog_id INT NOT NULL, INDEX IDX_9474526CA76ED395 (user_id), INDEX IDX_9474526CDAE07E97 (blog_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE company (website VARCHAR(255) DEFAULT NULL, foundation_year VARCHAR(10) DEFAULT NULL, emp_num INT DEFAULT NULL, id INT NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE company_category (company_id INT NOT NULL, category_id INT NOT NULL, INDEX IDX_1EDB0CAC979B1AD6 (company_id), INDEX IDX_1EDB0CAC12469DE2 (category_id), PRIMARY KEY (company_id, category_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE direct_request (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, status VARCHAR(50) NOT NULL, images JSON DEFAULT NULL, brochure_filename VARCHAR(255) DEFAULT NULL, creation_date DATETIME NOT NULL, category_id INT DEFAULT NULL, individual_id INT DEFAULT NULL, target_professional_id INT DEFAULT NULL, target_company_id INT DEFAULT NULL, INDEX IDX_993C107312469DE2 (category_id), INDEX IDX_993C1073AE271C0D (individual_id), INDEX IDX_993C10734FB99260 (target_professional_id), INDEX IDX_993C1073A577C247 (target_company_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE entrepreneur_type (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE individual (id INT NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE link (id INT AUTO_INCREMENT NOT NULL, link VARCHAR(255) NOT NULL, type VARCHAR(50) DEFAULT NULL, business_id INT DEFAULT NULL, INDEX IDX_36AC99F1A89DB457 (business_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE notification (id INT AUTO_INCREMENT NOT NULL, message VARCHAR(255) NOT NULL, is_read TINYINT NOT NULL, created_at DATETIME NOT NULL, title VARCHAR(255) DEFAULT NULL, related_entity_id INT DEFAULT NULL, related_entity_type VARCHAR(255) DEFAULT NULL, user_id INT DEFAULT NULL, INDEX IDX_BF5476CAA76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE offer (id INT AUTO_INCREMENT NOT NULL, price DOUBLE PRECISION NOT NULL, description LONGTEXT NOT NULL, status VARCHAR(50) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, documents JSON DEFAULT NULL, quote_request_id INT DEFAULT NULL, direct_request_id INT DEFAULT NULL, provider_id INT DEFAULT NULL, INDEX IDX_29D6873EF229C21E (quote_request_id), INDEX IDX_29D6873E555B7D76 (direct_request_id), INDEX IDX_29D6873EA53A8AA (provider_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE payment_method (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, is_active TINYINT NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE personal_infos (id INT AUTO_INCREMENT NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, adresse VARCHAR(255) NOT NULL, phone_num VARCHAR(50) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE primary_contact (id INT AUTO_INCREMENT NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, phone VARCHAR(50) NOT NULL, email VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE professional (city VARCHAR(30) NOT NULL, exp_years INT NOT NULL, category_id INT NOT NULL, id INT NOT NULL, INDEX IDX_B3B573AA12469DE2 (category_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE projet (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, start_date DATE NOT NULL, end_date DATE DEFAULT NULL, main_photo VARCHAR(255) DEFAULT NULL, gallery JSON DEFAULT NULL, state TINYINT DEFAULT NULL, business_id INT DEFAULT NULL, INDEX IDX_50159CA9A89DB457 (business_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE quote_request (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, status VARCHAR(50) NOT NULL, images JSON DEFAULT NULL, brochure_filename VARCHAR(255) DEFAULT NULL, creation_date DATETIME NOT NULL, category_id INT DEFAULT NULL, individual_id INT DEFAULT NULL, INDEX IDX_D478271B12469DE2 (category_id), INDEX IDX_D478271BAE271C0D (individual_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE type (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, password VARCHAR(255) NOT NULL, personal_infos_id INT DEFAULT NULL, type VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), UNIQUE INDEX UNIQ_8D93D649F8759283 (personal_infos_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750 (queue_name, available_at, delivered_at, id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE admin ADD CONSTRAINT FK_880E0D76BF396750 FOREIGN KEY (id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE adress ADD CONSTRAINT FK_5CECC7BEA89DB457 FOREIGN KEY (business_id) REFERENCES business (id)');
        $this->addSql('ALTER TABLE blog ADD CONSTRAINT FK_C015514312469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE blog ADD CONSTRAINT FK_C0155143F675F31B FOREIGN KEY (author_id) REFERENCES business (id)');
        $this->addSql('ALTER TABLE business ADD CONSTRAINT FK_8D36E38D905C92C FOREIGN KEY (primary_contact_id) REFERENCES primary_contact (id)');
        $this->addSql('ALTER TABLE business ADD CONSTRAINT FK_8D36E3821882C23 FOREIGN KEY (entrepreneur_type_id) REFERENCES entrepreneur_type (id)');
        $this->addSql('ALTER TABLE business ADD CONSTRAINT FK_8D36E38BF396750 FOREIGN KEY (id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE business_payment_method ADD CONSTRAINT FK_F15643D0A89DB457 FOREIGN KEY (business_id) REFERENCES business (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE business_payment_method ADD CONSTRAINT FK_F15643D05AA1164F FOREIGN KEY (payment_method_id) REFERENCES payment_method (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE category ADD CONSTRAINT FK_64C19C1727ACA70 FOREIGN KEY (parent_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CDAE07E97 FOREIGN KEY (blog_id) REFERENCES blog (id)');
        $this->addSql('ALTER TABLE company ADD CONSTRAINT FK_4FBF094FBF396750 FOREIGN KEY (id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE company_category ADD CONSTRAINT FK_1EDB0CAC979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE company_category ADD CONSTRAINT FK_1EDB0CAC12469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE direct_request ADD CONSTRAINT FK_993C107312469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE direct_request ADD CONSTRAINT FK_993C1073AE271C0D FOREIGN KEY (individual_id) REFERENCES individual (id)');
        $this->addSql('ALTER TABLE direct_request ADD CONSTRAINT FK_993C10734FB99260 FOREIGN KEY (target_professional_id) REFERENCES professional (id)');
        $this->addSql('ALTER TABLE direct_request ADD CONSTRAINT FK_993C1073A577C247 FOREIGN KEY (target_company_id) REFERENCES company (id)');
        $this->addSql('ALTER TABLE individual ADD CONSTRAINT FK_8793FC17BF396750 FOREIGN KEY (id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE link ADD CONSTRAINT FK_36AC99F1A89DB457 FOREIGN KEY (business_id) REFERENCES business (id)');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT FK_BF5476CAA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE offer ADD CONSTRAINT FK_29D6873EF229C21E FOREIGN KEY (quote_request_id) REFERENCES quote_request (id)');
        $this->addSql('ALTER TABLE offer ADD CONSTRAINT FK_29D6873E555B7D76 FOREIGN KEY (direct_request_id) REFERENCES direct_request (id)');
        $this->addSql('ALTER TABLE offer ADD CONSTRAINT FK_29D6873EA53A8AA FOREIGN KEY (provider_id) REFERENCES business (id)');
        $this->addSql('ALTER TABLE professional ADD CONSTRAINT FK_B3B573AA12469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE professional ADD CONSTRAINT FK_B3B573AABF396750 FOREIGN KEY (id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE projet ADD CONSTRAINT FK_50159CA9A89DB457 FOREIGN KEY (business_id) REFERENCES business (id)');
        $this->addSql('ALTER TABLE quote_request ADD CONSTRAINT FK_D478271B12469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE quote_request ADD CONSTRAINT FK_D478271BAE271C0D FOREIGN KEY (individual_id) REFERENCES individual (id)');
        $this->addSql('ALTER TABLE `user` ADD CONSTRAINT FK_8D93D649F8759283 FOREIGN KEY (personal_infos_id) REFERENCES personal_infos (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE admin DROP FOREIGN KEY FK_880E0D76BF396750');
        $this->addSql('ALTER TABLE adress DROP FOREIGN KEY FK_5CECC7BEA89DB457');
        $this->addSql('ALTER TABLE blog DROP FOREIGN KEY FK_C015514312469DE2');
        $this->addSql('ALTER TABLE blog DROP FOREIGN KEY FK_C0155143F675F31B');
        $this->addSql('ALTER TABLE business DROP FOREIGN KEY FK_8D36E38D905C92C');
        $this->addSql('ALTER TABLE business DROP FOREIGN KEY FK_8D36E3821882C23');
        $this->addSql('ALTER TABLE business DROP FOREIGN KEY FK_8D36E38BF396750');
        $this->addSql('ALTER TABLE business_payment_method DROP FOREIGN KEY FK_F15643D0A89DB457');
        $this->addSql('ALTER TABLE business_payment_method DROP FOREIGN KEY FK_F15643D05AA1164F');
        $this->addSql('ALTER TABLE category DROP FOREIGN KEY FK_64C19C1727ACA70');
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526CA76ED395');
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526CDAE07E97');
        $this->addSql('ALTER TABLE company DROP FOREIGN KEY FK_4FBF094FBF396750');
        $this->addSql('ALTER TABLE company_category DROP FOREIGN KEY FK_1EDB0CAC979B1AD6');
        $this->addSql('ALTER TABLE company_category DROP FOREIGN KEY FK_1EDB0CAC12469DE2');
        $this->addSql('ALTER TABLE direct_request DROP FOREIGN KEY FK_993C107312469DE2');
        $this->addSql('ALTER TABLE direct_request DROP FOREIGN KEY FK_993C1073AE271C0D');
        $this->addSql('ALTER TABLE direct_request DROP FOREIGN KEY FK_993C10734FB99260');
        $this->addSql('ALTER TABLE direct_request DROP FOREIGN KEY FK_993C1073A577C247');
        $this->addSql('ALTER TABLE individual DROP FOREIGN KEY FK_8793FC17BF396750');
        $this->addSql('ALTER TABLE link DROP FOREIGN KEY FK_36AC99F1A89DB457');
        $this->addSql('ALTER TABLE notification DROP FOREIGN KEY FK_BF5476CAA76ED395');
        $this->addSql('ALTER TABLE offer DROP FOREIGN KEY FK_29D6873EF229C21E');
        $this->addSql('ALTER TABLE offer DROP FOREIGN KEY FK_29D6873E555B7D76');
        $this->addSql('ALTER TABLE offer DROP FOREIGN KEY FK_29D6873EA53A8AA');
        $this->addSql('ALTER TABLE professional DROP FOREIGN KEY FK_B3B573AA12469DE2');
        $this->addSql('ALTER TABLE professional DROP FOREIGN KEY FK_B3B573AABF396750');
        $this->addSql('ALTER TABLE projet DROP FOREIGN KEY FK_50159CA9A89DB457');
        $this->addSql('ALTER TABLE quote_request DROP FOREIGN KEY FK_D478271B12469DE2');
        $this->addSql('ALTER TABLE quote_request DROP FOREIGN KEY FK_D478271BAE271C0D');
        $this->addSql('ALTER TABLE `user` DROP FOREIGN KEY FK_8D93D649F8759283');
        $this->addSql('DROP TABLE admin');
        $this->addSql('DROP TABLE adress');
        $this->addSql('DROP TABLE blog');
        $this->addSql('DROP TABLE business');
        $this->addSql('DROP TABLE business_payment_method');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE city');
        $this->addSql('DROP TABLE comment');
        $this->addSql('DROP TABLE company');
        $this->addSql('DROP TABLE company_category');
        $this->addSql('DROP TABLE direct_request');
        $this->addSql('DROP TABLE entrepreneur_type');
        $this->addSql('DROP TABLE individual');
        $this->addSql('DROP TABLE link');
        $this->addSql('DROP TABLE notification');
        $this->addSql('DROP TABLE offer');
        $this->addSql('DROP TABLE payment_method');
        $this->addSql('DROP TABLE personal_infos');
        $this->addSql('DROP TABLE primary_contact');
        $this->addSql('DROP TABLE professional');
        $this->addSql('DROP TABLE projet');
        $this->addSql('DROP TABLE quote_request');
        $this->addSql('DROP TABLE type');
        $this->addSql('DROP TABLE `user`');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
