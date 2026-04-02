<?php

namespace App\Controller\Admin;

use App\Entity\Blog;
use App\Entity\Category;
use App\Entity\Type;
use App\Form\BlogType;
use App\Service\BlogSlugger;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
class BlogController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private BlogSlugger $blogSlugger,
    ) {}

    #[Route('/dashboard/blogs', name: 'admin_blog_index')]
    public function listBlogs(Request $request): Response
    {
        $username = $this->getUser()->getUserIdentifier();
        $blog = new Blog();
        $form = $this->createForm(BlogType::class, $blog);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            if (!$blog->getSlug()) {
                $blog->setSlug($this->blogSlugger->generateUniqueSlug($blog->getTitle() ?? 'article'));
            }
            $this->em->persist($blog);
            $this->em->flush();
            return $this->redirectToRoute('admin_blog_index');
        }

        return $this->render('admin/blog/index.html.twig', [
            'username'   => $username,
            'blogs'      => $this->em->getRepository(Blog::class)->findAll(),
            'form'       => $form,
            'types'      => $this->em->getRepository(Type::class)->findAll(),
            'categories' => $this->em->getRepository(Category::class)->findAll(),
        ]);
    }

    #[Route('/dashboard/blogs/create', name: 'admin_blog_create')]
    public function createBlog(Request $request): Response
    {
        $blog = new Blog();

        if ($request->isMethod('POST')) {
            $data  = $request->request->all('blog');
            $title = $data['Title'] ?? null;
            if ($title) {
                $blog->setTitle($title);
                $blog->setShortDesc('New Blog Post');
                $blog->setDescription('Content goes here...');
                $blog->setMainImg('placeholder.jpg');
                $blog->setSlug($this->blogSlugger->generateUniqueSlug($title));
                $defaultCategory = $this->em->getRepository(Category::class)->findOneBy([]);
                if ($defaultCategory) {
                    $blog->setCategory($defaultCategory);
                }
                $this->em->persist($blog);
                $this->em->flush();
                $this->addFlash('success', 'Blog post created. You can now edit the details.');
                return $this->redirectToRoute('admin_blog_edit', ['id' => $blog->getId()]);
            }
        }

        $form = $this->createForm(BlogType::class, $blog);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            if (!$blog->getSlug()) {
                $blog->setSlug($this->blogSlugger->generateUniqueSlug($blog->getTitle() ?? 'article'));
            }
            $this->em->persist($blog);
            $this->em->flush();
            return $this->redirectToRoute('admin_blog_index');
        }

        return $this->render('admin/blog/create.html.twig', ['form' => $form]);
    }

    #[Route('/dashboard/blogs/{id}/edit', name: 'admin_blog_edit')]
    public function editBlog(int $id, Request $request): Response
    {
        $blog = $this->em->getRepository(Blog::class)->find($id);
        if (!$blog) {
            throw $this->createNotFoundException();
        }

        $originalTitle = $blog->getTitle();
        $form = $this->createForm(BlogType::class, $blog, ['csrf_protection' => false]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            if ($blog->getTitle() !== $originalTitle || !$blog->getSlug()) {
                $blog->setSlug($this->blogSlugger->generateUniqueSlug($blog->getTitle() ?? 'article', $blog->getId()));
            }

            $mainImgFile = $form->get('mainImgFile')->getData();
            if ($mainImgFile) {
                $safeFilename = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $blog->getTitle() ?: pathinfo($mainImgFile->getClientOriginalName(), PATHINFO_FILENAME))));
                $newFilename  = $safeFilename . '-' . uniqid() . '.' . $mainImgFile->guessExtension();
                try {
                    $mainImgFile->move($this->getParameter('kernel.project_dir') . '/public/uploads/blog', $newFilename);
                    $blog->setMainImg($newFilename);
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Could not upload image.');
                }
            }

            $this->em->flush();
            $this->addFlash('success', 'Blog updated successfully.');
            return $this->redirectToRoute('admin_blog_index');
        }

        return $this->render('admin/blog/edit.html.twig', [
            'form' => $form->createView(),
            'blog' => $blog,
        ]);
    }

    #[Route('/dashboard/blogs/{id}/delete', name: 'admin_blog_delete', methods: ['POST'])]
    public function deleteBlog(int $id, Request $request): Response
    {
        $blog = $this->em->getRepository(Blog::class)->find($id);
        if ($blog && $this->isCsrfTokenValid('delete' . $blog->getId(), $request->request->get('_token'))) {
            $this->em->remove($blog);
            $this->em->flush();
            $this->addFlash('success', 'Blog successfully deleted.');
        }
        return $this->redirectToRoute('admin_blog_index');
    }
}
