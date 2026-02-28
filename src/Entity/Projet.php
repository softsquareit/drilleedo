<?php

namespace App\Entity;

use App\Repository\ProjetRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;


#[ORM\Entity(repositoryClass: ProjetRepository::class)]
class Projet
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: 'text')]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTime $startDate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTime $EndDate = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $mainPhoto = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $gallery = [];

    #[ORM\ManyToOne(inversedBy: 'Projets')]
    private ?Business $business = null;

    #[ORM\Column(nullable: true)]
    private ?bool $state = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getStartDate(): ?\DateTime
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTime $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTime
    {
        return $this->EndDate;
    }

    public function setEndDate(?\DateTime $EndDate): static
    {
        $this->EndDate = $EndDate;

        return $this;
    }

    public function getBusiness(): ?Business
    {
        return $this->business;
    }

    public function setBusiness(?Business $business): static
    {
        $this->business = $business;

        return $this;
    }

    public function getMainPhoto(): ?string
    {
        return $this->mainPhoto;
    }

    public function setMainPhoto(?string $mainPhoto): static
    {
        $this->mainPhoto = $mainPhoto;

        return $this;
    }

    public function getGallery(): ?array
    {
        return $this->gallery;
    }

    public function setGallery(?array $gallery): static
    {
        $this->gallery = $gallery;

        return $this;
    }

    public function isState(): ?bool
    {
        return $this->state;
    }

    public function setState(?bool $state): static
    {
        $this->state = $state;

        return $this;
    }
}
