# Book Management REST API

A RESTful Book Management API built with Node.js, Express, JavaScript, and MySQL Sequelize ORM.

## Quick Start

### Prerequisites

- Node.js v14+
- MySQL Server v5.7+

### Setup

```bash
# 1. Clone and install
git clone https://github.com/your-username/book-management-api.git
cd book-management-api
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your MySQL credentials

# 3. Create database
mysql -u root -p
# Then run: CREATE DATABASE book_management_db;

# 4. Start server
npm start
# Server runs at http://localhost:3000
```

## API Endpoints

| Method | Endpoint        | Description               |
| ------ | --------------- | ------------------------- |
| GET    | `/books`        | Get all books             |
| GET    | `/books/:id`    | Get book by ID            |
| POST   | `/books`        | Create new book           |
| PUT    | `/books/:id`    | Update book               |
| DELETE | `/books/:id`    | Delete book (soft delete) |
| POST   | `/books/import` | Import books from CSV     |

## Examples

### Create Book

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publishedYear": 1925
  }'
```

### Get All Books

```bash
curl http://localhost:3000/books
```

### Import CSV

```bash
curl -X POST http://localhost:3000/books/import \
  -F "file=@sample_books.csv"
```

**CSV Format:**

```
title,author,publishedYear
To Kill a Mockingbird,Harper Lee,1960
1984,George Orwell,1949
The Lord of the Rings,J.R.R. Tolkien,1954
```

## Features

- ✅ Full CRUD operations
- ✅ CSV bulk import (manual validation, no third-party CSV libs)
- ✅ Soft delete (paranoid mode)
- ✅ MySQL + Sequelize ORM
- ✅ Error handling middleware
- ✅ HTTP logging (Morgan)
- ✅ Unit tests (Jest)
- ✅ MVC architecture
- ✅ Environment variables (.env)

## Environment Variables

```
PORT=3000
DB_HOST=YOUR_DB_HOST
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=YOUR_DB_NAME
NODE_ENV=development
```

## Data Validation

**Book fields:**

- `title`: Required, max 255 chars
- `author`: Required, max 255 chars
- `publishedYear`: Integer (1000 to current year)

**CSV Import:** Returns count of imported books and list of validation errors.

## Testing

```bash
npm test              # Run tests
npm run test:watch    # Watch mode
```

## Project Structure

```
src/
├── controllers/      # Request handlers
├── services/        # Business logic
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Error & CSV handling
└── server.js        # Express app

config/
└── database.js      # Database config

tests/
└── book.test.js     # Unit tests
```

## NPM Scripts

```bash
npm start            # Production
npm run dev          # Development (nodemon)
npm test             # Tests
npm run test:watch   # Watch mode
```

## Response Format

### Success

```json
{
  "status": true,
  "message": "Book record created successfully",
  "data": {
    /* book object */
  },
  "statusCode": 201
}
```

### Error

```json
{
  "status": false,
  "statusCode": 404,
  "message": "Error description"
}
```

## Error Codes

- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

## Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Testing**: Jest + Supertest
- **Logging**: Morgan
- **File Upload**: Multer

## Troubleshooting

**MySQL Connection Error**

- Check MySQL is running
- Verify credentials in `.env`

**Port in Use**

- Change PORT in `.env`

**Module Not Found**

```bash
rm -rf node_modules
npm install
```

**CSV Import Fails**

- Check CSV columns: title, author, publishedYear
- publishedYear must be integer
- No empty rows

## Postman Collection

Import `Book_Management_API.postman_collection.json` in Postman for ready-to-use endpoints.

## Sample Data

Use `sample_books.csv` to test CSV import.

## GitHub

[https://github.com/your-username/book-management-api](https://github.com/your-username/book-management-api)

## License

ISC
