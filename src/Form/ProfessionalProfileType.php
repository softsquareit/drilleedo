<?php

namespace App\Form;

use App\Entity\Category;
use App\Entity\Professional;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\CallbackTransformer;

/**
 * Specifically for the Professional's self-service profile edit.
 * Excludes administrative fields like isVerified or isTopRated.
 */
class ProfessionalProfileType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email', TextType::class, [
                'label' => 'Email professionnel',
                'attr' => ['placeholder' => 'contact@monentreprise.ca']
            ])
            ->add('company_name', TextType::class, [
                'label' => "Nom de l'entreprise / Nom commercial",
                'attr' => ['placeholder' => 'Ex: Construction Tremblay Inc.']
            ])
            ->add('phoneNum', TextType::class, [
                'required' => false,
                'label' => 'Téléphone',
                'attr' => ['placeholder' => 'Ex: 514-123-4567']
            ])
            ->add('city', TextType::class, [
                'label' => 'Ville',
                'attr' => ['placeholder' => 'Ex: Montréal']
            ])
            ->add('exp_years', NumberType::class, [
                'label' => "Années d'expérience",
                'attr' => ['placeholder' => 'Ex: 10']
            ])
            ->add('about', TextareaType::class, [
                'required' => false,
                'label' => 'À propos de moi / ma compagnie',
                'attr' => ['rows' => 6, 'placeholder' => 'Décrivez votre expérience, vos valeurs, votre approche...']
            ])
            ->add('parentCategory', EntityType::class, [
                'class' => Category::class,
                'choice_label' => 'name',
                'label' => "Secteur d'activité",
                'placeholder' => 'Sélectionnez un secteur',
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
                'label' => 'Service spécialisé',
                'placeholder' => 'Sélectionnez une sous-catégorie',
                'attr' => ['class' => 'form-select child-category-select selectpicker', 'data-live-search' => 'true']
            ])
            ->add('whyChooseUs', TextareaType::class, [
                'required' => false,
                'label' => 'Pourquoi me choisir ?',
                'attr' => ['rows' => 5, 'placeholder' => "Expérience reconnue\nTravaux garantis\nRéponse rapide"]
            ])
            ->add('services', TextareaType::class, [
                'required' => false,
                'label' => 'Mes services',
                'attr' => ['rows' => 5, 'placeholder' => "Rénovation de cuisine\nInstallation de salle de bain\nPeinture intérieure"]
            ])
            ->add('availabilityStatus', ChoiceType::class, [
                'choices'  => [
                    'Disponible' => Professional::AVAILABILITY_AVAILABLE,
                    'Occupé' => Professional::AVAILABILITY_BUSY,
                    'Indisponible' => Professional::AVAILABILITY_UNAVAILABLE,
                ],
                'label' => 'Disponibilité',
                'attr' => ['class' => 'form-select']
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
                'label' => 'Langues parlées',
                'attr' => ['class' => 'd-flex gap-3 flex-wrap mb-2']
            ])
            ->add('interventionZone', TextType::class, [
                'required' => false,
                'label' => "Zone d'intervention",
                'attr' => ['placeholder' => 'Ex: Grand Montréal, 50km de Québec']
            ])
            ->add('interventionRadius', NumberType::class, [
                'required' => false,
                'label' => "Rayon d'intervention (km)",
                'attr' => ['placeholder' => '40']
            ])
            ->add('minPrice', NumberType::class, [
                'required' => false,
                'label' => 'Prix minimum ($)',
                'attr' => ['placeholder' => 'Ex: 200']
            ])
            ->add('openingHours', TextareaType::class, [
                'required' => false,
                'label' => 'Horaires (une plage par ligne)',
                'attr' => ['rows' => 5, 'placeholder' => "Lundi – Vendredi: 08:00 – 18:00\nSamedi: 08:00 – 14:00\nDimanche: Fermé"]
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
                'label' => 'Préférences de contact',
                'attr' => ['class' => 'd-flex flex-column gap-1']
            ])
            ->add('hasInsurance', \Symfony\Component\Form\Extension\Core\Type\CheckboxType::class, [
                'required' => false,
                'label' => 'Assurance responsabilité civile',
                'attr' => ['class' => 'form-check-input']
            ])
            ->add('freeQuotes', \Symfony\Component\Form\Extension\Core\Type\CheckboxType::class, [
                'required' => false,
                'label' => 'Soumissions gratuites',
                'attr' => ['class' => 'form-check-input']
            ])
            ->add('guaranteedWork', \Symfony\Component\Form\Extension\Core\Type\CheckboxType::class, [
                'required' => false,
                'label' => 'Travaux garantis',
                'attr' => ['class' => 'form-check-input']
            ])
            ->add('rbqCertified', \Symfony\Component\Form\Extension\Core\Type\CheckboxType::class, [
                'required' => false,
                'label' => 'Certifié RBQ',
                'attr' => ['class' => 'form-check-input']
            ])
            ->add('licenceNum', TextType::class, [
                'required' => false,
                'label' => 'N° Licence (RBQ etc.)',
                'attr' => ['placeholder' => 'Ex: 1234-5678-90']
            ])
            ->add('companyNum', TextType::class, [
                'required' => false,
                'label' => 'N° Entreprise (NEQ)',
                'attr' => ['placeholder' => 'Ex: 1160123456']
            ]);

        // Same transformers as original to handle newline strings <-> arrays
        foreach (['whyChooseUs', 'services', 'openingHours'] as $field) {
            $builder->get($field)->addModelTransformer(new CallbackTransformer(
                function ($tagsAsArray): string {
                    return implode("\n", $tagsAsArray ?? []);
                },
                function ($tagsAsString): array {
                    if (empty(trim($tagsAsString ?? ''))) return [];
                    return array_filter(array_map('trim', explode("\n", str_replace(["\r\n", "\r"], "\n", $tagsAsString))));
                }
            ));
        }

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
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Professional::class,
        ]);
    }
}
