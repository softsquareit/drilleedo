<?php

namespace App\Form;

use App\Entity\DirectRequest;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Form used on the public professional profile page (/professional/{id}/{slug}).
 * Strips out "category" and "languages" — the visitor contacts a specific pro directly.
 */
class ProContactType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'label' => false,
                'attr'  => ['placeholder' => 'Ex. : Aide pour rénovation...', 'class' => 'form-control'],
            ])
            ->add('description', TextareaType::class, [
                'label' => false,
                'attr'  => ['rows' => 4, 'placeholder' => 'Décrivez ce dont vous avez besoin...', 'class' => 'form-control'],
            ])
            ->add('desiredStartDate', DateType::class, [
                'label'    => false,
                'widget'   => 'single_text',
                'required' => false,
                'html5'    => true,
                'attr'     => ['class' => 'form-control'],
            ])
            ->add('availabilities', ChoiceType::class, [
                'label'    => false,
                'choices'  => [
                    'Matin'      => 'Matin',
                    'Après-midi' => 'Après-midi',
                    'Week-end'   => 'Week-end',
                    'Flexible'   => 'Flexible',
                ],
                'multiple' => true,
                'expanded' => true,
                'required' => false,
            ])
            ->add('urgentIntervention', ChoiceType::class, [
                'label'    => false,
                'choices'  => [
                    'Oui' => true,
                    'Non' => false,
                ],
                'expanded' => true,
                'multiple' => false,
                'required' => true,
                'data'     => false,
            ])
            ->add('images', FileType::class, [
                'label'    => false,
                'mapped'   => false,
                'multiple' => true,
                'required' => false,
                'attr'     => ['class' => 'form-control', 'multiple' => 'multiple'],
                'constraints' => [
                    new Assert\All([
                        'constraints' => [
                            new Assert\File(['maxSize' => '5M'])
                        ]
                    ])
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => DirectRequest::class,
        ]);
    }
}
