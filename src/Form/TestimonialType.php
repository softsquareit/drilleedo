<?php

namespace App\Form;

use App\Entity\Testimonial;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TestimonialType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $labelAttr = ['class' => 'form-label fw-bold text-dark small text-uppercase letter-spacing-1'];
        $inputAttr = ['class' => 'form-control form-control-lg bg-light border-0 rounded-3 fs-6'];

        $builder
            ->add('clientName', \Symfony\Component\Form\Extension\Core\Type\TextType::class, [
                'label' => 'Nom du client',
                'required' => true,
                'label_attr' => $labelAttr,
                'attr' => $inputAttr,
            ])
            ->add('clientRole', \Symfony\Component\Form\Extension\Core\Type\TextType::class, [
                'label' => 'Rôle / Entreprise (ex: CEO @ Google)',
                'required' => false,
                'label_attr' => $labelAttr,
                'attr' => $inputAttr,
            ])
            ->add('content', \Symfony\Component\Form\Extension\Core\Type\TextareaType::class, [
                'label' => 'Témoignage',
                'required' => true,
                'label_attr' => $labelAttr,
                'attr' => array_merge($inputAttr, ['rows' => 4]),
            ])
            ->add('imageFile', \Symfony\Component\Form\Extension\Core\Type\FileType::class, [
                'label' => 'Image (Upload)',
                'mapped' => false,
                'required' => false,
                'label_attr' => $labelAttr,
                'attr' => ['class' => 'form-control bg-light border-0 rounded-3 fs-6'],
                'constraints' => [
                    new \Symfony\Component\Validator\Constraints\Image([
                        'maxSize' => '2M',
                        'mimeTypes' => [
                            'image/jpeg',
                            'image/png',
                            'image/webp',
                        ],
                        'mimeTypesMessage' => 'Veuillez uploader une image valide (JPG, PNG, WEBP)',
                    ])
                ],
            ])
            ->add('isActive', \Symfony\Component\Form\Extension\Core\Type\CheckboxType::class, [
                'label' => 'Actif (Affiché sur le site)',
                'required' => false,
                'label_attr' => ['class' => 'form-check-label fw-bold text-dark small letter-spacing-1'],
                'attr' => ['class' => 'form-check-input'],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Testimonial::class,
        ]);
    }
}
