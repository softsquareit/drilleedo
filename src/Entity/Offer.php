<?php

namespace App\Entity;

use App\Repository\OfferRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;


#[ORM\Entity(repositoryClass: OfferRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Offer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
 
    public const STATUS_DRAFT      = 'DRAFT';
    public const STATUS_PUBLISHED  = 'PUBLISHED';
    public const STATUS_INTERESTED = 'INTERESTED';
    public const STATUS_REJECTED   = 'REJECTED';
    public const STATUS_ACCEPTED   = 'ACCEPTED';
    public const STATUS_CLOSED     = 'CLOSED';

    #[ORM\Column]
    private ?float $price = null;

    #[ORM\Column(type: 'text')]
    private ?string $description = null;

    #[ORM\Column(length: 50)]
    private ?string $status = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $documents = [];

    #[ORM\Column(nullable: true)]
    private ?bool $priorVisit = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $possibleStartDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $viewedAt = null;

    #[ORM\Column(nullable: true)]
    private ?int $estimatedDuration = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $estimatedDurationUnit = null;

    #[ORM\Column(nullable: true)]
    private ?int $depositPercent = null;

    #[ORM\Column(nullable: true)]
    private ?int $warrantyMonths = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $paymentMethod = null;

    #[ORM\ManyToOne(inversedBy: 'offers')]
    #[ORM\JoinColumn(nullable: true)]
    private ?QuoteRequest $quoteRequest = null;

    #[ORM\ManyToOne(inversedBy: 'offers')]
    #[ORM\JoinColumn(nullable: true)]
    private ?DirectRequest $directRequest = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    private ?Business $provider = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->status = self::STATUS_DRAFT;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

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

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getQuoteRequest(): ?QuoteRequest
    {
        return $this->quoteRequest;
    }

    public function setQuoteRequest(?QuoteRequest $quoteRequest): static
    {
        $this->quoteRequest = $quoteRequest;

        return $this;
    }

    public function getDirectRequest(): ?DirectRequest
    {
        return $this->directRequest;
    }

    public function setDirectRequest(?DirectRequest $directRequest): static
    {
        $this->directRequest = $directRequest;

        return $this;
    }

    public function getProvider(): ?Business
    {
        return $this->provider;
    }

    public function setProvider(?Business $provider): static
    {
        $this->provider = $provider;

        return $this;
    }

    public function getDocuments(): ?array
    {
        return $this->documents;
    }

    public function setDocuments(?array $documents): static
    {
        $this->documents = $documents;

        return $this;
    }

    public function isPriorVisit(): ?bool
    {
        return $this->priorVisit;
    }

    public function setPriorVisit(?bool $priorVisit): static
    {
        $this->priorVisit = $priorVisit;

        return $this;
    }

    public function getPossibleStartDate(): ?\DateTimeInterface
    {
        return $this->possibleStartDate;
    }

    public function setPossibleStartDate(?\DateTimeInterface $possibleStartDate): static
    {
        $this->possibleStartDate = $possibleStartDate;

        return $this;
    }

    public function getEstimatedDuration(): ?int
    {
        return $this->estimatedDuration;
    }

    public function setEstimatedDuration(?int $estimatedDuration): static
    {
        $this->estimatedDuration = $estimatedDuration;

        return $this;
    }

    public function getEstimatedDurationUnit(): ?string
    {
        return $this->estimatedDurationUnit;
    }

    public function setEstimatedDurationUnit(?string $estimatedDurationUnit): static
    {
        $this->estimatedDurationUnit = $estimatedDurationUnit;

        return $this;
    }

    public function getViewedAt(): ?\DateTimeInterface
    {
        return $this->viewedAt;
    }

    public function setViewedAt(?\DateTimeInterface $viewedAt): static
    {
        $this->viewedAt = $viewedAt;

        return $this;
    }

    public function isViewed(): bool
    {
        return $this->viewedAt !== null;
    }

    public function getDepositPercent(): ?int
    {
        return $this->depositPercent;
    }

    public function setDepositPercent(?int $depositPercent): static
    {
        $this->depositPercent = $depositPercent;

        return $this;
    }

    public function getWarrantyMonths(): ?int
    {
        return $this->warrantyMonths;
    }

    public function setWarrantyMonths(?int $warrantyMonths): static
    {
        $this->warrantyMonths = $warrantyMonths;

        return $this;
    }

    public function getPaymentMethod(): ?string
    {
        return $this->paymentMethod;
    }

    public function setPaymentMethod(?string $paymentMethod): static
    {
        $this->paymentMethod = $paymentMethod;

        return $this;
    }
}
