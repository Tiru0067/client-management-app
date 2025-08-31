const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error details for debugging
  // Set default status code and message
  const status = err.statusCode || 500;
  const message = "Internal Server Error";

  res.status(status).json({
    status,
    message,
  });
};

module.exports = errorHandler;
