const { validateNewGame } = require("../validators/games.validators");

function validateCreateGame(req, res, next) {
  const newGame = req.body;
  const error = validateNewGame(newGame);

  if (error) {
    return res.status(400).json({
      message: error,
    });
  }

  next();
}

module.exports = {
  validateCreateGame,
};
