const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const { registerSchema, loginSchema } = require('../validators/authValidator');

//route
router.post('/register', validate(registerSchema), authController.handleRegister);
router.post('/login', validate(loginSchema), authController.handleLogin);

// tokens
router.post('/refresh', authController.handleRefresh);
router.post('/logout', authController.handleLogout);

/**
 * @swagger
 * /api/auth/me:
 * get:
 * summary: Récupérer mon profil
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Succès
 */
router.get('/me', authenticate, authController.handleGetMe);

module.exports = router;