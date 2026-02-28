<?php

namespace App\Form;

use App\Entity\Category;
use App\Entity\Professional;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProfessionalType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email')
            ->add('company_name')
            ->add('category', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name',
                'required' => true,
                'label' => 'Business Category',
                'placeholder' => 'Select a category',
            ])
            ->add('city')
            ->add('exp_years')
            ->add('logoFile', FileType::class, [
                'mapped' => false,
                'required' => false,
                'label' => 'Company Logo',
            ])
            ->add('bannerFile', FileType::class, [
                'mapped' => false,
                'required' => false,
                'label' => 'Profile Banner',
            ])

            ->add('about', \Symfony\Component\Form\Extension\Core\Type\TextareaType::class, [
                'required' => false,
                'label' => 'About Me',
                'attr' => ['rows' => 6, 'placeholder' => 'Tell us about yourself...']
            ])
            ->add('whyChooseUs', \Symfony\Component\Form\Extension\Core\Type\TextareaType::class, [
                'required' => false,
                'label' => 'Why Choose Me (One item per line)',
                'attr' => ['rows' => 5, 'placeholder' => "Experienced\nPunctual\nHigh Quality"]
            ])
            ->add('services', \Symfony\Component\Form\Extension\Core\Type\TextareaType::class, [
                'required' => false,
                'label' => 'Services (One item per line)',
                'attr' => ['rows' => 5, 'placeholder' => "Repair\nMaintainance\nInstallation"]
            ]);

        $builder->get('whyChooseUs')->addModelTransformer(new \Symfony\Component\Form\CallbackTransformer(
            function ($tagsAsArray): string {
                return implode("\n", $tagsAsArray ?? []);
            },
            function ($tagsAsString): array {
                if (empty(trim($tagsAsString ?? ''))) return [];
                return array_filter(array_map('trim', explode("\n", str_replace(["\r\n", "\r"], "\n", $tagsAsString))));
            }
        ));

        $builder->get('services')->addModelTransformer(new \Symfony\Component\Form\CallbackTransformer(
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