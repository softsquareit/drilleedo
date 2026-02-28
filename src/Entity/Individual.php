<?php

namespace App\Entity;

use App\Repository\IndividualRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;


#[ORM\Entity(repositoryClass: IndividualRepository::class)]
class Individual extends User
{

    
    #[ORM\OneToMany(mappedBy: 'individual', targetEntity: QuoteRequest::class, cascade: ['persist', 'remove'])]
    private Collection $quoteRequests;

    #[ORM\OneToMany(mappedBy: 'individual', targetEntity: DirectRequest::class, cascade: ['persist', 'remove'])]
    private Collection $directRequests;

    public function __construct()
    {
        $this->quoteRequests = new ArrayCollection();
        $this->directRequests = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    
    public function getQuoteRequests(): Collection
    {
        return $this->quoteRequests;
    }

    public function addQuoteRequest(QuoteRequest $quoteRequest): static
    {
        if (!$this->quoteRequests->contains($quoteRequest)) {
            $this->quoteRequests->add($quoteRequest);
            $quoteRequest->setIndividual($this);
        }

        return $this;
    }

    public function removeQuoteRequest(QuoteRequest $quoteRequest): static
    {
        if ($this->quoteRequests->removeElement($quoteRequest)) {
            
            if ($quoteRequest->getIndividual() === $this) {
                $quoteRequest->setIndividual(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, DirectRequest>
     */
    public function getDirectRequests(): Collection
    {
        return $this->directRequests;
    }

    public function addDirectRequest(DirectRequest $directRequest): static
    {
        if (!$this->directRequests->contains($directRequest)) {
            $this->directRequests->add($directRequest);
            $directRequest->setIndividual($this);
        }

        return $this;
    }

    public function removeDirectRequest(DirectRequest $directRequest): static
    {
        if ($this->directRequests->removeElement($directRequest)) {
            // set the owning side to null (unless already changed)
            if ($directRequest->getIndividual() === $this) {
                $directRequest->setIndividual(null);
            }
        }

        return $this;
    }
}
