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

    public const AVAILABILITY_AVAILABLE = 'AVAILABLE';
    public const AVAILABILITY_BUSY = 'BUSY';
    public const AVAILABILITY_UNAVAILABLE = 'UNAVAILABLE';

    #[ORM\Column(length: 20, options: ['default' => self::AVAILABILITY_AVAILABLE])]
    private string $availabilityStatus = self::AVAILABILITY_AVAILABLE;



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

    public function getAvailabilityStatus(): string
    {
        return $this->availabilityStatus;
    }

    public function setAvailabilityStatus(string $availabilityStatus): static
    {
        $this->availabilityStatus = $availabilityStatus;

        return $this;
    }
}
