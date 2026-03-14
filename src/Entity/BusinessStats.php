<?php

namespace App\Entity;

use App\Repository\BusinessStatsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BusinessStatsRepository::class)]
class BusinessStats
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'stats', targetEntity: Business::class, cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Business $business = null;

    #[ORM\Column(type: 'float', options: ['default' => 0])]
    private float $averageRating = 0;

    #[ORM\Column(options: ['default' => 0])]
    private int $reviewCount = 0;

    #[ORM\Column(nullable: true)]
    private ?int $avgResponseTime = null; // in seconds

    #[ORM\Column(type: 'float', options: ['default' => 0])]
    private float $completionRate = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBusiness(): ?Business
    {
        return $this->business;
    }

    public function setBusiness(Business $business): static
    {
        $this->business = $business;

        return $this;
    }

    public function getAverageRating(): float
    {
        return $this->averageRating;
    }

    public function setAverageRating(float $averageRating): static
    {
        $this->averageRating = $averageRating;

        return $this;
    }

    public function getReviewCount(): int
    {
        return $this->reviewCount;
    }

    public function setReviewCount(int $reviewCount): static
    {
        $this->reviewCount = $reviewCount;

        return $this;
    }

    public function getAvgResponseTime(): ?int
    {
        return $this->avgResponseTime;
    }

    public function setAvgResponseTime(?int $avgResponseTime): static
    {
        $this->avgResponseTime = $avgResponseTime;

        return $this;
    }

    public function getCompletionRate(): float
    {
        return $this->completionRate;
    }

    public function setCompletionRate(float $completionRate): static
    {
        $this->completionRate = $completionRate;

        return $this;
    }
}
