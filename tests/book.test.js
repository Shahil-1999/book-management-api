const request = require('supertest');
const app = require('../src/server');
const sequelize = require('../config/database');
const Book = require('../src/models/Book');

describe('Book API Tests', () => {
  // Setup: Create tables before running tests
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Cleanup: Close database after all tests
  afterAll(async () => {
    await sequelize.close();
  });

  // GET all books tests
  describe('GET /books', () => {
    test('GET /books should return empty list', async () => {
      const response = await request(app).get('/books');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(false);
      expect(response.body.statusCode).toBe(404);
    });

    test('GET /books should return all books', async () => {
      // Create a book first
      await request(app).post('/books').send({
        title: 'JavaScript Guide',
        author: 'John Doe',
        publishedYear: 2020,
      });

      const response = await request(app).get('/books');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].title).toBe('JavaScript Guide');
    });
  });

  // POST create book tests
  describe('POST /books', () => {
    test('POST /books should create a new book', async () => {
      const newBook = {
        title: 'Python Basics',
        author: 'Jane Smith',
        publishedYear: 2022,
      };

      const response = await request(app).post('/books').send(newBook);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.data.title).toBe('Python Basics');
      expect(response.body.data.author).toBe('Jane Smith');
    });

    test('POST /books should fail without title', async () => {
      const response = await request(app).post('/books').send({
        author: 'Jane Smith',
        publishedYear: 2022,
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(false);
    });

    test('POST /books should fail with invalid year', async () => {
      const response = await request(app).post('/books').send({
        title: 'Old Book',
        author: 'Old Author',
        publishedYear: 1500,
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(false);
    });
  });

  // GET single book tests
  describe('GET /books/:id', () => {
    test('GET /books/:id should return a book by id', async () => {
      // Create a book via API
      const createResponse = await request(app).post('/books').send({
        title: 'React Guide',
        author: 'Bob Johnson',
        publishedYear: 2021,
      });

      const bookId = createResponse.body.data.id;
      const response = await request(app).get(`/books/${bookId}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.data.id).toBe(bookId);
      expect(response.body.data.title).toBe('React Guide');
    });

    test('GET /books/:id should return 404 for invalid id', async () => {
      const response = await request(app).get('/books/invalid-id-123');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(false);
    });
  });

  // PUT update book tests
  describe('PUT /books/:id', () => {
    test('PUT /books/:id should update a book', async () => {
      // Create a book first
      const createResponse = await request(app).post('/books').send({
        title: 'Old Title',
        author: 'Old Author',
        publishedYear: 2020,
      });

      const bookId = createResponse.body.data.id;

      // Update the book
      const response = await request(app).put(`/books/${bookId}`).send({
        title: 'New Title',
        author: 'New Author',
        publishedYear: 2023,
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.data.title).toBe('New Title');
      expect(response.body.data.author).toBe('New Author');
    });

    test('PUT /books/:id should return 404 for invalid id', async () => {
      const response = await request(app).put('/books/invalid-id-123').send({
        title: 'Updated Title',
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(false);
    });
  });

  // DELETE book tests
  describe('DELETE /books/:id', () => {
    test('DELETE /books/:id should delete a book', async () => {
      // Create a book first
      const createResponse = await request(app).post('/books').send({
        title: 'Book to Delete',
        author: 'Author Name',
        publishedYear: 2019,
      });

      const bookId = createResponse.body.data.id;

      // Verify book exists before deleting
      const beforeDelete = await request(app).get(`/books/${bookId}`);
      expect(beforeDelete.status).toBe(200);

      // Delete the book
      const response = await request(app).delete(`/books/${bookId}`);
      expect(response.status).toBe(200);

      // Verify book is gone
      const getResponse = await request(app).get(`/books/${bookId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.status).toBe(false);
    });
    test('DELETE /books/:id should return 404 for invalid id', async () => {
      const response = await request(app).delete('/books/invalid-id-123');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(false);
    });
  });
});
