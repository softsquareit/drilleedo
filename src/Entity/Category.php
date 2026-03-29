<?php

namespace App\Entity;

use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $name = null;

    // Parent category
    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'childs')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Category $parent = null;

    // Child categories
    #[ORM\OneToMany(mappedBy: 'parent', targetEntity: Category::class)]
    private Collection $childs;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $icon = null;

    #[ORM\Column(length: 10, nullable: true)]
    private ?string $color = null;

    /**
     * @var Collection<int, Professional>
     */
    #[ORM\OneToMany(targetEntity: Professional::class, mappedBy: 'category')]
    private Collection $professionals;

    /**
     * @var Collection<int, Company>
     */
    #[ORM\ManyToMany(targetEntity: Company::class, mappedBy: 'categories')]
    private Collection $companies;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private bool $isActive = true;

    public function __construct()
    {
        $this->professionals = new ArrayCollection();
        $this->companies = new ArrayCollection();
        $this->childs = new ArrayCollection();
    }

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

    public function __toString(): string
    {
        return $this->name ?? '';
    }


    public function getParent(): ?Category
    {
        return $this->parent;
    }

    public function setParent(?Category $parent): static
    {
        $this->parent = $parent;
        return $this;
    }

    /**
     * @return Collection<int, Category>
     */
    public function getChilds(): Collection
    {
        return $this->childs;
    }

    public function addChild(Category $child): static
    {
        if (!$this->childs->contains($child)) {
            $this->childs->add($child);
            $child->setParent($this);
        }

        return $this;
    }

    public function removeChild(Category $child): static
    {
        if ($this->childs->removeElement($child)) {
            if ($child->getParent() === $this) {
                $child->setParent(null);
            }
        }

        return $this;
    }


    /**
     * @return Collection<int, Professional>
     */
    public function getProfessionals(): Collection
    {
        return $this->professionals;
    }

    public function addProfessional(Professional $professional): static
    {
        if (!$this->professionals->contains($professional)) {
            $this->professionals->add($professional);
            $professional->setCategory($this);
        }

        return $this;
    }

    public function removeProfessional(Professional $professional): static
    {
        if ($this->professionals->removeElement($professional)) {
            if ($professional->getCategory() === $this) {
                $professional->setCategory(null);
            }
        }

        return $this;
    }


    /**
     * @return Collection<int, Company>
     */
    public function getCompanies(): Collection
    {
        return $this->companies;
    }

    public function addCompany(Company $company): static
    {
        if (!$this->companies->contains($company)) {
            $this->companies->add($company);
            $company->addCategory($this);
        }

        return $this;
    }

    public function removeCompany(Company $company): static
    {
        if ($this->companies->removeElement($company)) {
            $company->removeCategory($this);
        }

        return $this;
    }

    public function getIcon(): ?string
    {
        if ($this->icon) {
            return $this->icon;
        }

        return $this->parent?->getIcon();
    }

    public function getRawIcon(): ?string
    {
        return $this->icon;
    }

    public function setIcon(?string $icon): static
    {
        $this->icon = $icon;
        return $this;
    }

    public function getColor(): ?string
    {
        if ($this->color) {
            return $this->color;
        }

        return $this->parent?->getColor();
    }

    public function getRawColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): static
    {
        $this->color = $color;
        return $this;
    }

    public function getSlug(): string
    {
        $slugger = new \Symfony\Component\String\Slugger\AsciiSlugger();
        return strtolower($slugger->slug($this->getName() ?? '')->toString());
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;
        return $this;
    }
}