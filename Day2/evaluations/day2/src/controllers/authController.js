const authService = require('../services/authService');

const handleRegister = async (req, res) => {
  try {
    const { user, token } = await authService.createNewUser(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { user, token } = await authService.verifyUserCredentials(req.body);
    res.status(200).json({ user, token });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

const handleGetMe = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

module.exports = { 
  handleRegister, 
  handleLogin, 
  handleGetMe 
};