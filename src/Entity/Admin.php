<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;


use App\Repository\AdminRepository;

#[ORM\Entity(repositoryClass: AdminRepository::class)]
class Admin extends User
{
    
    private ?string $roleLevel = null;

    public function getRoleLevel(): ?string
    {
        return $this->roleLevel;
    }

    public function setRoleLevel(string $roleLevel): static
    {
        $this->roleLevel = $roleLevel;
        return $this;
    }
}
