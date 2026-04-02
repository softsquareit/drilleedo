<?php

namespace App\Controller;

use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\String\Slugger\SluggerInterface;

class MenuController extends AbstractController
{
    public function categoryMegaMenu(CategoryRepository $categoryRepository, SluggerInterface $slugger): Response
    {
        // Fetch only parent categories
        $parentCategories = $categoryRepository->findBy(['parent' => null]);
        
        $categoriesData = [];
        foreach ($parentCategories as $parent) {
            $parentSlug = strtolower($slugger->slug($parent->getName()));
            
            $children = [];
            foreach ($parent->getChilds() as $child) {
                // Check if child works/is active if needed. For now, we take all children.
                $children[] = [
                    'id' => $child->getId(),
                    'name' => $child->getName(),
                    'slug' => strtolower($slugger->slug($child->getName()))
                ];
            }
            
            $categoriesData[] = [
                'id' => $parent->getId(),
                'name' => $parent->getName(),
                'slug' => $parentSlug,
                'icon' => $parent->getIcon(),
                'banner' => $parent->getBanner(),
                'children' => $children
            ];
        }
        
        return $this->render('partials/_category_mega_menu.html.twig', [
            'categoriesData' => $categoriesData,
        ]);
    }
}
