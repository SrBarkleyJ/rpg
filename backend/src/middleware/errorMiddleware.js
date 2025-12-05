/**
 * Enhanced Error Handler Middleware
 * 
 * Features:
 * - Proper error classification
 * - Detailed logging in development
 * - Clean responses in production
 * - Mongoose error handling
 * - JWT error handling
 */

const errorHandler = (err, req, res, next) => {
  // Default error values
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // Handle specific error types

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`[ERROR] ${statusCode} - ${message}`);
    console.error(`[PATH] ${req.method} ${req.originalUrl}`);
    if (err.stack) {
      console.error('[STACK]', err.stack.split('\n').slice(0, 5).join('\n'));
    }
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  // Send response
  const response = {
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack,
      originalError: err.message
    })
  };

  res.status(statusCode).json(response);
};

// 404 Handler
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

module.exports = { errorHandler, notFoundHandler };
