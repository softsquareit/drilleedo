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
            ->add('clientName', TextType::class, [
                'label' => 'Client Name',
                'required' => true,
                'label_attr' => $labelAttr,
                'attr' => array_merge($inputAttr, ['placeholder' => 'Jane Doe']),
            ])
            ->add('clientRole', TextType::class, [
                'label' => 'Role or Location',
                'required' => false,
                'label_attr' => $labelAttr,
                'attr' => array_merge($inputAttr, ['placeholder' => 'Montreal, QC or Satisfied Homeowner']),
            ])
            ->add('content', TextareaType::class, [
                'label' => 'Testimonial Content',
                'required' => true,
                'label_attr' => $labelAttr,
                'attr' => array_merge($inputAttr, ['rows' => 4]),
            ])
            ->add('rating', IntegerType::class, [
                'label' => 'Rating (1-5)',
                'required' => false,
                'label_attr' => $labelAttr,
                'attr' => array_merge($inputAttr, ['min' => 1, 'max' => 5]),
            ])
            ->add('imageFile', FileType::class, [
                'label' => 'Image (Upload)',
                'mapped' => false,
                'required' => false,
                'label_attr' => $labelAttr,
                'attr' => ['class' => 'form-control bg-light border-0 rounded-3 fs-6'],
                'constraints' => [
                    new Image([
                        'maxSize' => '2M',
                        'mimeTypes' => [
                            'image/jpeg',
                            'image/png',
                            'image/webp',
                        ],
                        'mimeTypesMessage' => 'Please upload a valid image (JPG, PNG, WEBP)',
                    ])
                ],
            ])
            ->add('isActive', \Symfony\Component\Form\Extension\Core\Type\CheckboxType::class, [
                'label' => 'Active (Displayed on the site)',
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
