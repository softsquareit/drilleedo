<?php

namespace App\Controller;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'api_')]
class CategoryController extends AbstractController
{
    #[Route('/categories/{id}/children', name: 'categories_children', methods: ['GET'])]
    public function getChildren(int $id, CategoryRepository $categoryRepository, \Symfony\Component\HttpFoundation\Request $request): JsonResponse
    {
        $category = $categoryRepository->find($id);
        if (!$category) {
            return new JsonResponse(['error' => 'Category not found'], 404);
        }

        $locale = $request->getLocale();
        $children = [];
        foreach ($category->getChilds() as $child) {
            $children[] = [
                'id' => $child->getId(),
                'name' => $child->getLocalizedTitle($locale),
            ];
        }

        // Sort by name
        usort($children, fn($a, $b) => strcmp($a['name'], $b['name']));

        return new JsonResponse($children);
    }
}
