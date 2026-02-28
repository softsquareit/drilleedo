<?php

namespace App\Form;

use App\Entity\Professional;
use App\Entity\Category;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProfessionalCategoryType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('category', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name', 
                'multiple' => false,
                'expanded' => false,
                'placeholder' => 'Select a category',
                'label' => false,
                'attr' => ['class' => 'form-select form-select-lg']
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Professional::class,
        ]);
    }
}
