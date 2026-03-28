<?php

namespace App\Form;

use App\Entity\Link;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class LinkType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('type', \Symfony\Component\Form\Extension\Core\Type\ChoiceType::class, [
                'choices'  => [
                    'Site Web' => 'Website',
                    'Facebook' => 'Facebook',
                    'Instagram' => 'Instagram',
                    'LinkedIn' => 'LinkedIn',
                    'Twitter' => 'Twitter',
                    'YouTube' => 'YouTube',
                ],
                'placeholder' => 'Choisir un type',
                'label' => 'Type de lien',
            ])
            ->add('link', UrlType::class, [
                'label' => 'URL',
                'attr' => [
                    'placeholder' => 'https://example.com'
                ]
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Link::class,
        ]);
    }
}
