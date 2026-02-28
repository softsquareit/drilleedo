<?php

namespace App\DataFixtures;

use App\Entity\Blog;
use App\Entity\Category;
use App\Entity\Company;
use App\Entity\Type;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\String\Slugger\AsciiSlugger;

class BlogFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $companies = $manager->getRepository(Company::class)->findAll();
        $categories = $manager->getRepository(Category::class)->findAll();
        $slugger = new AsciiSlugger();

        $types = ['Tips', 'DIY Ideas', 'Home Renovation', 'Construction Best Practices', 'Innovation'];
        $typeEntities = [];
        foreach ($types as $typeName) {
            $type = new Type();
            $type->setType($typeName);
            $manager->persist($type);
            $typeEntities[] = $type;
        }

        $articles = [
            [
                'title' => '10 Essential Tips for a Stress-Free Kitchen Renovation',
                'category' => 'Cuisine',
                'type' => 'Idea',
                'excerpt' => 'Planning a kitchen remodel? Discover 10 essential building tips to keep your project on track and under budget.',
                'content' => "## Avoid Common Kitchen Remodel Pitfalls\n\nKitchen renovation is one of the most rewarding DIY ideas for homeowners. However, without construction best practices, it can quickly become overwhelming. Here are our top tips for success.\n\n### 1. Plan Your Workflow\nThink about the 'kitchen triangle' (sink, stove, refrigerator). A good layout saves time and energy every day. \n\n### 2. Don't Skimp on Lighting\nCombine task lighting under cabinets with ambient lighting for a premium feel. Realistic photos of modern kitchens often showcase how warm LEDs can transform the space.\n\n### 3. Choose Durable Materials\nFor high-traffic areas, quartz or granite countertops are better DIY ideas than cheaper alternatives that stain easily.\n\n**Keywords:** building tips, kitchen renovation, DIY ideas, home improvement."
            ],
            [
                'title' => 'Sustainable Building: Modern Eco-Friendly Construction Practices',
                'category' => 'Construction',
                'type' => 'Innovation',
                'excerpt' => 'Learn how modern construction best practices are integrating sustainable materials for greener homes.',
                'content' => "## The Future of Green Building\n\nInnovation in the building industry is shifting towards sustainability. Implementing building tips that prioritize energy efficiency is no longer just a trend—it's a necessity.\n\n### Solar Integration and Smart Design\nBy orienting houses to maximize natural light, builders reduce heating costs. Home renovation projects can include installing solar panels or heat pumps to modernize old structures.\n\n### Recycled and Renewable Materials\nUsing reclaimed wood or bamboo not only looks stunning in photos but also supports a circular economy. \n\n**Keywords:** sustainable building, green construction, innovation, energy efficiency."
            ],
            [
                'title' => 'Mastering Drywall Installation: A Professional Guide for Beginners',
                'category' => 'Gros œuvre',
                'type' => 'Tutorial',
                'excerpt' => 'A step-by-step guide to achieving professional results in your next drywall DIY project.',
                'content' => "## Smooth Walls Start with Proper Technique\n\nMastering drywall is one of the most useful DIY ideas for any home renovation enthusiast. Follow these construction best practices for a seamless finish.\n\n### Tools You'll Need\nBefore starting, ensure you have a sharp utility knife, a T-square, and quality joint compound. \n\n### Hanging vs. Taping\nHanging the boards correctly is 50% of the job. Use specialized screws and avoid over-driving them into the paper layer. For taping, apply thin layers of mud and sand lightly between coats to avoid dust clouds.\n\n**Keywords:** drywall installation, building tips, DIY tutorial, home renovation."
            ],
            [
                'title' => 'Innovative Smart Home Security Systems for 2024',
                'category' => 'Électricité',
                'type' => 'Idea',
                'excerpt' => 'Explore the latest building tips for integrating high-tech security into your residential construction projects.',
                'content' => "## Security Meets Smart Design\n\nIn 2024, smart home security is at the forefront of innovation. Modern construction best practices now include pre-wiring for integrated camera systems and smart locks.\n\n### Key Benefits of Integration\nIntegrated systems allow for remote monitoring via smartphone. When planning your home renovation, consider adding smart doorbells and motion-sensing floodlights.\n\n### DIY Ideas for Better Protection\nYou don't always need a professional for basic security upgrades. Wireless sensors are great DIY ideas that offer peace of mind without complex wiring.\n\n**Keywords:** smart home, security systems, building tips, home renovation, innovation."
            ],
            [
                'title' => 'How to Choose the Right Foundation for Your New Home',
                'category' => 'Fondations',
                'type' => 'Construction Best Practices',
                'excerpt' => 'Understanding the different types of foundations is crucial for long-term structural integrity.',
                'content' => "## The Core of Every Building\n\nWithout a solid foundation, even the best home renovation efforts are at risk. Understanding construction best practices regarding soil types and foundation choice is vital.\n\n### Slab-on-Grade vs. Crawl Spaces\nSlab foundations are common in warmer climates, while crawl spaces allow for easier access to plumbing during future building tips cycles. \n\n### Professional Inspection\nAlways consult with a structural engineer. Realistic photos of cracked foundations serve as a stern reminder of why skimping here is a bad idea.\n\n**Keywords:** home foundation, building tips, construction best practices, structural integrity."
            ],
            [
                'title' => 'Winterizing Your Home: Essential DIY Maintenance Tips',
                'category' => 'Rénovation',
                'type' => 'Idea',
                'excerpt' => 'Prepare your home for the cold with these easy-to-follow winterization DIY ideas.',
                'content' => "## Keep the Heat In and the Costs Down\n\nAs temperatures drop, these building tips will help you maintain a cozy environment. Proper winterization is a key part of home renovation maintenance.\n\n### Sealing Air Leaks\nUse caulk or weatherstripping around windows and doors. This simple DIY idea can significantly reduce your energy bills.\n\n### Checking the Roof and Gutters\nClean gutters prevent ice dams. Check your attic insulation; adding more is an effective way to improve energy efficiency without major construction.\n\n**Keywords:** winterization, DIY ideas, home maintenance, building tips, energy saving."
            ],
            [
                'title' => 'The Ultimate Guide to Modern Bathroom Lighting',
                'category' => 'Salle de bain',
                'type' => 'Idea',
                'excerpt' => 'Transform your bathroom into a spa with these innovative lighting building tips.',
                'content' => "## Brighter Ideas for Your Bath\n\nBathroom lighting has evolved beyond simple ceiling fixtures. Modern home renovation trends focus on layered lighting for both functionality and mood.\n\n### Vanity and Task Lighting\nEnsure lights are placed at eye level to avoid shadows on the face. Backlit mirrors are popular in luxury photos and offer a clean, modern look.\n\n### Safe Installation Practices\nAlways adhere to electrical safety standards. Working around water requires construction best practices and often a certified professional.\n\n**Keywords:** bathroom lighting, home renovation, DIY ideas, building tips, interior design."
            ],
            [
                'title' => 'Under-Basement Waterproofing: A Necessary Investment',
                'category' => 'Sous-sol',
                'type' => 'Construction Best Practices',
                'excerpt' => 'Protect your home from moisture and mold with these professional waterproofing building tips.',
                'content' => "## Stop Water Before It Starts\n\nA damp basement can ruin your home renovation plans. Effective waterproofing requires following strict construction best practices.\n\n### Interior vs. Exterior Drainage\nExterior weeping tiles are the gold standard, but interior French drains are great DIY ideas for existing structures with moderate moisture issues.\n\n### Sealants and Coatings\nApplying high-quality waterproof paint to walls is a simple task that aids in overall moisture control. \n\n**Keywords:** basement waterproofing, building tips, construction best practices, mold prevention."
            ],
            [
                'title' => 'Upgrading Your Electrical Panel: What You Need to Know',
                'category' => 'Panneau électrique',
                'type' => 'Idea',
                'excerpt' => 'Recognizing when it is time for an electrical upgrade is essential for home safety and innovation.',
                'content' => "## Powering the Modern Home\n\nWith more devices than ever, many older homes require an electrical home renovation. Upgrading your panel ensures your house meets modern construction best practices.\n\n### Signs of an Overloaded System\nFrequent breaker trips or flickering lights are warning signs. Building tips for newer homes suggest at least 200-amp service for future flexibility.\n\n### Professional vs. DIY\nInternal panel work is high-risk. While there are many DIY ideas for your home, this is one area where expert building tips recommend hiring a licensed electrician.\n\n**Keywords:** electrical panel, home renovation, building tips, home safety."
            ],
            [
                'title' => 'Modern Plumbing Materials: PEX vs. Copper',
                'category' => 'Plomberie',
                'type' => 'Innovation',
                'excerpt' => 'A comparison of modern plumbing materials to help you choose the best for your next project.',
                'content' => "## Piping the Right Way\n\nChoosing plumbing materials is a critical part of construction best practices. While copper has long been the standard, PEX is an innovation gaining ground.\n\n### The Benefits of PEX\nPEX is flexible, cheaper, and resistant to scale. It's becoming one of the favorite DIY ideas for plumbing repairs due to its ease of installation.\n\n### When to Stick with Copper\nCopper is durable and has natural antimicrobial properties. For high-end home renovation, many still prefer the classic reliability of metal pipes.\n\n**Keywords:** plumbing, PEX vs copper, building tips, innovation, home renovation."
            ],
            [
                'title' => 'Deck Building 101: Foundation and Framing Basics',
                'category' => 'Charpente',
                'type' => 'Tutorial',
                'excerpt' => 'Everything you need to know about building a sturdy and lasting outdoor deck.',
                'content' => "## Build Your Outdoor Oasis\n\nAdding a deck is one of the most popular home renovation projects. Following solid building tips for framing is key to safety.\n\n### Footings and Anchors\nEnsure footings are below the frost line. This is a critical construction best practice to prevent the deck from heaving in winter.\n\n### Choosing Pressure-Treated Wood\nSelect lumber rated for ground contact. Photos of decaying decks usually point back to poor material choice or lack of regular maintenance. \n\n**Keywords:** deck building, DIY ideas, construction best practices, home renovation."
            ],
            [
                'title' => 'Increasing Home Value with Smart Landscaping',
                'category' => 'Innovation',
                'type' => 'Idea',
                'excerpt' => 'Boost your curb appeal and home value with these innovative landscaping building tips.',
                'content' => "## First Impressions Count\n\nLandscaping is an often overlooked part of home renovation. Smart DIY ideas in the garden can yield a high return on investment.\n\n### Xeriscaping and Local Plants\nUsing drought-resistant plants is an innovation that saves water and looks great in real estate photos. \n\n### Hardscaping Best Practices\nProperly installed patios and walkways require good base prep. Follow construction best practices for leveling to avoid future trip hazards.\n\n**Keywords:** landscaping, home value, DIY ideas, building tips, curb appeal."
            ],
            [
                'title' => 'The Growing Trend of Metal Roofing in Residential Design',
                'category' => 'Innovation',
                'type' => 'Construction Best Practices',
                'excerpt' => 'Why more homeowners are choosing metal roofing for its longevity and energy efficiency.',
                'content' => "## Roofing for the Long Haul\n\nMetal roofing is a significant innovation in residential construction. It offers extreme durability and follows construction best practices for fire resistance.\n\n### Reflecting Heat and Lowering Costs\nModern metal roofs reflect solar radiant heat, making them excellent building tips for hot climates. \n\n### Aesthetic Versatility\nForget the corrugated sheets of old; modern metal roofing comes in many styles that mimic traditional tiles but with 50+ year lifespans.\n\n**Keywords:** metal roofing, building tips, innovation, home renovation, durability."
            ],
            [
                'title' => 'Tile Setting Like a Pro: Avoiding Hollow Spots',
                'category' => 'Rénovation',
                'type' => 'Tutorial',
                'excerpt' => 'Learn the secret to perfect tile adhesion for your next flooring or wall project.',
                'content' => "## Solid Foundations for Beautiful Floors\n\nHollow tiles are a sign of poor construction best practices. These building tips will ensure your tile work lasts for decades.\n\n### Proper Bedding and Back-Buttering\nAlways ensure 95% thin-set coverage. Back-buttering large tiles is an essential DIY idea for preventing future cracks.\n\n### Substrate Preparation\nThe floor must be level and clean. Any deflection in the subfloor will ruin even the most expensive tiles. \n\n**Keywords:** tiling, DIY ideas, construction best practices, home renovation, flooring."
            ],
            [
                'title' => 'Modern HVAC Innovations for Better Air Quality',
                'category' => 'Innovation',
                'type' => 'Innovation',
                'excerpt' => 'Explore the latest building tips for improving indoor air quality with smart HVAC systems.',
                'content' => "## Breathing Easier at Home\n\nIndoor air quality is a major focus in modern construction best practices. Innovation in filtration and ventilation is key to a healthy home.\n\n### Smart Thermostats and Scanners\nDevices that monitor CO2 and humidity levels are great addition to any home renovation. \n\n### UV Light Filtration\nInstalling UV-C lights inside air handlers is a professional trick to kill mold and bacteria before they circulate through the house.\n\n**Keywords:** HVAC, air quality, innovation, building tips, home health."
            ],
            [
                'title' => 'Cabinet Refacing: A Cost-Effective Kitchen Update',
                'category' => 'Cuisine',
                'type' => 'Idea',
                'excerpt' => 'How to give your kitchen a whole new look without the price tag of a full remodel.',
                'content' => "## New Style on a Budget\n\nIf your cabinet boxes are solid, refacing is a brilliant home renovation hack. It's one of the high-impact DIY ideas that saves thousands.\n\n### Choosing Your Finishes\nFrom paint to wood veneers, the options are endless. Search for 'kitchen refacing photos' to find inspiration for your specific layout.\n\n### Step-by-Step Building Tips\nThorough cleaning and sanding are the most important steps. Without proper prep, even the best paint will peel.\n\n**Keywords:** kitchen update, DIY ideas, building tips, cabinet refacing."
            ],
            [
                'title' => 'The Pros and Cons of Open Concept Floor Plans',
                'category' => 'Introduction',
                'type' => 'Construction Best Practices',
                'excerpt' => 'Considering removing a wall? Read these building tips first to understand the structural implications.',
                'content' => "## To Wall or Not to Wall\n\nOpen concept design remains a popular innovation in architecture. However, it requires following strict construction best practices regarding load-bearing walls.\n\n### Identifying Load-Bearing Structures\nNever assume a wall is decorative. Proper building tips suggest checking your attic or crawl space for support patterns.\n\n### The Trade-offs\nWhile open plans look great in photos and feel spacious, they can be louder and more expensive to heat. Consider your lifestyle before committing to this major home renovation.\n\n**Keywords:** open concept, building tips, construction best practices, home design."
            ],
            [
                'title' => 'Soundproofing Your Home Office: Professional Solutions',
                'category' => 'Rénovation',
                'type' => 'Construction Best Practices',
                'excerpt' => 'Create a quiet workspace with these effective soundproofing building tips.',
                'content' => "## Quiet Work in a Busy House\n\nWith more people working from home, soundproofing is a prioritized home renovation. Achieving true silence requires specialized construction best practices.\n\n### Decoupling and Mass\nAdding a second layer of drywall with 'Green Glue' is a high-performance DIY idea. \n\n### Sealing Air Gaps\nSound travels like water through air gaps. Acoustic caulk around outlets and baseboards is a simple task that makes a huge difference. \n\n**Keywords:** soundproofing, building tips, home office, home renovation, acoustic design."
            ],
            [
                'title' => 'Installing Outdoor Lighting for Safety and Style',
                'category' => 'Éclairage',
                'type' => 'Idea',
                'excerpt' => 'Enhance your home\'s exterior with these innovative and easy DIY lighting ideas.',
                'content' => "## Light Up Your Night\n\nOutdoor lighting is both an innovation in security and a major style upgrade. These building tips will help you do it safely.\n\n### Low-Voltage vs. Solar\nSolar lights are easy DIY ideas but low-voltage wired systems offer more reliability and brightness. \n\n### Highlighting Architectural Features\nUse 'uplighting' on trees and 'moonlighting' from higher branches to create professional-looking outdoor spaces that look great in photos.\n\n**Keywords:** outdoor lighting, DIY ideas, home renovation, building tips, landscape lighting."
            ],
            [
                'title' => 'Choosing the Best Flooring for High-Traffic Areas',
                'category' => 'Rénovation',
                'type' => 'Idea',
                'excerpt' => 'Find the perfect balance between style and durability with these flooring building tips.',
                'content' => "## Stands Up to Life\n\nSelecting flooring is a centerpiece of any home renovation. For high-traffic areas, you need materials that follow construction best practices for durability.\n\n### Luxury Vinyl Plank (LVP)\nLVP is an innovation that is 100% waterproof and highly scratch-resistant. It's one of the top DIY ideas because it's so easy to click together.\n\n### Hardwood and Tile\nWhile tile is the most durable, it can be cold. Hardwood adds warmth but may require more maintenance long-term. Look at 'durable flooring photos' to see how these materials age over time.\n\n**Keywords:** flooring, building tips, DIY ideas, home renovation, durable materials."
            ],
        ];

        foreach ($articles as $i => $articleData) {
            $blog = new Blog();
            $blog->setTitle($articleData['title']);
            $blog->setSlug($slugger->slug($articleData['title'])->lower());
            $blog->setShortDesc($articleData['excerpt']);
            $blog->setDescription($articleData['content']);
            $blog->setMainImg('https://source.unsplash.com/featured/?construction,building,' . $i); // Placeholders from Unsplash
            $blog->setCreatedAt(new \DateTimeImmutable("-" . (20 - $i) . " days"));

            // Associate with a random company
            if (!empty($companies)) {
                $blog->setAuthor($companies[array_rand($companies)]);
            }

            // Associate with a random category
            // We search for the category by name from our results earlier
            $mappedCategory = null;
            foreach ($categories as $cat) {
                if (stripos($cat->getName(), $articleData['category']) !== false) {
                    $mappedCategory = $cat;
                    break;
                }
            }
            $blog->setCategory($mappedCategory ?: ($categories[array_rand($categories)] ?? null));

            // Set Type string or entity?
            // The Blog entity's getType() returns ?string, but setType(string $type). 
            // In AdminController it sets a string. So:
            $blog->setType($articleData['type']);

            $manager->persist($blog);
        }

        $manager->flush();
    }
}
