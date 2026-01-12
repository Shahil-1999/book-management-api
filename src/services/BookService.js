const Book = require("../models/Book");
const { AppError } = require("../middleware/errorHandler");

const getAllBooks = async () => {
  try {
    const books = await Book.findAll();
    if (!books?.length) {
      throw AppError("Book records not found", 404, false);
    }
    return books;
  } catch (error) {
    if (error && error.name === "AppError") throw error;
    throw AppError(`Failed to fetch book: ${error.message}`, 500, false);
  }
};

const getBookById = async (id) => {
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      throw AppError("Book record not found", 404, false);
    }
    return book;
  } catch (error) {
    if (error && error.name === "AppError") throw error;
    throw AppError(`Failed to fetch book: ${error.message}`, 500, false);
  }
};

const createBook = async (bookData) => {
  try {
    const { title, author, publishedYear } = bookData;

    if (!title || !author || !publishedYear) {
      throw AppError(
        "Title, author, and publishedYear are required",
        400,
        false
      );
    }

    if (
      typeof publishedYear !== "number" ||
      publishedYear < 1800 ||
      publishedYear > new Date().getFullYear()
    ) {
      throw AppError(
        `Published year must be a valid number between 1800 and ${new Date().getFullYear()}`,
        400,
        false
      );
    }

    const book = await Book.create({
      title,
      author,
      publishedYear,
    });

    return book;
  } catch (error) {
    if (error && error.name === "AppError") throw error;
    throw AppError(`Failed to create book: ${error.message}`, 500, false);
  }
};

const updateBook = async (id, bookData) => {
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      throw AppError("Book record not found", 404, false);
    }

    const { title, author, publishedYear } = bookData;

    if (publishedYear !== undefined && typeof publishedYear !== "number") {
      throw AppError("Published year must be a valid number", 400, false);
    }

    if (
      publishedYear !== undefined &&
      (publishedYear < 1000 || publishedYear > new Date().getFullYear())
    ) {
      throw AppError(
        `Published year must be between 1000 and ${new Date().getFullYear()}`,
        400,
        false
      );
    }

    await book.update({
      title: title || book.title,
      author: author || book.author,
      publishedYear:
        publishedYear !== undefined ? publishedYear : book.publishedYear,
    });

    return book;
  } catch (error) {
    if (error && error.name === "AppError") throw error;
    throw AppError(`Failed to update book: ${error.message}`, 500, false);
  }
};

const deleteBook = async (id) => {
  try {
    const book = await Book.findByPk(id);

    if (!book) {
      throw AppError("Book record not found", 404, false);
    }

    await book.destroy();
    return book;
  } catch (error) {
    if (error && error.name === "AppError") throw error;
    throw AppError(`Failed to delete book: ${error.message}`, 500, false);
  }
};

const importBooks = async (booksData) => {
  try {
    const books = await Book.bulkCreate(booksData);
    return books;
  } catch (error) {
    throw AppError(`Failed to import books: ${error.message}`, 500, false);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  importBooks,
};
