<?php

namespace App\Form;

use App\Entity\Category;
use App\Entity\Professional;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProfessionalRegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('category', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name',
                'placeholder' => 'Choose a category',
                'label' => 'Category *'
            ])
            ->add('city', TextType::class, [
                'label' => 'City *',
                'attr' => ['placeholder' => 'Your city']
            ])
            ->add('expYears', IntegerType::class, [
                'label' => 'Years of experience *',
                'attr' => ['min' => 0]
            ]);
    }

    public function getParent(): string
    {
        return RegistrationFormType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Professional::class,
        ]);
    }
}
