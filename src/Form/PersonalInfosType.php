<?php

namespace App\Form;

use App\Entity\PersonalInfos;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PersonalInfosType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('first_name', TextType::class, [
                'label' => 'First Name',
                'attr' => ['class' => 'form-control']
            ])
            ->add('last_name', TextType::class, [
                'label' => 'Last Name',
                'attr' => ['class' => 'form-control']
            ])
            ->add('adresse', TextType::class, [
                'label' => 'Address',
                'attr' => ['class' => 'form-control']
            ])
            ->add('phone_num', TextType::class, [
                'label' => 'Phone Number',
                'attr' => ['class' => 'form-control']
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => PersonalInfos::class,
        ]);
    }
}
