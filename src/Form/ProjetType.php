<?php

namespace App\Form;

use App\Entity\Projet;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Validator\Constraints\All;
use Symfony\Component\Validator\Constraints\File;

class ProjetType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Project Name',
                'attr' => [
                    'placeholder' => 'Enter project name'
                ]
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Description',
                'attr' => [
                    'placeholder' => 'Enter project description',
                    'rows' => 4
                ]
            ])
            ->add('startDate', DateType::class, [
                'label' => 'Start Date',
                'widget' => 'single_text',
            ])
            ->add('EndDate', DateType::class, [
                'label' => 'End Date',
                'widget' => 'single_text',
                'required' => false,
            ])
            ->add('mainPhoto', FileType::class, [
                'label' => 'Main Project Photo',
                'mapped' => false,
                'required' => false,
                'attr' => ['class' => 'form-control']
            ])
            ->add('gallery', FileType::class, [
                'label' => 'Project Gallery',
                'mapped' => false,
                'multiple' => true,
                'required' => false,
                'attr' => ['class' => 'pro-form-input', 'multiple' => 'multiple']
            ])
            ->add('state', \Symfony\Component\Form\Extension\Core\Type\CheckboxType::class, [
                'label' => 'Published',
                'required' => false,
                'attr' => ['class' => 'form-check-input']
            ])
            ->add('save', SubmitType::class, [
                'label' => 'Save Project',
                'attr' => ['class' => 'pro-btn pro-btn-primary']
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Projet::class,
        ]);
    }
}
