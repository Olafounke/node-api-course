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

const saveRefreshToken = async (userId, token, expiresAt) => {
  return await prisma.refreshToken.create({
    data: {
      userId,
      token,
      expiresAt
    }
  });
};

const findRefreshToken = async (token) => {
  return await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true } 
  });
};

const deleteRefreshToken = async (token) => {
  return await prisma.refreshToken.delete({
    where: { token }
  });
};

module.exports = { findByEmail, create, findById, saveRefreshToken, findRefreshToken, deleteRefreshToken };
  