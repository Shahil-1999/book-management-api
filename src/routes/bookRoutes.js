const express = require('express');
const multer = require('multer');
const BookController = require('../controllers/BookController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET all books
router.get('/', BookController.getAllBooks);

// GET a specific book
router.get('/:id', BookController.getBookById);

// POST a new book
router.post('/', BookController.createBook);

// PUT update a book
router.put('/:id', BookController.updateBook);

// DELETE a book
router.delete('/:id', BookController.deleteBook);

// POST import books from CSV
router.post('/import', upload.single('file'), BookController.importBooks);

module.exports = router;
