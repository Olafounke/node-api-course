const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Sowing seeds...');

  const hashedAdminPassword = await bcrypt.hash('admin12345', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bibliotheque.com' },
    update: {},
    create: {
      nom: 'Administrateur',
      email: 'admin@bibliotheque.com',
      password: hashedAdminPassword,
      role: 'admin',
    },
  });

  const livres = [
    { titre: '1984', auteur: 'George Orwell', annee: 1949, genre: 'Dystopie' },
    { titre: 'Le Seigneur des Anneaux', auteur: 'J.R.R. Tolkien', annee: 1954, genre: 'Fantasy' },
    { titre: "L'Étranger", auteur: 'Albert Camus', annee: 1942, genre: 'Philosophie' },
  ];

  for (const l of livres) {
    await prisma.livre.create({ data: l });
  }

  console.log('Seed exécuté avec succès : 1 Admin et 3 Livres créés.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });