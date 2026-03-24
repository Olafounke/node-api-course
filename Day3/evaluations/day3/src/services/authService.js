const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const config = require('../config/env');

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role }, 
    config.JWT_SECRET, 
    { expiresIn: '15m' } 
  );
  const refreshToken = jwt.sign(
    { id: user.id }, 
    config.JWT_REFRESH_SECRET, 
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
};


const register = async (userData) => {
  const existingUser = await userRepository.findByEmail(userData.email);
  if (existingUser) {
    const error = new Error("Email déjà existant");
    error.status = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const user = await userRepository.create({
    nom: userData.nom,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || 'user'
  });

  const { accessToken, refreshToken } = generateTokens(user);
  

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await userRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

  delete user.password;
  return { user, accessToken, refreshToken };
};


const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Identifiants invalides");
    error.status = 401;
    throw error;
  }

  const { accessToken, refreshToken } = generateTokens(user);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await userRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

  return { 
    accessToken, 
    refreshToken, 
    user: { id: user.id, nom: user.nom, email: user.email, role: user.role } 
  };
};


const refresh = async (token) => {
  const savedToken = await userRepository.findRefreshToken(token);
  if (!savedToken || savedToken.expiresAt < new Date()) {
    const error = new Error("Refresh token invalide ou expiré");
    error.status = 401;
    throw error;
  }
  const accessToken = jwt.sign(
    { id: savedToken.user.id, role: savedToken.user.role }, 
    config.JWT_SECRET, 
    { expiresIn: '15m' }
  );
  
  return { accessToken };
};


const logout = async (token) => {
  if (!token) return;
  try {
    await userRepository.deleteRefreshToken(token);
  } 
  catch (e) {}
};

const getMe = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error("Utilisateur introuvable");
    error.status = 404;
    throw error;
  }
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

module.exports = { register, login, getMe, refresh, logout, generateTokens };