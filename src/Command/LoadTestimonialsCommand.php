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
            ['Jeanne Tremblay', 'Montréal, QC (Rénovation intérieure)', 'Super travail pour la rénovation de notre salon. L\'équipe a été très professionnelle et les délais ont été respectés. Je recommande vivement leurs services pour tout projet de rénovation à Montréal.', 'client-01.png'],
            ['Marc Bouchard', 'Québec, QC (Peinture extérieure)', 'Un grand merci pour la peinture extérieure de ma maison centenaire. Le soin apporté aux détails est impressionnant et la peinture tient parfaitement malgré l\'hiver québécois.', 'client-02.png'],
            ['Sophie Gagnon', 'Laval, QC (Travaux de bâtiment)', 'Nous avons engagé un entrepreneur via la plateforme pour refaire la toiture. Service rapide, transparent et surtout très efficace. Aucune fuite depuis !', 'client-03.png'],
            ['Luc Roy', 'Gatineau, QC (Bricolage & Finitions)', 'J\'avais besoin d\'aide pour installer de nouvelles étagères et refaire quelques joints de salle de bain. Le travail a été fait rapidement et proprement. Merci !', 'client-04.png'],
            ['Isabelle Côté', 'Sherbrooke, QC (Rénovation de cuisine)', 'Ma nouvelle cuisine est magnifique. L\'entrepreneur a été à l\'écoute de mes besoins et a su proposer des solutions ingénieuses pour optimiser l\'espace. Très satisfaite.', 'client-05.png'],
            ['Michel Pelletier', 'Trois-Rivières, QC (Plomberie)', 'Intervention rapide pour une urgence de plomberie un dimanche matin. Le plombier était courtois, a expliqué le problème et l\'a réglé rapidement. Un soulagement !', 'client-06.png'],
            ['Julie Bélanger', 'Repentigny, QC (Peinture intérieure)', 'Nous avons fait repeindre tout le rez-de-chaussée avant de vendre. Les peintres ont été minutieux et ont laissé la maison impeccable. Un excellent investissement.', 'client-07.png'],
            ['Simon Leblanc', 'Brossard, QC (Électricité)', 'Installation de nouvelles lumières encastrées dans le salon. L\'électricien était très compétent et m\'a bien conseillé sur les types d\'éclairage. Je ferai encore appel à la plateforme.', 'client-08.png'],
            ['Catherine Ouellet', 'Saint-Jean-sur-Richelieu, QC (Aménagement paysager)', 'Notre cour arrière a été complètement transformée. La terrasse construite est solide et esthétique. C\'est maintenant notre endroit préféré pour relaxer l\'été.', 'client-01.png'],
            ['David Fortin', 'Drummondville, QC (Isolation)', 'J\'ai fait refaire l\'isolation de mon entretoit. L\'équipe a été rapide, propre et j\'ai déjà vu une différence sur ma facture de chauffage cet hiver.', 'client-02.png'],
            ['Nathalie Morin', 'Granby, QC (Menuiserie)', 'Un artisan très doué a créé un magnifique meuble sur mesure pour mon entrée. Le niveau de détail et la qualité du bois sont exceptionnels.', 'client-03.png'],
            ['Alain Desjardins', 'Saint-Hyacinthe, QC (Pose de plancher)', 'J\'ai fait installer du nouveau plancher de bois franc dans les chambres. Les installateurs ont travaillé avec une grande précision. Le résultat est parfait.', 'client-04.png'],
            ['Sylvie Lavoie', 'Blainville, QC (Rénovation de salle de bain)', 'La salle de bain de mes rêves est finalement devenue réalité. L\'entrepreneur a géré le projet de A à Z avec beaucoup de professionnalisme. Je l\'adore !', 'client-05.png'],
            ['Martin Simard', 'Châteauguay, QC (Installation de fenêtres)', 'Changement de toutes les fenêtres de la maison. L\'installation a été rapide et les fenêtres sont de grande qualité. On sent vraiment la différence d\'isolation.', 'client-06.png'],
            ['Chantal Gauthier', 'Terrebonne, QC (Entretien ménager post-rénovation)', 'Après de grosses rénovations, nous avons fait appel à un service de nettoyage via la plateforme. Ils ont fait un travail incroyable, la maison brillait.', 'client-07.png'],
            ['Pierre Bergeron', 'Mascouche, QC (Installation de système d\'alarme)', 'Le technicien a été très clair sur l\'utilisation du nouveau système de sécurité. L\'installation a été soignée et discrète. Je me sens beaucoup plus en sécurité.', 'client-08.png'],
            ['Valérie Lapointe', 'Saint-Eustache, QC (Réparation de toiture)', 'Un excellent service client. Le couvreur est venu évaluer les dommages suite à une tempête et les réparations ont été faites rapidement et à un prix juste.', 'client-01.png'],
            ['Éric Boucher', 'Boucherville, QC (Installation de climatisation)', 'Installation d\'une thermopompe murale avant la canicule. Le service a été impeccable de la vente à l\'installation. Très professionnel.', 'client-02.png'],
            ['Caroline Richard', 'Mirabel, QC (Pose de céramique)', 'Le carreleur a fait un travail d\'artiste pour notre nouveau dosseret de cuisine. Les coupes sont parfaites et le motif est très bien aligné.', 'client-03.png'],
            ['Stéphane Martel', 'Victoriaville, QC (Travaux de fondation)', 'J\'avais des fissures dans mon solage. L\'entreprise a réparé le tout de façon permanente et m\'a bien expliqué les causes du problème. Un service rassurant.', 'client-04.png']
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
