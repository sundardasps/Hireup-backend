export const errorHandler = (err, req, res, next) => {
  res.status(404).json({ message: "404 error" });
};
