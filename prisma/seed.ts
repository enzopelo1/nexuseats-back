import 'dotenv/config';
import { PrismaClient, CuisineType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Début du seeding...');

  // Nettoyer la base de données (sans supprimer les users pour garder les comptes)
  await prisma.category.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.restaurant.deleteMany();

  console.log('🧹 Base de données nettoyée');

  // Créer un utilisateur owner pour lier les restaurants (seed)
  const ownerPassword = await bcrypt.hash('secret123', 10);
  const seedOwner = await prisma.user.upsert({
    where: { email: 'owner@nexus.dev' },
    update: {},
    create: {
      email: 'owner@nexus.dev',
      password: ownerPassword,
      role: 'owner',
    },
  });
  console.log('✅ Utilisateur owner (seed):', seedOwner.email);

  // Créer les catégories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Entrées' } }),
    prisma.category.create({ data: { name: 'Plats' } }),
    prisma.category.create({ data: { name: 'Desserts' } }),
    prisma.category.create({ data: { name: 'Boissons' } }),
    prisma.category.create({ data: { name: 'Végétarien' } }),
    prisma.category.create({ data: { name: 'Sans gluten' } }),
  ]);

  console.log('✅ Catégories créées:', categories.length);

  // Restaurant 1: Le Petit Bistrot (Français)
  const restaurant1 = await prisma.restaurant.create({
    data: {
      name: 'Le Petit Bistrot',
      cuisine: CuisineType.FRENCH,
      address: '15 Rue de la Paix, 75002 Paris',
      countryCode: '+33',
      localNumber: '142868282',
      rating: 4.5,
      averagePrice: 25.5,
      deliveryTime: 30,
      isOpen: true,
      description: 'Restaurant traditionnel français proposant une cuisine authentique et raffinée',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      ownerId: seedOwner.id,
      menus: {
        create: [
          {
            name: 'Menu Déjeuner',
            description: 'Notre sélection pour le déjeuner',
            items: {
              create: [
                {
                  name: 'Soupe à l\'oignon gratinée',
                  description: 'Soupe traditionnelle avec croûtons et fromage fondu',
                  price: 8.5,
                  available: true,
                  categories: {
                    connect: [{ id: categories[0].id }],
                  },
                },
                {
                  name: 'Coq au vin',
                  description: 'Poulet mijoté au vin rouge avec champignons et lardons',
                  price: 18.0,
                  available: true,
                  categories: {
                    connect: [{ id: categories[1].id }],
                  },
                },
                {
                  name: 'Crème brûlée',
                  description: 'Crème vanillée avec caramel croustillant',
                  price: 7.0,
                  available: true,
                  categories: {
                    connect: [{ id: categories[2].id }],
                  },
                },
              ],
            },
          },
          {
            name: 'Menu Soir',
            description: 'Notre carte du soir',
            items: {
              create: [
                {
                  name: 'Escargots de Bourgogne',
                  description: 'Escargots au beurre persillé',
                  price: 12.0,
                  available: true,
                  categories: {
                    connect: [{ id: categories[0].id }],
                  },
                },
                {
                  name: 'Boeuf bourguignon',
                  description: 'Boeuf mijoté au vin rouge avec légumes',
                  price: 22.0,
                  available: true,
                  categories: {
                    connect: [{ id: categories[1].id }],
                  },
                },
                {
                  name: 'Tarte Tatin',
                  description: 'Tarte aux pommes caramélisées',
                  price: 8.5,
                  available: true,
                  categories: {
                    connect: [{ id: categories[2].id }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Restaurant 1 créé:', restaurant1.name);

  // Restaurant 2: Sushi Paradise (Japonais)
  const restaurant2 = await prisma.restaurant.create({
    data: {
      name: 'Sushi Paradise',
      cuisine: CuisineType.JAPANESE,
      address: '28 Avenue des Champs-Élysées, 75008 Paris',
      countryCode: '+33',
      localNumber: '145628990',
      rating: 4.8,
      averagePrice: 35.0,
      deliveryTime: 25,
      isOpen: true,
      description: 'Restaurant japonais authentique avec chef sushi expérimenté',
      imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
      ownerId: seedOwner.id,
      menus: {
        create: [
          {
            name: 'Menu Sushi',
            description: 'Sélection de sushis frais',
            items: {
              create: [
                {
                  name: 'Sashimi Mix',
                  description: 'Assortiment de poissons crus (saumon, thon, daurade)',
                  price: 24.0,
                  available: true,
                  categories: {
                    connect: [{ id: categories[0].id }, { id: categories[5].id }],
                  },
                },
                {
                  name: 'Maki California',
                  description: 'Maki au crabe, avocat et concombre',
                  price: 12.0,
                  available: true,
                  categories: {
                    connect: [{ id: categories[1].id }],
                  },
                },
                {
                  name: 'Mochi glacé',
                  description: 'Glace enrobée de pâte de riz (thé vert, fraise, mangue)',
                  price: 6.5,
                  available: true,
                  categories: {
                    connect: [{ id: categories[2].id }],
                  },
                },
              ],
            },
          },
          {
            name: 'Menu Tempura',
            description: 'Spécialités tempura',
            items: {
              create: [
                {
                  name: 'Edamame',
                  description: 'Fèves de soja à la fleur de sel',
                  price: 5.0,
                  available: true,
                  categories: {
                    connect: [{ id: categories[0].id }, { id: categories[4].id }],
                  },
                },
                {
                  name: 'Tempura Mix',
                  description: 'Crevettes et légumes en tempura',
                  price: 18.0,
                  available: true,
                  categories: {
                    connect: [{ id: categories[1].id }],
                  },
                },
                {
                  name: 'Thé vert Matcha',
                  description: 'Thé vert japonais traditionnel',
                  price: 4.0,
                  available: true,
                  categories: {
                    connect: [{ id: categories[3].id }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Restaurant 2 créé:', restaurant2.name);

  // Restaurant 3: Pizza Napoli (Italien)
  const restaurant3 = await prisma.restaurant.create({
    data: {
      name: 'Pizza Napoli',
      cuisine: CuisineType.ITALIAN,
      address: '42 Rue de Rivoli, 75004 Paris',
      countryCode: '+33',
      localNumber: '148876321',
      rating: 4.3,
      averagePrice: 18.0,
      deliveryTime: 35,
      isOpen: true,
      description: 'Pizzeria italienne avec four à bois traditionnel',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
      ownerId: seedOwner.id,
      menus: {
        create: [
          {
            name: 'Menu Pizza',
            description: 'Nos pizzas artisanales',
            items: {
              create: [
                {
                  name: 'Bruschetta',
                  description: 'Pain grillé, tomates, basilic et huile d\'olive',
                  price: 6.0,
                  available: true,
                  categories: {
                    connect: [{ id: categories[0].id }, { id: categories[4].id }],
                  },
                },
                {
                  name: 'Pizza Margherita',
                  description: 'Tomate, mozzarella, basilic',
                  price: 12.0,
                  available: true,
                  categories: {
                    connect: [{ id: categories[1].id }, { id: categories[4].id }],
                  },
                },
                {
                  name: 'Tiramisu',
                  description: 'Dessert italien au café et mascarpone',
                  price: 7.5,
                  available: true,
                  categories: {
                    connect: [{ id: categories[2].id }],
                  },
                },
              ],
            },
          },
          {
            name: 'Menu Pasta',
            description: 'Pâtes fraîches maison',
            items: {
              create: [
                {
                  name: 'Carpaccio de boeuf',
                  description: 'Fines tranches de boeuf, parmesan et roquette',
                  price: 14.0,
                  available: true,
                  categories: {
                    connect: [{ id: categories[0].id }],
                  },
                },
                {
                  name: 'Spaghetti Carbonara',
                  description: 'Pâtes, lardons, oeuf et parmesan',
                  price: 15.0,
                  available: true,
                  categories: {
                    connect: [{ id: categories[1].id }],
                  },
                },
                {
                  name: 'Panna Cotta',
                  description: 'Crème italienne au coulis de fruits rouges',
                  price: 6.5,
                  available: true,
                  categories: {
                    connect: [{ id: categories[2].id }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Restaurant 3 créé:', restaurant3.name);

  // Statistiques finales
  const stats = {
    restaurants: await prisma.restaurant.count(),
    menus: await prisma.menu.count(),
    menuItems: await prisma.menuItem.count(),
    categories: await prisma.category.count(),
  };

  console.log('\n📊 Statistiques du seeding:');
  console.log(`   - Restaurants: ${stats.restaurants}`);
  console.log(`   - Menus: ${stats.menus}`);
  console.log(`   - Items de menu: ${stats.menuItems}`);
  console.log(`   - Catégories: ${stats.categories}`);
  console.log('\n✨ Seeding terminé avec succès!\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
