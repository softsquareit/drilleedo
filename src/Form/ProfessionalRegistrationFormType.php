<?php

namespace App\Form;

use App\Entity\Category;
use App\Entity\Professional;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\HttpFoundation\RequestStack;

class ProfessionalRegistrationFormType extends AbstractType
{
    private RequestStack $requestStack;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $locale = $this->requestStack->getCurrentRequest()->getLocale();

        $builder
            ->add('parentCategory', EntityType::class, [
                'class' => Category::class,
                'choice_label' => function(Category $category) use ($locale) {
                    return $category->getLocalizedTitle($locale);
                },
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
                'choice_label' => function(Category $category) use ($locale) {
                    return $category->getLocalizedTitle($locale);
                },
                'placeholder' => 'Select a sub-category',
                'label' => 'Specific Service *',
                'required' => true,
                'constraints' => [
                    new \Symfony\Component\Validator\Constraints\NotBlank(['message' => 'Please select a specific service'])
                ],
                'attr' => ['class' => 'form-select child-category-select selectpicker', 'data-live-search' => 'true']
            ])
            ->add('city', TextType::class, [
                'label' => 'City *',
                'attr' => ['placeholder' => 'Your city']
            ])
            ->add('expYears', IntegerType::class, [
                'label' => 'Years of experience *',
                'attr' => ['min' => 0]
            ]);

        // On validation re-render: pre-select the parent from the already-chosen category
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

    public function getParent(): string
    {
        return RegistrationFormType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Professional::class,
        ]);
    }
}
