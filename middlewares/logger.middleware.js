function logger(req, res, next) {
  console.log("Método:", req.method);
  console.log("Ruta:", req.originalUrl);

  next();
}

module.exports = logger;
