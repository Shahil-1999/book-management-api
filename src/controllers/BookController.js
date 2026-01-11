const BookService = require("../services/BookService");
const { parseCSV } = require("../middleware/csvValidator");
const { AppError } = require("../middleware/errorHandler");

const getAllBooks = async (req, res, next) => {
  try {
    const books = await BookService.getAllBooks();
    return res.json({
      status: true,
      msg: "Book records fetched successfully",
      data: books,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await BookService.getBookById(id);
    return res.json({
      status: true,
      msg: "Book record fetched successfully",
      data: book,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  try {
    const { title, author, publishedYear } = req.body;
    const book = await BookService.createBook({ title, author, publishedYear });
    return res.json({
      status: true,
      msg: "Book record created successfully",
      data: book,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, publishedYear } = req.body;
    const book = await BookService.updateBook(id, {
      title,
      author,
      publishedYear,
    });
    return res.json({
      status: true,
      msg: "Book record updated successfully",
      data: book,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    await BookService.deleteBook(id);
    return res.json({
      status: true,
      msg: "Book record deleted successfully",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

const importBooks = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("CSV file is required", 400);
    }

    if (
      req.file.mimetype !== "text/csv" &&
      !req.file.originalname.endsWith(".csv")
    ) {
      throw new AppError("Only CSV files are allowed", 400, false);
    }

    const { data, errors } = parseCSV(req.file.buffer);

    let importedCount = 0;
    if (data.length > 0) {
      const importedBooks = await BookService.importBooks(data);
      importedCount = importedBooks.length;
    }

    res.status(200).json({
      status: "Book records imported successfully",
      data: {
        imported: importedCount,
        errors: errors.length > 0 ? errors : null,
      },
    });
  } catch (error) {
    next(error);
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
