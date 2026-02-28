<?php

namespace App\Entity;

use App\Repository\CompanyRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: CompanyRepository::class)]
class Company extends Business
{
    public function __construct()
    {
        parent::__construct();
        $this->categories = new ArrayCollection();
    }
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Website = null;

    public function getWebsite(): ?string
    {
        return $this->Website;
    }

    public function setWebsite(?string $Website): static
    {
        $this->Website = $Website;

        return $this;
    }

    #[ORM\ManyToMany(targetEntity: Category::class, inversedBy: 'companies')]
    private Collection $categories;

    #[ORM\Column(length: 10, nullable: true)]
    private ?string $foundationYear = null;

    #[ORM\Column(nullable: true)]
    private ?int $EmpNum = null;

    public function getFoundationYear(): ?string
    {
        return $this->foundationYear;
    }

    public function setFoundationYear(?string $foundationYear): static
    {
        $this->foundationYear = $foundationYear;

        return $this;
    }

    public function getEmpNum(): ?int
    {
        return $this->EmpNum;
    }

    public function setEmpNum(?int $EmpNum): static
    {
        $this->EmpNum = $EmpNum;

        return $this;
    }

    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategory(Category $category): static
    {
        if (!$this->categories->contains($category)) {
            $this->categories->add($category);
        }

        return $this;
    }

    public function removeCategory(Category $category): static
    {
        $this->categories->removeElement($category);

        return $this;
    }
}

