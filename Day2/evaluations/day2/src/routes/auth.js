const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const { registerSchema, loginSchema } = require('../validators/authValidator');

router.post('/register', validate(registerSchema), authController.handleRegister);
router.post('/login', validate(loginSchema), authController.handleLogin);
router.get('/me', authenticate, authController.handleGetMe);

module.exports = router;