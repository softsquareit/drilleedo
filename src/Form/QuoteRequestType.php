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
use Symfony\Component\Validator\Constraints as Assert;


class QuoteRequestType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'label' => 'Title',
                'attr' => ['placeholder' => 'E.g., Need an electrician for new wiring', 'class' => 'form-control']
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Description',
                'attr' => ['rows' => 5, 'placeholder' => 'Describe your request in detail...', 'class' => 'form-control']
            ])
            ->add('category', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name',
                'label' => 'Service Category',
                'placeholder' => 'Select a category',
                'attr' => ['class' => 'form-select']
            ])
            ->add('images', FileType::class, [
                'label' => 'Upload Images',
                'mapped' => false,
                'multiple' => true,
                'required' => false,
                'attr' => ['class' => 'form-control', 'multiple' => 'multiple'],
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
