<?php

namespace App\Entity;

use App\Repository\BusinessRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;


#[ORM\Entity(repositoryClass: BusinessRepository::class)]
class Business extends User
{

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $company_name = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $tradeName = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $licenceNum = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $companyNum = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $logo = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $banner = null;

    #[ORM\OneToMany(mappedBy: 'business', targetEntity: Adress::class, cascade: ['persist', 'remove'])]
    private Collection $Adresse;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $phoneNum = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: true)]
    private ?PrimaryContact $primaryContact = null;

    #[ORM\ManyToMany(targetEntity: PaymentMethod::class)]
    private Collection $paymentMethod;

    #[ORM\OneToMany(mappedBy: 'business', targetEntity: Projet::class, cascade: ['persist', 'remove'])]
    private Collection $Projets;

    #[ORM\ManyToOne(inversedBy: 'businesses')]
    private ?EntrepreneurType $entrepreneurType = null;

    #[ORM\OneToMany(mappedBy: 'business', targetEntity: Link::class, cascade: ['persist', 'remove'])]
    private Collection $links;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $about = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $whyChooseUs = null; // Stored as array of strings

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $services = null; // Stored as array of strings

    #[ORM\Column(options: ['default' => false])]
    private bool $isVerified = false;

    #[ORM\Column(options: ['default' => false])]
    private bool $isTopRated = false;

    #[ORM\OneToOne(mappedBy: 'business', targetEntity: BusinessStats::class, cascade: ['persist', 'remove'])]
    private ?BusinessStats $stats = null;

    public function __construct()
    {
        $this->Adresse = new ArrayCollection();
        $this->paymentMethod = new ArrayCollection();
        $this->Projets = new ArrayCollection();
        $this->links = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCompanyName(): ?string
    {
        return $this->company_name;
    }

    public function setCompanyName(string $company_name): static
    {
        $this->company_name = $company_name;

        return $this;
    }

    public function getTradeName(): ?string
    {
        return $this->tradeName;
    }

    public function setTradeName(?string $tradeName): static
    {
        $this->tradeName = $tradeName;

        return $this;
    }

    public function getLicenceNum(): ?string
    {
        return $this->licenceNum;
    }

    public function setLicenceNum(?string $licenceNum): static
    {
        $this->licenceNum = $licenceNum;

        return $this;
    }

    public function getCompanyNum(): ?string
    {
        return $this->companyNum;
    }

    public function setCompanyNum(?string $companyNum): static
    {
        $this->companyNum = $companyNum;

        return $this;
    }

    public function getLogo(): ?string
    {
        return $this->logo;
    }

    public function setLogo(?string $logo): static
    {
        $this->logo = $logo;

        return $this;
    }

    public function getBanner(): ?string
    {
        return $this->banner;
    }

    public function setBanner(?string $banner): static
    {
        $this->banner = $banner;

        return $this;
    }

    
    public function getAdresse(): Collection
    {
        return $this->Adresse;
    }

    public function addAdresse(Adress $adresse): static
    {
        if (!$this->Adresse->contains($adresse)) {
            $this->Adresse->add($adresse);
            $adresse->setBusiness($this);
        }

        return $this;
    }

    public function removeAdresse(Adress $adresse): static
    {
        if ($this->Adresse->removeElement($adresse)) {
            
            if ($adresse->getBusiness() === $this) {
                $adresse->setBusiness(null);
            }
        }

        return $this;
    }

    public function getPhoneNum(): ?string
    {
        return $this->phoneNum;
    }

    public function setPhoneNum(?string $phoneNum): static
    {
        $this->phoneNum = $phoneNum;

        return $this;
    }

    public function getPrimaryContact(): ?PrimaryContact
    {
        return $this->primaryContact;
    }

    public function setPrimaryContact(?PrimaryContact $primaryContact): static
    {
        $this->primaryContact = $primaryContact;

        return $this;
    }

    
    public function getPaymentMethod(): Collection
    {
        return $this->paymentMethod;
    }

    public function addPaymentMethod(PaymentMethod $paymentMethod): static
    {
        if (!$this->paymentMethod->contains($paymentMethod)) {
            $this->paymentMethod->add($paymentMethod);
        }

        return $this;
    }

    public function removePaymentMethod(PaymentMethod $paymentMethod): static
    {
        $this->paymentMethod->removeElement($paymentMethod);

        return $this;
    }

    
    public function getProjets(): Collection
    {
        return $this->Projets;
    }

    public function addProjet(Projet $projet): static
    {
        if (!$this->Projets->contains($projet)) {
            $this->Projets->add($projet);
            $projet->setBusiness($this);
        }

        return $this;
    }

    public function removeProjet(Projet $projet): static
    {
        if ($this->Projets->removeElement($projet)) {
            
            if ($projet->getBusiness() === $this) {
                $projet->setBusiness(null);
            }
        }

        return $this;
    }

    public function getEntrepreneurType(): ?EntrepreneurType
    {
        return $this->entrepreneurType;
    }

    public function setEntrepreneurType(?EntrepreneurType $entrepreneurType): static
    {
        $this->entrepreneurType = $entrepreneurType;

        return $this;
    }

    
    public function getLinks(): Collection
    {
        return $this->links;
    }

    public function addLink(Link $link): static
    {
        if (!$this->links->contains($link)) {
            $this->links->add($link);
            $link->setBusiness($this);
        }

        return $this;
    }

    public function removeLink(Link $link): static
    {
        if ($this->links->removeElement($link)) {
            
            if ($link->getBusiness() === $this) {
                $link->setBusiness(null);
            }
        }

        return $this;
    }

    public function getAbout(): ?string
    {
        return $this->about;
    }

    public function setAbout(?string $about): static
    {
        $this->about = $about;

        return $this;
    }

    public function getWhyChooseUs(): ?array
    {
        return $this->whyChooseUs;
    }

    public function setWhyChooseUs(?array $whyChooseUs): static
    {
        $this->whyChooseUs = $whyChooseUs;

        return $this;
    }

    public function getServices(): ?array
    {
        return $this->services;
    }

    public function setServices(?array $services): static
    {
        $this->services = $services;

        return $this;
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    public function isTopRated(): bool
    {
        return $this->isTopRated;
    }

    public function setIsTopRated(bool $isTopRated): static
    {
        $this->isTopRated = $isTopRated;

        return $this;
    }

    public function getStats(): ?BusinessStats
    {
        return $this->stats;
    }

    public function setStats(?BusinessStats $stats): static
    {
        // unset the owning side of the relation if necessary
        if ($stats === null && $this->stats !== null) {
            $this->stats->setBusiness(null);
        }

        // set the owning side of the relation if necessary
        if ($stats !== null && $stats->getBusiness() !== $this) {
            $stats->setBusiness($this);
        }

        $this->stats = $stats;

        return $this;
    }
}
