<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Doctrine\ORM\EntityManagerInterface;

#[AsCommand(
    name: 'app:load-testimonials',
    description: 'Add a short description for your command',
)]
class LoadTestimonialsCommand extends Command
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('arg1', InputArgument::OPTIONAL, 'Argument description')
            ->addOption('option1', null, InputOption::VALUE_NONE, 'Option description')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new \Symfony\Component\Console\Style\SymfonyStyle($input, $output);

        $testimonialsData = [
            ['Jeanne Tremblay', 'Montreal, QC (Interior Renovation)', 'Great work on our living room renovation. The team was very professional and met the deadlines. I highly recommend their services for any renovation project in Montreal.', 'client-01.png'],
            ['Marc Bouchard', 'Quebec City, QC (Exterior Painting)', 'A big thank you for the exterior painting of my century-old house. The attention to detail is impressive and the paint is holding up perfectly despite the Canadian winter.', 'client-02.png'],
            ['Sophie Gagnon', 'Laval, QC (Building Works)', 'We hired a contractor via the platform to redo the roof. Fast, transparent and highly efficient service. No leaks since!', 'client-03.png'],
            ['Luc Roy', 'Gatineau, QC (DIY & Finishing)', 'I needed help installing new shelves and redoing some bathroom seals. The work was done quickly and cleanly. Thank you!', 'client-04.png'],
            ['Isabelle Cote', 'Sherbrooke, QC (Kitchen Renovation)', 'My new kitchen is beautiful. The contractor listened to my needs and proposed ingenious solutions to optimize the space. Very satisfied.', 'client-05.png'],
            ['Michel Pelletier', 'Trois-Rivieres, QC (Plumbing)', 'Quick response for a plumbing emergency on a Sunday morning. The plumber was courteous, explained the problem and fixed it quickly. A relief!', 'client-06.png'],
            ['Julie Belanger', 'Repentigny, QC (Interior Painting)', 'We had the entire main floor repainted before selling. The painters were meticulous and left the house spotless. An excellent investment.', 'client-07.png'],
            ['Simon Leblanc', 'Brossard, QC (Electricity)', 'Installation of new recessed lights in the living room. The electrician was very competent and advised me well on lighting types. I will use the platform again.', 'client-08.png'],
            ['Catherine Ouellet', 'Saint-Jean-sur-Richelieu, QC (Landscaping)', 'Our backyard was completely transformed. The deck built is solid and aesthetic. It is now our favorite place to relax in the summer.', 'client-01.png'],
            ['David Fortin', 'Drummondville, QC (Insulation)', 'I had the insulation in my attic redone. The team was fast, clean and I have already seen a difference on my heating bill this winter.', 'client-02.png'],
            ['Nathalie Morin', 'Granby, QC (Carpentry)', 'A very talented craftsman created a beautiful custom piece of furniture for my entryway. The level of detail and wood quality are exceptional.', 'client-03.png'],
            ['Alain Desjardins', 'Saint-Hyacinthe, QC (Floor Installation)', 'I had new hardwood flooring installed in the bedrooms. The installers worked with great precision. The result is perfect.', 'client-04.png'],
            ['Sylvie Lavoie', 'Blainville, QC (Bathroom Renovation)', 'The bathroom from my dreams has finally become a reality. The contractor managed the project from A to Z with great professionalism. I love it!', 'client-05.png'],
            ['Martin Simard', 'Chateauguay, QC (Window Installation)', 'Changed all the windows in the house. The installation was fast and the windows are of high quality. You can really feel the difference in insulation.', 'client-06.png'],
            ['Chantal Gauthier', 'Terrebonne, QC (Post-Renovation Cleaning)', 'After major renovations, we used a cleaning service via the platform. They did an incredible job, the house was shining.', 'client-07.png'],
            ['Pierre Bergeron', 'Mascouche, QC (Alarm System Installation)', 'The technician was very clear on how to use the new security system. The installation was neat and discreet. I feel much safer.', 'client-08.png'],
            ['Valerie Lapointe', 'Saint-Eustache, QC (Roof Repair)', 'Excellent customer service. The roofer came to assess storm damage and the repairs were done quickly and at a fair price.', 'client-01.png'],
            ['Eric Boucher', 'Boucherville, QC (AC Installation)', 'Installation of a wall-mounted heat pump before the heatwave. Impeccable service from sale to installation. Very professional.', 'client-02.png'],
            ['Caroline Richard', 'Mirabel, QC (Tiling)', 'The tiler did an artist\'s job for our new kitchen backsplash. The cuts are perfect and the pattern is very well aligned.', 'client-03.png'],
            ['Stephane Martel', 'Victoriaville, QC (Foundation Works)', 'I had cracks in my foundation. The company permanently repaired everything and explained the causes of the problem well. A reassuring service.', 'client-04.png']
        ];

        // Ensure images exist in pubic/uploads/testimonials/
        // since we copied client-*.png to it.

        foreach ($testimonialsData as $data) {
            $testimonial = new \App\Entity\Testimonial();
            $testimonial->setClientName($data[0]);
            $testimonial->setClientRole($data[1]);
            $testimonial->setContent($data[2]);
            $testimonial->setImage($data[3]);
            $testimonial->setIsActive(true);
            
            $this->entityManager->persist($testimonial);
        }

        $this->entityManager->flush();

        $io->success('Successfully loaded 20 test testimonials for Canadian home improvement users.');

        return Command::SUCCESS;
    }
}
