<?php

namespace App\DataFixtures;

use App\Entity\Adress;
use App\Entity\Category;
use App\Entity\Company;
use App\Entity\Link;
use App\Entity\PrimaryContact;
use App\Entity\Professional;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Faker\Factory;

class CompanyFixtures extends Fixture
{
    private $faker;

    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {
        $this->faker = Factory::create('fr_CA');
    }

    public function load(ObjectManager $manager): void
    {
        $categories = $manager->getRepository(Category::class)->findAll();
        $professionals = $manager->getRepository(Professional::class)->findAll();

        $quebecCities = ['Montréal', 'Québec', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Trois-Rivières', 'Lévis', 'Saguenay', 'Terrebonne'];

        for ($i = 0; $i < 20; $i++) {
            $company = new Company();
            $email = "company" . $i . "@example.ca";
            $company->setEmail($email);
            $company->setPassword($this->passwordHasher->hashPassword($company, 'password123'));
            
            $name = $this->faker->company() . " " . $this->faker->randomElement(['Inc.', 'Ltée', 'Général']);
            $company->setCompanyName($name);
            $company->setTradeName($name);
            $company->setPhoneNum($this->faker->phoneNumber());
            $company->setWebsite('https://www.' . strtolower(str_replace(' ', '', $name)) . '.ca');
            $company->setFoundationYear((string)$this->faker->numberBetween(1980, 2023));
            $company->setEmpNum($this->faker->numberBetween(5, 150));
            $company->setCompanyNum((string)$this->faker->numberBetween(1000000000, 9999999999)); // NEQ
            $company->setLicenceNum("RBQ " . $this->faker->numberBetween(1234, 9876) . "-" . $this->faker->numberBetween(12, 99));

            $company->setAbout($this->faker->realText(500));
            $company->setWhyChooseUs([
                "Local expertise across Canada",
                "Licensed, certified, and fully insured",
                "100% satisfaction guaranteed",
                "Dynamic and rigorous team"
            ]);
            $company->setServices([
                "Residential renovation",
                "Commercial construction",
                "Project management",
                "Technical consultation"
            ]);

            // Categories
            $randomCats = (array)array_rand($categories, min(3, count($categories)));
            foreach ($randomCats as $catIndex) {
                $company->addCategory($categories[$catIndex]);
            }

            // Primary Contact
            $contact = new PrimaryContact();
            $contact->setFirstName($this->faker->firstName());
            $contact->setLastName($this->faker->lastName());
            $contact->setPhone($company->getPhoneNum());
            $contact->setEmail($email);
            $manager->persist($contact);
            $company->setPrimaryContact($contact);

            // Address
            $address = new Adress();
            $city = $this->faker->randomElement($quebecCities);
            $address->setStreet($this->faker->streetAddress());
            $address->setCity($city);
            $address->setPostalCode((int) str_replace(' ', '', $this->faker->postcode()));
            $manager->persist($address);
            $company->addAdresse($address);

            // Note: Link with professionals is not explicitly defined in Company entity 
            // beyond inheriting 'links' (which are URLs) from Business.
            // If the user meant linking via Link entity (URLs to pro profiles) or similar:
            if (!empty($professionals)) {
                $randomPro = $professionals[array_rand($professionals)];
                $link = new Link();
                $link->setLink('https://drilleedo.ca/professional/' . $randomPro->getId());
                $link->setType('Professional Partner');
                $link->setBusiness($company);
                $manager->persist($link);
            }

            $manager->persist($company);
        }

        $manager->flush();
    }
}
