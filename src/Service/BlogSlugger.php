<?php

namespace App\Service;

use App\Repository\BlogRepository;
use Symfony\Component\String\Slugger\SluggerInterface;

class BlogSlugger
{
    public function __construct(
        private SluggerInterface $slugger,
        private BlogRepository $blogRepository,
    ) {
    }

    /**
     * Génère un slug unique à partir du titre.
     * Si le slug existe déjà en base, ajoute un suffixe numérique (-2, -3, …).
     *
     * @param string   $title      Titre source
     * @param int|null $excludeId  ID du blog en cours d'édition (exclure du test d'unicité)
     */
    public function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $base = strtolower($this->slugger->slug($title)->toString());
        $slug = $base;
        $counter = 2;

        while ($this->slugExists($slug, $excludeId)) {
            $slug = $base . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function slugExists(string $slug, ?int $excludeId): bool
    {
        $qb = $this->blogRepository->createQueryBuilder('b')
            ->where('b.slug = :slug')
            ->setParameter('slug', $slug);

        if ($excludeId !== null) {
            $qb->andWhere('b.id != :id')->setParameter('id', $excludeId);
        }

        return $qb->getQuery()->getOneOrNullResult() !== null;
    }
}
