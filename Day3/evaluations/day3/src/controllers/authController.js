const authService = require('../services/authService');
const config = require('../config/env');

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

const handleRegister = async (req, res, next) => {
  try {
   
    const { nom, email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.register({ nom, email, password });

    setRefreshCookie(res, refreshToken);
    
    res.status(201).json({ user, accessToken });
  } catch (error) {
    next(error); 
  }
};

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);


    setRefreshCookie(res, refreshToken);

    res.status(200).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

const handleRefresh = async (req, res, next) => {
  try {

    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: "Refresh token manquant" });
    }

    const { accessToken } = await authService.refresh(token);
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    await authService.logout(token);

    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const handleGetMe = async (req, res, next) => {
  try {
 
    const user = await authService.getMe(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { handleRegister, handleLogin, handleRefresh, handleLogout, handleGetMe };