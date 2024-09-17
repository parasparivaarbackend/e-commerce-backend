// errorMiddleware.js
export const errorMiddleware = (err, req, res, next) => {
  res
    .status(500)
    .json({ error: err.message || "An unexpected error occurred" });
};
