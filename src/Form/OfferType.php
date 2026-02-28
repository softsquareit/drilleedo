<?php

namespace App\Form;

use App\Entity\Offer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Validator\Constraints\All;
use Symfony\Component\Validator\Constraints\File;

class OfferType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('price', MoneyType::class, [
                'currency' => 'USD', 
                'constraints' => [
                    new NotBlank(),
                ],
                'label' => 'Your Offer Price',
                'attr' => ['class' => 'form-control'],
                'row_attr' => ['class' => 'mb-3'],
            ])
            ->add('description', TextareaType::class, [
                'constraints' => [
                    new NotBlank(),
                ],
                'label' => 'Message / Description',
                'attr' => ['class' => 'form-control', 'rows' => 5],
                'row_attr' => ['class' => 'mb-3'],
            ])
            ->add('documents', FileType::class, [
                'label' => 'Upload Documents (PDF, Images, Word)',
                'mapped' => false,
                'multiple' => true,
                'required' => false,
                'attr' => ['class' => 'form-control', 'multiple' => 'multiple'],
                'constraints' => [
                    new All([
                        'constraints' => [
                            new File([
                                'maxSize' => '10M',
                            ])
                        ]
                    ])
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Offer::class,
        ]);
    }
}
