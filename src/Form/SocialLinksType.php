<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Url;

class SocialLinksType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('facebook', UrlType::class, [
                'required' => false,
                'label' => 'Facebook',
                'attr' => ['placeholder' => 'https://facebook.com/yourprofile'],
                'constraints' => [new Url()],
            ])
            ->add('twitter', UrlType::class, [
                'required' => false,
                'label' => 'Twitter',
                'attr' => ['placeholder' => 'https://twitter.com/yourprofile'],
                'constraints' => [new Url()],
            ])
            ->add('linkedin', UrlType::class, [
                'required' => false,
                'label' => 'LinkedIn',
                'attr' => ['placeholder' => 'https://linkedin.com/in/yourprofile'],
                'constraints' => [new Url()],
            ])
            ->add('instagram', UrlType::class, [
                'required' => false,
                'label' => 'Instagram',
                'attr' => ['placeholder' => 'https://instagram.com/yourprofile'],
                'constraints' => [new Url()],
            ])
            ->add('website', UrlType::class, [
                'required' => false,
                'label' => 'Website',
                'attr' => ['placeholder' => 'https://yourwebsite.com'],
                'constraints' => [new Url()],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // This form is not mapped to a single entity class directly
            'mapped' => false,
        ]);
    }
}
