const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

/**
 * @swagger
 * /api/books:
 * get:
 * summary: Récupérer tous les livres (Public)
 * responses:
 * 200:
 * description: Liste des livres
 */
router.get('/', booksController.getAllBooks);

/**
 * @swagger
 * /api/books/{id}:
 * get:
 * summary: Récupérer un livre par ID (Public)
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Détails du livre
 * 404:
 * description: Livre non trouvé
 */
router.get('/:id', booksController.getBookById);

/**
 * @swagger
 * /api/books:
 * post:
 * summary: Ajouter un nouveau livre (Admin)
 * security:
 * - bearerAuth: []
 * responses:
 * 201:
 * description: Livre créé
 * 401:
 * description: Non authentifié
 * 403:
 * description: Accès refusé (Admin requis)
 */
router.post('/', authenticate, authorize('admin'), booksController.addBook);
router.delete('/:id', authenticate, authorize('admin'), booksController.deleteBook);
router.post('/:id/emprunter', authenticate, booksController.borrowBook);
router.post('/:id/retourner', authenticate, booksController.returnBook);

module.exports = router;