const bookService = require('../services/bookService');

const getAllBooks = async (req, res, next) => {
  try {
    const livres = await bookService.getAllBooks();
    res.json(livres);
  } catch (error) {
    next(error); 
  }
};

const getBookById = async (req, res, next) => {
  try {
    const livre = await bookService.getBookById(req.params.id);
    if (!livre) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }
    res.json(livre);
  } catch (error) {
    next(error);
  }
};

const addBook = async (req, res, next) => {
  try {
  
    const { titre, auteur, annee_publication, genre } = req.body;
    const livre = await bookService.addBook({ titre, auteur, annee_publication, genre });
    res.status(201).json(livre);
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    await bookService.deleteBook(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const borrowBook = async (req, res, next) => {
  try {
    const result = await bookService.borrow(req.params.id, req.user.id);
    res.json({ message: "Livre emprunté avec succès", result });
  } catch (error) {
    next(error);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const result = await bookService.returnLivre(req.params.id, req.user.id);
    res.json({ message: "Livre retourné avec succès", result });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBooks, getBookById, addBook, deleteBook, borrowBook, returnBook };