<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Validator\Constraints as Assert;






#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\InheritanceType('JOINED')]
#[ORM\DiscriminatorColumn(name: 'type', type: 'string')]
#[ORM\DiscriminatorMap([
    'user' => User::class,
    'admin' => Admin::class,
    'business' => Business::class,
    'individual' => Individual::class,
    'professional' => Professional::class,
    'company' => Company::class,
])]

abstract class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    
    
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    protected ?int $id = null;

    
    #[ORM\Column(length: 180, unique: true)]
    protected ?string $email = null;

    #[ORM\Column]
    protected ?string $password = null;

    
    #[ORM\OneToOne(inversedBy: 'r_user', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: true)]
    private ?PersonalInfos $personal_infos = null;

    
    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Notification::class, cascade: ['persist', 'remove'])]
    private Collection $notifications;

    #[ORM\OneToMany(mappedBy: 'author', targetEntity: Blog::class)]
    private Collection $blogs;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Comment::class)]
    private Collection $comments;

    public function __construct()
    {
        $this->notifications = new ArrayCollection();
        $this->blogs = new ArrayCollection();
        $this->comments = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function getPersonalInfos(): ?PersonalInfos
    {
        return $this->personal_infos;
    }

    public function setPersonalInfos(?PersonalInfos $personal_infos): static
    {
        $this->personal_infos = $personal_infos;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = ['ROLE_USER'];

        if ($this instanceof Admin) {
            $roles[] = 'ROLE_ADMIN';
        } 
        
        if ($this instanceof Business) {
            $roles[] = 'ROLE_BUSINESS';
        }

        if ($this instanceof Company) {
            $roles[] = 'ROLE_COMPANY';
        }

        if ($this instanceof Professional) {
            $roles[] = 'ROLE_PROFESSIONAL';
        }
        
        if ($this instanceof Individual) {
            $roles[] = 'ROLE_INDIVIDUAL';
        }

        return array_unique($roles);
    }

    public function getType(): string
    {
        return (new \ReflectionClass($this))->getShortName();
    }

    public function eraseCredentials(): void
    {
        $this->plainPassword = null;
    }

    
    public function getNotifications(): Collection
    {
        return $this->notifications;
    }

    public function addNotification(Notification $notification): static
    {
        if (!$this->notifications->contains($notification)) {
            $this->notifications->add($notification);
            $notification->setUser($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): static
    {
        if ($this->notifications->removeElement($notification)) {
            
            if ($notification->getUser() === $this) {
                $notification->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Blog>
     */
    public function getBlogs(): Collection
    {
        return $this->blogs;
    }

    public function addBlog(Blog $blog): static
    {
        if (!$this->blogs->contains($blog)) {
            $this->blogs->add($blog);
            $blog->setAuthor($this);
        }

        return $this;
    }

    public function removeBlog(Blog $blog): static
    {
        if ($this->blogs->removeElement($blog)) {
            // set the owning side to null (unless already changed)
            if ($blog->getAuthor() === $this) {
                $blog->setAuthor(null);
            }
        }

        return $this;
    }

    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setUser($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getUser() === $this) {
                $comment->setUser(null);
            }
        }

        return $this;
    }
}
