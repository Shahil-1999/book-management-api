const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const sequelize = require('../config/database');
const bookRoutes = require('./routes/bookRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Routes
app.use('/books', bookRoutes);

// Health check
app.get('/', (req, res) => {
  return res.json({
    status: true,
    statusCode: 200,
    message: 'Book Management API is running',
  });
});

// 404 handler
app.use((req, res) => {
  return res.json({
    status: false,
    statusCode: 404,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await sequelize.sync({ alter: true });
    console.log('Database synced (alter applied).');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
