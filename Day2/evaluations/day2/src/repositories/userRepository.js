const prisma = require('../db/prisma');

const findByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

const create = async (userData) => {
  return await prisma.user.create({ data: userData });
};

const findById = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
};
  
module.exports = { findByEmail, create, findById };