const errorHandler = (err, req, res, next) => {
  console.error("Global error:", err.stack);

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
