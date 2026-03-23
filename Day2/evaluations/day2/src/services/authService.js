const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const config = require('../config/env');

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
    ...userData,
    password: hashedPassword
  });

  
  const token = jwt.sign(
    { id: user.id, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  delete user.password;
  return { user, token };
};

const login = async (credentials) => {

  const authError = new Error("Email ou mot de passe incorrect");
  authError.status = 401;

  const user = await userRepository.findByEmail(credentials.email);
  if (!user) throw authError;

  const isMatch = await bcrypt.compare(credentials.password, user.password);
  if (!isMatch) throw authError;

  const token = jwt.sign(
    { id: user.id, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
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

module.exports = { register, login, getMe };