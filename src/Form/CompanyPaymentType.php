<?php

namespace App\Form;

use App\Entity\Company;
use App\Entity\PaymentMethod;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CompanyPaymentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('paymentMethod', EntityType::class, [
                'class' => PaymentMethod::class,
                'choice_label' => 'name',
                'multiple' => true,
                'expanded' => true,
                'label' => false,
                'attr' => ['class' => 'payment-methods-grid']
            ])
            ->add('save', SubmitType::class, [
                'label' => 'Update Payment Methods',
                'attr' => ['class' => 'btn btn-primary']
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => \App\Entity\Business::class,
        ]);
    }
}
