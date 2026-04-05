<?php

namespace App\Form;

use App\Entity\Category;
use App\Entity\Professional;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

class ProfessionalType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email')
            ->add('company_name')
            ->add('phoneNum', TextType::class, [
                'required' => false,
                'label' => 'Phone Number',
                'attr' => ['placeholder' => 'Ex: 514-123-4567']
            ])
            ->add('parentCategory', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name',
                'label' => 'Industry/Sector',
                'placeholder' => 'Select industry',
                'mapped' => false,
                'required' => false,
                'query_builder' => function(\App\Repository\CategoryRepository $er) {
                    return $er->createQueryBuilder('c')
                        ->where('c.parent IS NULL')
                        ->orderBy('c.name', 'ASC');
                },
                'attr' => ['class' => 'form-select parent-category-select selectpicker', 'data-live-search' => 'true']
            ])
            ->add('category', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name',
                'required' => true,
                'constraints' => [
                    new \Symfony\Component\Validator\Constraints\NotBlank(['message' => 'Please select your primary service'])
                ],
                'label' => 'Specific Service *',
                'placeholder' => 'Select a sub-category',
                'attr' => ['class' => 'form-select child-category-select selectpicker', 'data-live-search' => 'true']
            ])
            ->add('city')
            ->add('exp_years')
            ->add('about', TextareaType::class, [
                'required' => false,
                'label' => 'About Me',
                'attr' => ['rows' => 6, 'placeholder' => 'Tell us about yourself...']
            ])
            ->add('whyChooseUs', TextareaType::class, [
                'required' => false,
                'label' => 'Why Choose Me (One item per line)',
                'attr' => ['rows' => 5, 'placeholder' => "Experienced\nPunctual\nHigh Quality"]
            ])
            ->add('services', TextareaType::class, [
                'required' => false,
                'label' => 'Services (One item per line)',
                'attr' => ['rows' => 5, 'placeholder' => "Repair\nMaintainance\nInstallation"]
            ])
            ->add('availabilityStatus', ChoiceType::class, [
                'choices'  => [
                    'Available' => Professional::AVAILABILITY_AVAILABLE,
                    'Busy' => Professional::AVAILABILITY_BUSY,
                    'Unavailable' => Professional::AVAILABILITY_UNAVAILABLE,
                ],
                'label' => 'Availability Status',
                'attr' => ['class' => 'form-select']
            ])
            ->add('isVerified', CheckboxType::class, [
                'required' => false,
                'label' => 'Verified by Drilleedo',
                'label_attr' => ['class' => 'form-check-label'],
                'attr' => ['class' => 'form-check-input']
            ])
            ->add('isTopRated', CheckboxType::class, [
                'required' => false,
                'label' => 'Top Rated Professional',
                'label_attr' => ['class' => 'form-check-label'],
                'attr' => ['class' => 'form-check-input']
            ])
            ->add('languages', ChoiceType::class, [
                'choices' => [
                    'Français' => 'FR',
                    'Anglais' => 'EN',
                    'Espagnol' => 'ES',
                    'Italien' => 'IT',
                ],
                'multiple' => true,
                'expanded' => true,
                'required' => false,
                'label' => 'Spoken Languages',
                'label_attr' => ['class' => 'form-check-label'],
                'attr' => ['class' => 'd-flex gap-3 flex-wrap mb-2']
            ])
            ->add('interventionZone', TextType::class, [
                'required' => false,
                'label' => 'Intervention Zone (e.g. 40km, Greater Montreal)',
                'attr' => ['placeholder' => 'Enter service radius or zones...']
            ])
            ->add('hasInsurance', CheckboxType::class, [
                'required' => false,
                'label' => 'Valid Civil Liability Insurance',
                'label_attr' => ['class' => 'form-check-label'],
                'attr' => ['class' => 'form-check-input']
            ])
            ->add('contactPrefs', ChoiceType::class, [
                'choices' => [
                    'Recevoir demandes publiques' => 'PUBLIC_REQUESTS',
                    'Recevoir demandes directes' => 'DIRECT_REQUESTS',
                    'Notifications Email' => 'EMAIL_NOTIF',
                    'Notifications SMS' => 'SMS_NOTIF',
                ],
                'multiple' => true,
                'expanded' => true,
                'required' => false,
                'label' => 'Contact Preferences',
                'label_attr' => ['class' => 'form-check-label'],
                'attr' => ['class' => 'd-flex flex-column gap-1']
            ])
            ->add('openingHours', TextareaType::class, [
                'required' => false,
                'label' => 'Opening Hours (One range per line)',
                'attr' => ['rows' => 5, 'placeholder' => "Monday – Friday: 08:00 – 18:00\nSaturday: 08:00 – 14:00\nSunday: Closed"]
            ])
            ->add('interventionRadius', \Symfony\Component\Form\Extension\Core\Type\NumberType::class, [
                'required' => false,
                'label' => 'Intervention Radius (km)',
                'attr' => ['placeholder' => 'e.g. 40']
            ])
            ->add('minPrice', \Symfony\Component\Form\Extension\Core\Type\NumberType::class, [
                'required' => false,
                'label' => 'Minimum Price ($)',
                'attr' => ['placeholder' => 'e.g. 150']
            ])
            ->add('freeQuotes', CheckboxType::class, [
                'required' => false,
                'label' => '100% Free Quotes',
                'label_attr' => ['class' => 'form-check-label'],
                'attr' => ['class' => 'form-check-input']
            ])
            ->add('guaranteedWork', CheckboxType::class, [
                'required' => false,
                'label' => 'Guaranteed Work',
                'label_attr' => ['class' => 'form-check-label'],
                'attr' => ['class' => 'form-check-input']
            ])
            ->add('rbqCertified', CheckboxType::class, [
                'required' => false,
                'label' => 'RBQ Certified',
                'label_attr' => ['class' => 'form-check-label'],
                'attr' => ['class' => 'form-check-input']
            ])
            ->add('licenceNum', TextType::class, [
                'required' => false,
                'label' => 'Licence Number',
                'attr' => ['placeholder' => 'Ex: 1234-5678-90']
            ])
            ->add('companyNum', TextType::class, [
                'required' => false,
                'label' => 'Company Number (NEQ)',
                'attr' => ['placeholder' => 'Ex: 1160123456']
            ]);

        $builder->addEventListener(FormEvents::POST_SET_DATA, function (FormEvent $event) {
            $professional = $event->getData();
            $form = $event->getForm();

            if ($professional instanceof Professional && $professional->getCategory()) {
                $category = $professional->getCategory();
                if ($category->getParent()) {
                    $form->get('parentCategory')->setData($category->getParent());
                }
            }
        });

        $builder->get('whyChooseUs')->addModelTransformer(new CallbackTransformer(
            function ($tagsAsArray): string {
                return implode("\n", $tagsAsArray ?? []);
            },
            function ($tagsAsString): array {
                if (empty(trim($tagsAsString ?? ''))) return [];
                return array_filter(array_map('trim', explode("\n", str_replace(["\r\n", "\r"], "\n", $tagsAsString))));
            }
        ));

        $builder->get('services')->addModelTransformer(new CallbackTransformer(
            function ($tagsAsArray): string {
                return implode("\n", $tagsAsArray ?? []);
            },
            function ($tagsAsString): array {
                if (empty(trim($tagsAsString ?? ''))) return [];
                return array_filter(array_map('trim', explode("\n", str_replace(["\r\n", "\r"], "\n", $tagsAsString))));
            }
        ));

        $builder->get('openingHours')->addModelTransformer(new CallbackTransformer(
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
            'data_class' => Professional::class,
        ]);
    }
}