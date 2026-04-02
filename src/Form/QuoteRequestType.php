<?php

namespace App\Form;

use App\Entity\QuoteRequest;
use App\Entity\Category;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Validator\Constraints as Assert;

class QuoteRequestType extends AbstractType
{
    public const LANGUAGES = [
        'Français'         => 'Français',
        'Anglais'          => 'Anglais',
        'Espagnol'         => 'Espagnol',
        'Arabe'            => 'Arabe',
        'Portugais'        => 'Portugais',
        'Italien'          => 'Italien',
        'Créole haïtien'   => 'Créole haïtien',
        'Mandarin'         => 'Mandarin',
        'Hindi'            => 'Hindi',
        'Vietnamien'       => 'Vietnamien',
        'Punjabi'          => 'Punjabi',
        'Russe'            => 'Russe',
    ];

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'label' => 'Titre de la demande',
                'attr'  => ['placeholder' => 'Ex. : Besoin d\'un électricien pour nouvelle installation', 'class' => 'form-control']
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Description du projet',
                'attr'  => ['rows' => 5, 'placeholder' => 'Décrivez votre demande en détail...', 'class' => 'form-control']
            ])
            ->add('parentCategory', EntityType::class, [
                'class'         => Category::class,
                'choice_label'  => 'name',
                'label'         => 'Secteur / Industrie',
                'placeholder'   => 'Sélectionner un secteur',
                'mapped'        => false,
                'required'      => false,
                'query_builder' => function(\App\Repository\CategoryRepository $er) {
                    return $er->createQueryBuilder('c')
                        ->where('c.parent IS NULL')
                        ->orderBy('c.name', 'ASC');
                },
                'attr' => ['class' => 'form-select parent-category-select selectpicker', 'data-live-search' => 'true']
            ])
            ->add('category', EntityType::class, [
                'class'        => Category::class,
                'choice_label' => 'name',
                'label'        => 'Service spécifique *',
                'placeholder'  => 'Sélectionner un sous-service',
                'required'     => true,
                'constraints'  => [
                    new Assert\NotBlank(['message' => 'Veuillez sélectionner un service'])
                ],
                'attr' => ['class' => 'form-select child-category-select selectpicker', 'data-live-search' => 'true']
            ])
            ->add('languages', ChoiceType::class, [
                'label'    => 'Langue(s) souhaitée(s)',
                'choices'  => self::LANGUAGES,
                'multiple' => true,
                'expanded' => false,
                'required' => false,
                'attr'     => ['class' => 'form-select selectpicker', 'data-live-search' => 'true', 'multiple' => 'multiple'],
                'help'     => 'Sélectionnez la ou les langues dans lesquelles vous souhaitez être servi.',
            ])
            ->add('desiredStartDate', DateType::class, [
                'label'    => 'Date souhaitée de début',
                'widget'   => 'single_text',
                'required' => false,
                'attr'     => ['class' => 'form-control'],
                'html5'    => true,
            ])
            ->add('availabilities', ChoiceType::class, [
                'label'    => 'Disponibilités pour visite / devis',
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
                'label'    => 'Intervention urgente',
                'choices'  => [
                    'Oui' => true,
                    'Non' => false,
                ],
                'expanded'     => true,
                'multiple'     => false,
                'required'     => true,
                'data'         => false,
                'attr'         => ['class' => 'd-flex gap-4'],
            ])
            ->add('images', FileType::class, [
                'label'    => 'Photos du projet (jusqu\'à 5)',
                'mapped'   => false,
                'multiple' => true,
                'required' => false,
                'attr'     => ['class' => 'form-control', 'multiple' => 'multiple'],
                'constraints' => [
                    new Assert\All([
                        'constraints' => [
                            new Assert\File([
                                'maxSize' => '5M',
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
            'data_class' => QuoteRequest::class,
        ]);
    }
}
