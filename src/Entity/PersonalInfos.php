<?php

namespace App\Entity;

use App\Repository\PersonalInfosRepository;
use Doctrine\ORM\Mapping as ORM;


#[ORM\Entity(repositoryClass: PersonalInfosRepository::class)]
class PersonalInfos
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $first_name = null;

    #[ORM\Column(length: 255)]
    private ?string $last_name = null;

    #[ORM\Column(length: 255)]
    private ?string $adresse = null;

    #[ORM\Column(length: 50)]
    private ?string $phone_num = null;

    #[ORM\OneToOne(mappedBy: 'personal_infos', cascade: ['persist', 'remove'])]
    private ?User $r_user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->first_name;
    }

    public function setFirstName(string $first_name): static
    {
        $this->first_name = $first_name;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->last_name;
    }

    public function setLastName(string $last_name): static
    {
        $this->last_name = $last_name;

        return $this;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(string $adresse): static
    {
        $this->adresse = $adresse;

        return $this;
    }

    public function getPhoneNum(): ?string
    {
        return $this->phone_num;
    }

    public function setPhoneNum(string $phone_num): static
    {
        $this->phone_num = $phone_num;

        return $this;
    }

    public function getRUser(): ?User
    {
        return $this->r_user;
    }

    public function setRUser(?User $r_user): static
    {
        
        if ($r_user === null && $this->r_user !== null) {
            $this->r_user->setPersonalInfos(null);
        }

        
        if ($r_user !== null && $r_user->getPersonalInfos() !== $this) {
            $r_user->setPersonalInfos($this);
        }

        $this->r_user = $r_user;

        return $this;
    }
}
