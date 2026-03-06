<?php

namespace App\Controller;

use App\Entity\DirectRequest;
use App\Entity\Professional;
use App\Entity\Company;
use App\Entity\Notification;
use App\Form\DirectRequestType;
use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/individual/direct-request')]
#[IsGranted('ROLE_INDIVIDUAL')]
class DirectRequestController extends AbstractController
{
    #[Route('/new/{type}/{id}', name: 'individual_direct_request_new')]
    public function new(
        string $type,
        int $id,
        Request $request,
        EntityManagerInterface $em,
        FileUploader $fileUploader
    ): Response {
        $user = $this->getUser();
        $directRequest = new DirectRequest();
        
        $targetName = '';
        $targetEntity = null;

        if ($type === 'professional') {
            $targetEntity = $em->getRepository(Professional::class)->find($id);
            if (!$targetEntity) {
                throw $this->createNotFoundException('Professional not found');
            }
            $directRequest->setTargetProfessional($targetEntity);
            $targetName = $targetEntity->getTradeName() ?: $targetEntity->getCompanyName() ?: $targetEntity->getUserIdentifier();
        } elseif ($type === 'company') {
            $targetEntity = $em->getRepository(Company::class)->find($id);
             if (!$targetEntity) {
                throw $this->createNotFoundException('Company not found');
            }
            $directRequest->setTargetCompany($targetEntity);
            $targetName = $targetEntity->getCompanyName();
        } else {
            throw $this->createNotFoundException('Invalid target type');
        }

        $form = $this->createForm(DirectRequestType::class, $directRequest);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $directRequest->setIndividual($user);
            $directRequest->setStatus(DirectRequest::STATUS_PUBLISHED);

            // Handle Images
            $images = $form->get('images')->getData();
            if ($images) {
                $imagePaths = [];
                foreach ($images as $image) {
                    $imagePaths[] = $fileUploader->upload($image, 'quote_requests'); // Reusing quote_requests folder
                }
                $directRequest->setImages($imagePaths);
            }

            $em->persist($directRequest);

            // Notification for the target
            $notification = new Notification();
            $notification->setUser($targetEntity);
            $notification->setMessage('New direct request from ' . ($user->getPersonalInfos()?->getFirstName() ?? 'an individual') . ': ' . $directRequest->getTitle());
            $notification->setRelatedEntityId($directRequest->getId());
            $notification->setRelatedEntityType('direct_request');
            $em->persist($notification);

            $em->flush();

            $this->addFlash('success', 'Direct request sent successfully to ' . $targetName);
            
            // Redirect back to the public profile
            if ($type === 'professional') {
                return $this->redirectToRoute('professional_public_show', ['id' => $id]);
            } else {
                 return $this->redirectToRoute('company_show', ['id' => $id]);
            }
        }

        return $this->render('individual/new_direct_request.html.twig', [
            'form' => $form->createView(),
            'targetName' => $targetName,
            'type' => $type,
            'targetId' => $id
        ]);
    }
}
