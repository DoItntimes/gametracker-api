function validateScore(score) {
  if (typeof score !== "number") {
    return "Score debe ser un numero";
  }
  if (score < 0 || score > 100) {
    return "Score debe estar entre 0 y 100";
  }
  return null;
}

function validatePrice(price) {
  if (typeof price !== "number") {
    return "Price debe ser un numero";
  }
  if (price < 0) {
    return "Price no puede ser negativo";
  }
  return null;
}

function validateString(value, fieldName) {
  if (typeof value !== "string") {
    return `${fieldName} debe ser texto`;
  }
  if (value.trim() === "") {
    return `${fieldName} no puede estar vacio`;
  }
  return null;
}

function validateNewGame(newGame) {
  if (!newGame.title) {
    return "El titulo es obligatorio";
  }

  const errorTitle = validateString(newGame.title, "title");

  if (errorTitle) {
    return errorTitle;
  }

  if (!newGame.genre) {
    return "El genero es obligatorio";
  }

  const errorGenre = validateString(newGame.genre, "genre");

  if (errorGenre) {
    return errorGenre;
  }

  if (!newGame.platform) {
    return "La plataforma es obligatoria";
  }

  const errorPlatform = validateString(newGame.platform, "platform");

  if (errorPlatform) {
    return errorPlatform;
  }

  if (newGame.score === undefined) {
    return "Score es obligatorio";
  }

  const errorScore = validateScore(newGame.score);

  if (errorScore) {
    return errorScore;
  }

  if (newGame.price === undefined) {
    return "Price es obligatorio";
  }

  const errorPrice = validatePrice(newGame.price);

  if (errorPrice) {
    return errorPrice;
  }

  return null;
}

module.exports = {
  validateScore,
  validatePrice,
  validateString,
  validateNewGame
};
