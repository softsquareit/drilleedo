<?php

namespace App\Entity;

use App\Repository\AdressRepository;
use Doctrine\ORM\Mapping as ORM;


#[ORM\Entity(repositoryClass: AdressRepository::class)]
class Adress
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $street = null;

    #[ORM\Column(length: 255)]
    private ?string $city = null;

    #[ORM\Column]
    private ?int $postalCode = null;

    #[ORM\ManyToOne(inversedBy: 'Adresse')]
    private ?Business $business = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStreet(): ?string
    {
        return $this->street;
    }

    public function setStreet(string $street): static
    {
        $this->street = $street;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getPostalCode(): ?int
    {
        return $this->postalCode;
    }

    public function setPostalCode(int $postalCode): static
    {
        $this->postalCode = $postalCode;

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
}
