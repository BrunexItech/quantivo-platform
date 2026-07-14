exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const error = {
    success: false,
    message: err.message || 'Server Error'
  };

  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
  }

  if (err.name === 'CastError') {
    error.message = 'Resource not found';
  }

  res.status(err.statusCode || 500).json(error);
};
