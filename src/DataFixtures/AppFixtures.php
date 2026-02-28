<?php

namespace App\DataFixtures;

use App\Entity\Admin;
use App\Entity\Adress;
use App\Entity\Category;
use App\Entity\Company;
use App\Entity\Individual;
use App\Entity\PersonalInfos;
use App\Entity\PrimaryContact;
use App\Entity\Professional;
use App\Entity\Projet;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Faker\Factory;

class AppFixtures extends Fixture
{
    private $faker;

    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {
        $this->faker = Factory::create('fr_CA');
    }

    public function load(ObjectManager $manager): void
    {
        // 1. Categories
        $categoriesData = [
            'Construction' => ['Gros œuvre', 'Fondations', 'Charpente'],
            'Rénovation' => ['Cuisine', 'Salle de bain', 'Sous-sol'],
            'Plomberie' => ['Tuyauterie', 'Chauffe-eau', 'Débouchage'],
            'Électricité' => ['Installation', 'Panneau électrique', 'Éclairage'],
        ];

        $categories = [];

        foreach ($categoriesData as $parentName => $subCategories) {
            $parent = new Category();
            $parent->setCategory($parentName);
            $manager->persist($parent);
            $categories[$parentName] = $parent;

            foreach ($subCategories as $subName) {
                $child = new Category();
                $child->setCategory($subName);
                $child->setParent($parent);
                $manager->persist($child);
                $categories[$subName] = $child;
            }
        }

        // List of all categories to pick from randomly
        $allCategories = array_values($categories);

        // 2. Admin User
        $admin = new Admin();
        $admin->setEmail('admin@test.com');
        $admin->setRoleLevel('Super Admin');
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin@test.com'));
        $manager->persist($admin);

        $quebecCities = ['Montréal', 'Québec', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Trois-Rivières', 'Lévis', 'Saguenay', 'Terrebonne'];

        // 3. 20 Professionals (Québec)
        for ($i = 0; $i < 20; $i++) {
            $pro = new Professional();
            $email = $this->faker->unique()->safeEmail();
            $pro->setEmail($email);
            $pro->setPassword($this->passwordHasher->hashPassword($pro, 'password123'));
            
            // Random category
            $randomCat = $allCategories[array_rand($allCategories)];
            $pro->setCategory($randomCat);
            
            // Role is inherited automatically, but ensure it's acting as professional
            $pro->setCity($this->faker->randomElement($quebecCities));
            $pro->setExpYears($this->faker->numberBetween(1, 35));
            $pro->setAbout($this->faker->realText(250));
            $pro->setPhoneNum($this->faker->phoneNumber());
            $pro->setCompanyName($this->faker->company());

            // Add Primary Contact for names
            $contact = new PrimaryContact();
            $contact->setFirstName($this->faker->firstName());
            $contact->setLastName($this->faker->lastName());
            $contact->setPhone($pro->getPhoneNum());
            $contact->setEmail($email);
            $manager->persist($contact);
            
            $pro->setPrimaryContact($contact);

            // Add an address mapped via Adress entity too
            $address = new Adress();
            $address->setStreet($this->faker->streetAddress());
            $address->setCity($pro->getCity());
            $address->setPostalCode((int) str_replace(' ', '', $this->faker->postcode()));
            $manager->persist($address);
            $pro->addAdresse($address);

            $manager->persist($pro);
        }

        // 4. 20 Individuals (Québec)
        for ($i = 0; $i < 20; $i++) {
            $ind = new Individual();
            $email = $this->faker->unique()->safeEmail();
            $ind->setEmail($email);
            $ind->setPassword($this->passwordHasher->hashPassword($ind, 'password123'));

            // Personal Infos
            $personalInfos = new PersonalInfos();
            $personalInfos->setFirstName($this->faker->firstName());
            $personalInfos->setLastName($this->faker->lastName());
            $personalInfos->setAdresse($this->faker->streetAddress() . ', ' . $this->faker->randomElement($quebecCities));
            $personalInfos->setPhoneNum($this->faker->phoneNumber());

            $manager->persist($personalInfos);
            $ind->setPersonalInfos($personalInfos);

            $manager->persist($ind);
        }

        $manager->flush();
    }
}
