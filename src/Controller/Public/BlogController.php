<?php

namespace App\Controller\Public;

use App\Entity\Blog;
use App\Repository\BlogRepository;
use App\Repository\TypeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Comment;
use App\Form\CommentType;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/', name: 'public_blog_')]
class BlogController extends AbstractController
{
    #[Route('/blogs', name: 'list', methods: ['GET'])]
    public function index(Request $request, BlogRepository $blogRepository, \App\Repository\CategoryRepository $categoryRepository): Response
    {
        $criteria = ['type' => 'Post'];
        
        // Handle Type Filter (override default if present)
        $typeFilter = $request->query->get('type');
        if ($typeFilter && in_array($typeFilter, ['Post', 'Idea'])) {
            $criteria['type'] = $typeFilter;
        }

        // Handle Category Filter
        $categoryFilter = $request->query->get('category');
        if ($categoryFilter) {
            $category = $categoryRepository->find($categoryFilter);
            if ($category) {
                $criteria['category'] = $category;
            }
        }
        
        // Search logic
        $search = $request->query->get('search');
        if ($search) {
             // For simplicity, we can't easily mix array criteria with search query builder here without refactoring to QueryBuilder
             // But for now let's keep search simple or rely on repository method if exists. 
             // Ideally we should use a custom repository method for search + filters.
             // Let's defer complex search refactor and focus on filters first as requested.
        }

        // Pagination
        $page = $request->query->getInt('page', 1);
        $limit = 6;
        $offset = ($page - 1) * $limit;

        $blogs = $blogRepository->findBy($criteria, ['createdAt' => 'DESC'], $limit, $offset);
        $totalBlogs = $blogRepository->count($criteria);
        $totalPages = ceil($totalBlogs / $limit);
        
        $categories = $categoryRepository->findAll();

        return $this->render('blog/public_list.html.twig', [
            'items' => $blogs,
            'categories' => $categories,
            'currentCategory' => $categoryFilter,
            'currentType' => $criteria['type'],
            'pageTitle' => $criteria['type'] === 'Idea' ? 'Ideas' : 'Blogs', 
            'pageRoute' => 'public_blog_list',
            'currentPage' => $page,
            'totalPages' => $totalPages,
            'totalItems' => $totalBlogs
        ]);
    }

    #[Route('/ideas', name: 'ideas', methods: ['GET'])]
    public function ideas(Request $request, BlogRepository $blogRepository, \App\Repository\CategoryRepository $categoryRepository): Response
    {
        $criteria = ['type' => 'Idea'];

        // Handle Type Filter
        $typeFilter = $request->query->get('type');
        if ($typeFilter && in_array($typeFilter, ['Post', 'Idea'])) {
            $criteria['type'] = $typeFilter;
        }

        // Handle Category Filter
        $categoryFilter = $request->query->get('category');
        if ($categoryFilter) {
            $category = $categoryRepository->find($categoryFilter);
            if ($category) {
                $criteria['category'] = $category;
            }
        }
        
        // Pagination
        $page = $request->query->getInt('page', 1);
        $limit = 6;
        $offset = ($page - 1) * $limit;

        $ideas = $blogRepository->findBy($criteria, ['createdAt' => 'DESC'], $limit, $offset);
        $totalIdeas = $blogRepository->count($criteria);
        $totalPages = ceil($totalIdeas / $limit);
        
        $categories = $categoryRepository->findAll();

        return $this->render('blog/public_list.html.twig', [
            'items' => $ideas,
            'categories' => $categories,
            'currentCategory' => $categoryFilter,
            'currentType' => $criteria['type'],
            'pageTitle' => $criteria['type'] === 'Post' ? 'Blogs' : 'Ideas',
            'pageRoute' => 'public_blog_ideas',
            'currentPage' => $page,
            'totalPages' => $totalPages,
            'totalItems' => $totalIdeas
        ]);
    }

    #[Route('/post/{id}', name: 'show', methods: ['GET', 'POST'])]
    public function show(Blog $blog, BlogRepository $blogRepository, Request $request, EntityManagerInterface $entityManager): Response
    {
        $comment = new Comment();
        $form = $this->createForm(CommentType::class, $comment);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            if (!$this->getUser()) {
                $this->addFlash('error', 'You must be logged in to comment.');
                return $this->redirectToRoute('app_login'); // Verify this route name
            }

            $comment->setUser($this->getUser());
            $comment->setBlog($blog);
            
            $entityManager->persist($comment);
            $entityManager->flush();

            $this->addFlash('success', 'Your comment has been posted.');

            return $this->redirectToRoute('public_blog_show', ['id' => $blog->getId()]);
        }

        $relatedBlogs = [];
        if ($blog->getCategory()) {
            $relatedBlogs = $blogRepository->createQueryBuilder('b')
                ->where('b.category = :category')
                ->andWhere('b.id != :currentId')
                ->setParameter('category', $blog->getCategory())
                ->setParameter('currentId', $blog->getId())
                ->setMaxResults(2)
                ->orderBy('b.createdAt', 'DESC')
                ->getQuery()
                ->getResult();
        }

        return $this->render('blog/public_show.html.twig', [
            'blog' => $blog,
            'related_blogs' => $relatedBlogs,
            'commentForm' => $form->createView(),
        ]);
    }
}
