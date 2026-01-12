const AppError = (message, statusCode, status) => {
  console.log('Creating AppError:', { message, statusCode, status });
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = status;
  error.name = "AppError";
  return error;
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status;
  const message = err.message || "Internal Server Error";
  return res.json({
    status,
    statusCode,
    message,
  });
};

module.exports = { AppError, errorHandler };
