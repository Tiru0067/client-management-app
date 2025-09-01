const parseIdParam = (req, res, next) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID parameter" });
  }
  req.params.id = id;
  next();
};

module.exports = parseIdParam;
