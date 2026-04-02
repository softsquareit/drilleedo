<?php

namespace App\Form;

use App\Entity\Offer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
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
                'currency'    => 'CAD',
                'constraints' => [new NotBlank()],
                'label'       => 'Prix total proposé ($)',
                'attr'        => ['class' => 'form-control'],
                'row_attr'    => ['class' => 'mb-3'],
            ])
            ->add('description', TextareaType::class, [
                'constraints' => [new NotBlank()],
                'label'       => 'Message / Description',
                'attr'        => ['class' => 'form-control', 'rows' => 5],
                'row_attr'    => ['class' => 'mb-3'],
            ])
            ->add('priorVisit', ChoiceType::class, [
                'label'    => 'Visite préalable nécessaire',
                'choices'  => [
                    'Oui' => true,
                    'Non' => false,
                ],
                'expanded' => true,
                'multiple' => false,
                'required' => false,
                'data'     => false,
                'row_attr' => ['class' => 'mb-3'],
            ])
            ->add('possibleStartDate', DateType::class, [
                'label'    => 'Date possible de début',
                'widget'   => 'single_text',
                'required' => false,
                'html5'    => true,
                'attr'     => ['class' => 'form-control'],
                'row_attr' => ['class' => 'mb-3'],
            ])
            ->add('estimatedDuration', IntegerType::class, [
                'label'    => 'Délai de réalisation estimé',
                'required' => false,
                'attr'     => ['class' => 'form-control', 'min' => 1, 'placeholder' => 'Ex. : 3'],
                'row_attr' => ['class' => 'mb-3'],
            ])
            ->add('estimatedDurationUnit', ChoiceType::class, [
                'label'    => 'Unité',
                'choices'  => [
                    'Jours'     => 'jours',
                    'Semaines'  => 'semaines',
                    'Mois'      => 'mois',
                ],
                'required' => false,
                'data'     => 'jours',
                'attr'     => ['class' => 'form-select'],
                'row_attr' => ['class' => 'mb-3'],
            ])
            ->add('documents', FileType::class, [
                'label'    => 'Documents joints (PDF, Images, Word)',
                'mapped'   => false,
                'multiple' => true,
                'required' => false,
                'attr'     => ['class' => 'form-control', 'multiple' => 'multiple'],
                'constraints' => [
                    new All([
                        'constraints' => [
                            new File(['maxSize' => '10M'])
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
