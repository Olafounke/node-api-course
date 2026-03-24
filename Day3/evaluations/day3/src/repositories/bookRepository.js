const prisma = require('../db/prisma');

const findAll = () => prisma.livre.findMany();

const findById = (id) => prisma.livre.findUnique({ where: { id: parseInt(id) } });

const create = (data) => prisma.livre.create({ data });

const update = (id, data) => prisma.livre.update({
  where: { id: parseInt(id) },
  data
});

const remove = (id) => prisma.livre.delete({ where: { id: parseInt(id) } });

const borrowBook = async (livreId, userId) => {
  return await prisma.$transaction([
    prisma.emprunt.create({
      data: { livreId: parseInt(livreId), userId: parseInt(userId) }
    }),
    prisma.livre.update({
      where: { id: parseInt(livreId) },
      data: { disponible: false }
    })
  ]);
};

const returnBook = async (livreId, userId) => {

  const emprunt = await prisma.emprunt.findFirst({
    where: { livreId: parseInt(livreId), userId: parseInt(userId), dateRetour: null }
  });

  if (!emprunt) throw new Error("Aucun emprunt actif trouvé pour ce livre");

  return await prisma.$transaction([
    prisma.emprunt.update({
      where: { id: emprunt.id },
      data: { dateRetour: new Date() }
    }),
    prisma.livre.update({
      where: { id: parseInt(livreId) },
      data: { disponible: true }
    })
  ]);
};

module.exports = { findAll, findById, create, update, remove, borrowBook, returnBook };