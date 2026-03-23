const bookRepository = require('../repositories/bookRepository');

const getAllBooks = () => bookRepository.findAll();

const getBookById = (id) => bookRepository.findById(id);

const addBook = (data) => bookRepository.create(data);

const updateBook = (id, data) => bookRepository.update(id, data);

const deleteBook = (id) => bookRepository.remove(id);

const borrow = async (livreId, userId) => {
  const livre = await bookRepository.findById(livreId);
  if (!livre) throw new Error("Livre introuvable");
  if (!livre.disponible) {
    const error = new Error("Ce livre n'est pas disponible");
    error.status = 409;
    throw error;
  }
  return await bookRepository.borrowBook(livreId, userId);
};

const returnLivre = (livreId, userId) => bookRepository.returnBook(livreId, userId);

module.exports = { getAllBooks, getBookById, addBook, updateBook, deleteBook, borrow, returnLivre };