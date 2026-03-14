<?php

namespace App\Form;

use App\Entity\Individual;
use App\Form\PersonalInfosType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class IndividualType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email')
            ->add('languageCode', TextType::class, [
                'required' => false,
                'label' => 'Language/Region Code (e.g. FR, EN, FN)',
                'attr' => ['placeholder' => 'FN']
            ])
            ->add('personal_infos', PersonalInfosType::class, [
                'required' => false,
                'label' => false,
            ])
        ;

        // Only add password if this is a new entity (creation)
        $individual = $options['data'] ?? null;
        if (!$individual || null === $individual->getId()) {
            $builder->add('password', PasswordType::class, [
                'required' => true,
            ]);
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Individual::class,
        ]);
    }
}