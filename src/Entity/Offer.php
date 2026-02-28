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
        $this->status = 'PENDING';
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
}
