<?php

namespace App\Entity;

use App\Repository\EntrepreneurTypeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;


#[ORM\Entity(repositoryClass: EntrepreneurTypeRepository::class)]
class EntrepreneurType
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $type = null;

    #[ORM\OneToMany(mappedBy: 'entrepreneurType', targetEntity: Business::class)]
    private Collection $businesses;

    public function __construct()
    {
        $this->businesses = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    
    public function getBusinesses(): Collection
    {
        return $this->businesses;
    }

    public function addBusiness(Business $business): static
    {
        if (!$this->businesses->contains($business)) {
            $this->businesses->add($business);
            $business->setEntrepreneurType($this);
        }

        return $this;
    }

    public function removeBusiness(Business $business): static
    {
        if ($this->businesses->removeElement($business)) {
            
            if ($business->getEntrepreneurType() === $this) {
                $business->setEntrepreneurType(null);
            }
        }

        return $this;
    }
}
