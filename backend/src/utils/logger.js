const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'plant-health-ai' },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Add custom methods for different log levels
logger.request = (req, res, responseTime) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
};

logger.error = (message, error = null) => {
  if (error instanceof Error) {
    logger.log('error', message, {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
  } else {
    logger.log('error', message, error);
  }
};

logger.api = (endpoint, method, statusCode, responseTime, userId = null) => {
  logger.info('API Call', {
    endpoint,
    method,
    statusCode,
    responseTime: `${responseTime}ms`,
    userId
  });
};

logger.database = (operation, table, duration, error = null) => {
  if (error) {
    logger.error('Database Error', {
      operation,
      table,
      duration: `${duration}ms`,
      error: error.message
    });
  } else {
    logger.info('Database Operation', {
      operation,
      table,
      duration: `${duration}ms`
    });
  }
};

logger.ai = (operation, model, duration, tokens = null, error = null) => {
  if (error) {
    logger.error('AI Service Error', {
      operation,
      model,
      duration: `${duration}ms`,
      tokens,
      error: error.message
    });
  } else {
    logger.info('AI Service Call', {
      operation,
      model,
      duration: `${duration}ms`,
      tokens
    });
  }
};

logger.vector = (operation, index, duration, results = null, error = null) => {
  if (error) {
    logger.error('Vector DB Error', {
      operation,
      index,
      duration: `${duration}ms`,
      error: error.message
    });
  } else {
    logger.info('Vector DB Operation', {
      operation,
      index,
      duration: `${duration}ms`,
      resultsCount: results?.length || 0
    });
  }
};

module.exports = logger;
