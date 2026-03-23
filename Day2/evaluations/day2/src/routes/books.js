const express = require('express');
const router = express.Router();
const bookService = require('../services/bookService');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');


router.get('/', async (req, res) => {
  const livres = await bookService.getAllBooks();
  res.json(livres);
});


router.get('/:id', async (req, res) => {
  try {
    const livre = await bookService.getBookById(req.params.id);
    if (!livre) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    res.json(livre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  const livre = await bookService.addBook(req.body);
  res.status(201).json(livre);
});


router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  await bookService.deleteBook(req.params.id);
  res.status(204).send();
});


router.post('/:id/emprunter', authenticate, async (req, res) => {
  try {
    const result = await bookService.borrow(req.params.id, req.user.id);
    res.json({ message: "Livre emprunté avec succès", result });
  } catch (error) {
    res.status(error.status || 400).json({ message: error.message });
  }
});


router.post('/:id/retourner', authenticate, async (req, res) => {
  const result = await bookService.returnLivre(req.params.id, req.user.id);
  res.json({ message: "Livre retourné avec succès", result });
});

module.exports = router;