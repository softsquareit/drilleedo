<?php

namespace App\Entity;

use App\Repository\ProfessionalRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProfessionalRepository::class)]
class Professional extends Business
{
    #[ORM\Column(length: 30)]
    private ?string $city = null;

    #[ORM\ManyToOne(inversedBy: 'professionals')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null;

    #[ORM\Column]
    private ?int $expYears = null;



    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getExpYears(): ?int
    {
        return $this->expYears;
    }

    public function setExpYears(?int $expYears): static
    {
        $this->expYears = $expYears;

        return $this;
    }   
}
