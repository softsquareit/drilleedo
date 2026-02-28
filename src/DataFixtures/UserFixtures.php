<?php

namespace App\DataFixtures;

use App\Entity\Admin;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $admin = new Admin();
        $admin->setEmail('admin@admin.com');
        
        $hashedPassword = $this->passwordHasher->hashPassword(
            $admin,
            '0000'
        );
        $admin->setPassword($hashedPassword);
        
        // The Admin entity is an instance of Admin, so getRoles() will include ROLE_ADMIN.
        // If the user entity had a 'roles' property, we would set it here.
        // Since it doesn't, we just persist the Admin entity. 
        // If the system requires ROLE_SUPER_ADMIN specifically for some checks, 
        // it might need a roles property in the User entity, but I will stick to what's available.
        
        $manager->persist($admin);
        $manager->flush();
    }
}
