<?php

namespace App\Form;

use App\Entity\Category;
use App\Entity\Company;
use App\Entity\EntrepreneurType;
use App\Entity\PaymentMethod;
use App\Entity\PrimaryContact;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CompanyBasicType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email')
            ->add('company_name')
            ->add('tradeName')
            ->add('phoneNum')
            ->add('Website', UrlType::class, [
                'required' => false,
                'attr' => ['placeholder' => 'https://example.com']
            ])
            ->add('foundationYear', TextType::class, [
                'required' => false,
                'attr' => ['placeholder' => 'YYYY']
            ])
            ->add('EmpNum', IntegerType::class, [
                'required' => false,
                'label' => 'Number of Employees',
                'attr' => ['placeholder' => 'e.g. 50']
            ])
            ->add('entrepreneurType', EntityType::class, [
                'class' => EntrepreneurType::class,
                'choice_label' => 'type',
                'required' => false,
                'placeholder' => 'Select Entrepreneur Type',
                'attr' => ['class' => 'form-select']
            ])

            ->add('about', \Symfony\Component\Form\Extension\Core\Type\TextareaType::class, [
                'required' => false,
                'label' => 'About Company',
                'attr' => ['rows' => 6, 'placeholder' => 'Tell us about your company...']
            ])
            ->add('whyChooseUs', \Symfony\Component\Form\Extension\Core\Type\TextareaType::class, [
                'required' => false,
                'label' => 'Why Choose Us (One item per line)',
                'attr' => ['rows' => 5, 'placeholder' => "Reliable Service\nCertified Experts\nFree Estimates"]
            ])
            ->add('services', \Symfony\Component\Form\Extension\Core\Type\TextareaType::class, [
                'required' => false,
                'label' => 'Services (One item per line)',
                'attr' => ['rows' => 5, 'placeholder' => "Renovation\nPlumbing\nConsultation"]
            ])
            ->add('isVerified', CheckboxType::class, [
                'required' => false,
                'label' => 'Verified Agency',
                'label_attr' => ['class' => 'form-check-label'],
                'attr' => ['class' => 'form-check-input']
            ])
            ->add('isTopRated', CheckboxType::class, [
                'required' => false,
                'label' => 'Top Rated Agency',
                'label_attr' => ['class' => 'form-check-label'],
                'attr' => ['class' => 'form-check-input']
            ]);

        $builder->get('whyChooseUs')->addModelTransformer(new \Symfony\Component\Form\CallbackTransformer(
            function ($tagsAsArray): string {
                return implode("\n", $tagsAsArray ?? []);
            },
            function ($tagsAsString): array {
                if (empty(trim($tagsAsString ?? ''))) return [];
                return array_filter(array_map('trim', explode("\n", str_replace(["\r\n", "\r"], "\n", $tagsAsString))));
            }
        ));

        $builder->get('services')->addModelTransformer(new \Symfony\Component\Form\CallbackTransformer(
            function ($tagsAsArray): string {
                return implode("\n", $tagsAsArray ?? []);
            },
            function ($tagsAsString): array {
                if (empty(trim($tagsAsString ?? ''))) return [];
                return array_filter(array_map('trim', explode("\n", str_replace(["\r\n", "\r"], "\n", $tagsAsString))));
            }
        ));
    }
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Company::class,
        ]);
    }
}