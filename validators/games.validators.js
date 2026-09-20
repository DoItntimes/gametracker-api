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

module.exports = {
  validateScore,
  validatePrice,
  validateString,
};
