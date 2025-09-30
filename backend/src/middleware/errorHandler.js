const logger = require('../utils/logger');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      code: 'RESOURCE_NOT_FOUND',
      message
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = {
      code: 'DUPLICATE_ENTRY',
      message
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      code: 'VALIDATION_ERROR',
      message
    };
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ');
    error = {
      code: 'VALIDATION_ERROR',
      message
    };
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate entry found';
    error = {
      code: 'DUPLICATE_ENTRY',
      message
    };
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = 'Referenced resource not found';
    error = {
      code: 'FOREIGN_KEY_CONSTRAINT',
      message
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = {
      code: 'INVALID_TOKEN',
      message
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = {
      code: 'TOKEN_EXPIRED',
      message
    };
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large';
    error = {
      code: 'FILE_TOO_LARGE',
      message
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field';
    error = {
      code: 'UNEXPECTED_FILE',
      message
    };
  }

  // OpenAI API errors
  if (err.name === 'OpenAIError') {
    const message = 'AI service temporarily unavailable';
    error = {
      code: 'AI_SERVICE_ERROR',
      message
    };
  }

  // Pinecone errors
  if (err.name === 'PineconeError') {
    const message = 'Vector database temporarily unavailable';
    error = {
      code: 'VECTOR_DB_ERROR',
      message
    };
  }

  // Database connection errors
  if (err.name === 'SequelizeConnectionError') {
    const message = 'Database connection failed';
    error = {
      code: 'DATABASE_ERROR',
      message
    };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_SERVER_ERROR';
  const message = error.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    },
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  });
};

module.exports = errorHandler;
