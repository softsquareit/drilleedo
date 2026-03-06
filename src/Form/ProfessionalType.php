<?php

namespace App\Form;

use App\Entity\Category;
use App\Entity\Professional;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProfessionalType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email')
            ->add('company_name')
            ->add('parentCategory', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name',
                'label' => 'Industry/Sector',
                'placeholder' => 'Select industry',
                'mapped' => false,
                'required' => false,
                'query_builder' => function(\App\Repository\CategoryRepository $er) {
                    return $er->createQueryBuilder('c')
                        ->where('c.parent IS NULL')
                        ->orderBy('c.name', 'ASC');
                },
                'attr' => ['class' => 'form-select parent-category-select selectpicker', 'data-live-search' => 'true']
            ])
            ->add('category', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name',
                'required' => true,
                'constraints' => [
                    new \Symfony\Component\Validator\Constraints\NotBlank(['message' => 'Please select your primary service'])
                ],
                'label' => 'Specific Service *',
                'placeholder' => 'Select a sub-category',
                'attr' => ['class' => 'form-select child-category-select selectpicker', 'data-live-search' => 'true']
            ])
            ->add('city')
            ->add('exp_years')
            ->add('about', TextareaType::class, [
                'required' => false,
                'label' => 'About Me',
                'attr' => ['rows' => 6, 'placeholder' => 'Tell us about yourself...']
            ])
            ->add('whyChooseUs', TextareaType::class, [
                'required' => false,
                'label' => 'Why Choose Me (One item per line)',
                'attr' => ['rows' => 5, 'placeholder' => "Experienced\nPunctual\nHigh Quality"]
            ])
            ->add('services', TextareaType::class, [
                'required' => false,
                'label' => 'Services (One item per line)',
                'attr' => ['rows' => 5, 'placeholder' => "Repair\nMaintainance\nInstallation"]
            ]);

        $builder->get('whyChooseUs')->addModelTransformer(new CallbackTransformer(
            function ($tagsAsArray): string {
                return implode("\n", $tagsAsArray ?? []);
            },
            function ($tagsAsString): array {
                if (empty(trim($tagsAsString ?? ''))) return [];
                return array_filter(array_map('trim', explode("\n", str_replace(["\r\n", "\r"], "\n", $tagsAsString))));
            }
        ));

        $builder->get('services')->addModelTransformer(new CallbackTransformer(
            function ($tagsAsArray): string {
                return implode("\n", $tagsAsArray ?? []);
            },
            function ($tagsAsString): array {
                if (empty(trim($tagsAsString ?? ''))) return [];
                return array_filter(array_map('trim', explode("\n", str_replace(["\r\n", "\r"], "\n", $tagsAsString))));
            }
        ));
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Professional::class,
        ]);
    }
}