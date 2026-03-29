<?php

namespace App\Form;

use App\Entity\Blog;
use App\Entity\Category;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class BlogType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title')
            ->add('short_desc')
            ->add('description')
            ->add('mainImgFile', FileType::class, [
                'mapped' => false,
                'required' => false,
                'label' => 'Main Image',
                'attr' => ['accept' => 'image/*']
            ])
            ->add('multiple_imgs', FileType::class, [
                'mapped' => false,
                'required' => false,
                'multiple' => true,
                'label' => 'Gallery Images',
                'attr' => ['accept' => 'image/*']
            ])
            ->add('type', ChoiceType::class, [
                'choices' => [
                    'Post' => 'Post',
                    'Idea' => 'Idea',
                ],
                'placeholder' => 'Select Type',
            ])
            ->add('category', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name',
            ])
            ->add('isActive', \Symfony\Component\Form\Extension\Core\Type\CheckboxType::class, [
                'label' => 'Published',
                'required' => false,
                'attr' => ['class' => 'form-check-input']
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Blog::class,
        ]);
    }
}