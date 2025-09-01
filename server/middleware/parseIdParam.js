const parseIdParam = (paramName) => (req, res, next) => {
  const id = Number(req.params[paramName]);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID parameter" });
  }
  req.params[paramName] = id;
  next();
};

module.exports = parseIdParam;
