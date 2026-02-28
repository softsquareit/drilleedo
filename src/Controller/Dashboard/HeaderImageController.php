<?php

namespace App\Controller\Dashboard;

use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/dashboard/header-image')]
#[IsGranted('ROLE_USER')]
class HeaderImageController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private FileUploader $fileUploader
    ) {}

    #[Route('/upload-logo', name: 'dashboard_upload_logo', methods: ['POST'])]
    public function uploadLogo(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $file = $request->files->get('logo');

        if (!$file) {
            return new JsonResponse(['error' => 'No file uploaded'], 400);
        }

        try {
            $newFilename = $this->fileUploader->upload($file, 'logos');
            
            if (method_exists($user, 'setLogo')) {
                $user->setLogo($newFilename);
                $this->em->flush();
                return new JsonResponse([
                    'success' => true,
                    'url' => '/uploads/logos/' . $newFilename,
                    'message' => 'Profile photo updated successfully!'
                ]);
            }
            
            return new JsonResponse(['error' => 'User entity does not support logos'], 400);
            
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/upload-banner', name: 'dashboard_upload_banner', methods: ['POST'])]
    public function uploadBanner(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $file = $request->files->get('banner');

        if (!$file) {
            return new JsonResponse(['error' => 'No file uploaded'], 400);
        }

        try {
            $newFilename = $this->fileUploader->upload($file, 'banners');
            
            if (method_exists($user, 'setBanner')) {
                $user->setBanner($newFilename);
                $this->em->flush();
                return new JsonResponse([
                    'success' => true,
                    'url' => '/uploads/banners/' . $newFilename,
                    'message' => 'Cover banner updated successfully!'
                ]);
            }
            
            return new JsonResponse(['error' => 'User entity does not support banners'], 400);
            
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}
