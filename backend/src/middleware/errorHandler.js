function errorHandler(err, req, res, _next) {
  console.error('[API Error Handler]', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal.',
  });
}

module.exports = errorHandler;
