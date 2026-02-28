<?php

namespace App\Form;

use App\Entity\Company;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\File;

class CompanyLogoType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('logoFile', FileType::class, [
                'mapped' => false,
                'required' => true,
                'label' => 'Upload New Logo',
                'attr' => ['accept' => 'image/*'],
                'constraints' => [
                    new File([
                        'maxSize' => '5M',
                    ])
                ],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Company::class,
        ]);
    }
}
