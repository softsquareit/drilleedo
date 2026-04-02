<?php

namespace App\Entity;

use App\Repository\DirectRequestRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: DirectRequestRepository::class)]
class DirectRequest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: 'text')]
    private ?string $description = null;

    public const STATUS_DRAFT       = 'DRAFT';
    public const STATUS_PUBLISHED   = 'PUBLISHED';
    public const STATUS_ACCEPTED    = 'ACCEPTED';
    public const STATUS_IN_PROGRESS = 'IN_PROGRESS';
    public const STATUS_CLOSED      = 'CLOSED';

    #[ORM\Column(length: 50)]
    private ?string $status = self::STATUS_DRAFT;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $images = [];

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $brochureFilename = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $creationDate = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $languages = [];

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $desiredStartDate = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $availabilities = [];

    #[ORM\Column(options: ['default' => false])]
    private bool $urgentIntervention = false;

    #[ORM\ManyToOne]
    private ?Category $category = null;

    #[ORM\ManyToOne(inversedBy: 'directRequests')]
    private ?Individual $individual = null;

    #[ORM\ManyToOne]
    private ?Professional $targetProfessional = null;

    #[ORM\ManyToOne]
    private ?Company $targetCompany = null;

    #[ORM\OneToMany(mappedBy: 'directRequest', targetEntity: Offer::class, cascade: ['persist', 'remove'])]
    private Collection $offers;

    public function __construct()
    {
        $this->creationDate = new \DateTime();
        $this->status = self::STATUS_DRAFT;
        $this->images = [];
        $this->offers = new ArrayCollection();
        $this->languages = [];
        $this->availabilities = [];
        $this->urgentIntervention = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

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

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creationDate;
    }

    public function setCreationDate(\DateTimeInterface $creationDate): static
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getIndividual(): ?Individual
    {
        return $this->individual;
    }

    public function setIndividual(?Individual $individual): static
    {
        $this->individual = $individual;

        return $this;
    }

    public function getImages(): ?array
    {
        return $this->images;
    }

    public function setImages(?array $images): static
    {
        $this->images = $images;

        return $this;
    }

    public function getBrochureFilename(): ?string
    {
        return $this->brochureFilename;
    }

    public function setBrochureFilename(string $brochureFilename): static
    {
        $this->brochureFilename = $brochureFilename;

        return $this;
    }

    public function getLanguages(): ?array
    {
        return $this->languages;
    }

    public function setLanguages(?array $languages): static
    {
        $this->languages = $languages;

        return $this;
    }

    public function getDesiredStartDate(): ?\DateTimeInterface
    {
        return $this->desiredStartDate;
    }

    public function setDesiredStartDate(?\DateTimeInterface $desiredStartDate): static
    {
        $this->desiredStartDate = $desiredStartDate;

        return $this;
    }

    public function getAvailabilities(): ?array
    {
        return $this->availabilities;
    }

    public function setAvailabilities(?array $availabilities): static
    {
        $this->availabilities = $availabilities;

        return $this;
    }

    public function isUrgentIntervention(): bool
    {
        return $this->urgentIntervention;
    }

    public function setUrgentIntervention(bool $urgentIntervention): static
    {
        $this->urgentIntervention = $urgentIntervention;

        return $this;
    }

    public function getTargetProfessional(): ?Professional
    {
        return $this->targetProfessional;
    }

    public function setTargetProfessional(?Professional $targetProfessional): static
    {
        $this->targetProfessional = $targetProfessional;

        return $this;
    }

    public function getTargetCompany(): ?Company
    {
        return $this->targetCompany;
    }

    public function setTargetCompany(?Company $targetCompany): static
    {
        $this->targetCompany = $targetCompany;

        return $this;
    }

    /**
     * @return Collection<int, Offer>
     */
    public function getOffers(): Collection
    {
        return $this->offers;
    }

    public function addOffer(Offer $offer): static
    {
        if (!$this->offers->contains($offer)) {
            $this->offers->add($offer);
            $offer->setDirectRequest($this);
        }

        return $this;
    }

    public function removeOffer(Offer $offer): static
    {
        if ($this->offers->removeElement($offer)) {
            // set the owning side to null (unless already changed)
            if ($offer->getDirectRequest() === $this) {
                $offer->setDirectRequest(null);
            }
        }

        return $this;
    }
}
