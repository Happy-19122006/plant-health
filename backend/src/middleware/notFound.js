/**
 * 404 Not Found middleware
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.originalUrl} not found`,
      available_routes: [
        'GET /health',
        'GET /api/v1/crops',
        'GET /api/v1/diseases',
        'GET /api/v1/treatments',
        'POST /api/v1/farmer/query',
        'POST /api/v1/ai/ask',
        'GET /api/v1/analytics/overview'
      ]
    }
  });
};

module.exports = notFound;
