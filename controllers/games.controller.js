const { getGamesCollection } = require("../db/mongo");
const {
  validateScore,
  validatePrice,
  validateString,
} = require("../validators/games.validators");
async function getGames(req, res) {
  const games = await getGamesCollection();
  const {
    genre,
    platform,
    maxPrice,
    minScore,
    sort,
    order,
    page = "1",
    limit = "5",
  } = req.query; //const query = req.query.genre
  //console.log(req.query);
  //console.log("page: ", page);
  const filtro = {};
  const orden = {};
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  if (genre) {
    filtro.genre = genre;
  }

  if (platform) {
    filtro.platform = platform;
  }

  if (minScore) {
    filtro.score = { $gte: Number(minScore) };
  }

  if (maxPrice) {
    filtro.price = { $lte: Number(maxPrice) };
  }

  if (sort === "score") {
    orden.score = -1;
  }

  if (order === "asc") {
    orden.price = 1; //precio ascendente
  }

  if (order === "desc") {
    orden.price = -1; //precio descendente
  }

  const skip = (pageNumber - 1) * limitNumber;
  const totalGames = await games.countDocuments(filtro);
  const totalPages = Math.ceil(totalGames / limitNumber);
  const hasNextPage = pageNumber < totalPages;
  const resultado = await games
    .find(filtro)
    .sort(orden)
    .skip(skip)
    .limit(limitNumber)
    .toArray();

  res.json({
    page: pageNumber,
    limit: limitNumber,
    totalGames,
    totalPages,
    hasNextPage,
    games: resultado,
  });
}

async function getGamesByTitle(req, res) {
  const games = await getGamesCollection();
  const { title } = req.params;
  const resultado = await games.findOne({ title });
  if (!resultado) {
    return res.status(404).json({ message: "No se encontro el juego" });
  }
  res.json(resultado);
}

async function createGame(req, res) {
  const games = await getGamesCollection();
  const newGame = req.body;

  if (!newGame.title) {
    return res.status(400).json({
      message: "El titulo es obligatorio",
    });
  }

  const errorTitle = validateString(newGame.title, "title");
  if (errorTitle) {
    return res.status(400).json({
      message: errorTitle,
    });
  }

  if (!newGame.genre) {
    return res.status(400).json({
      message: "El genero es obligatorio",
    });
  }

  const errorGenre = validateString(newGame.genre, "genre");
  if (errorGenre) {
    return res.status(400).json({
      message: errorGenre,
    });
  }

  if (!newGame.platform) {
    return res.status(400).json({
      message: "La plataforma es obligatoria",
    });
  }

  const errorPlatform = validateString(newGame.platform, "platform");
  if (errorPlatform) {
    return res.status(400).json({
      message: errorPlatform,
    });
  }

  if (newGame.score === undefined) {
    return res.status(400).json({ message: "Score es obligatorio" });
  }

  const errorScore = validateScore(newGame.score);
  if (errorScore) {
    return res.status(400).json({ message: errorScore });
  }

  if (newGame.price === undefined) {
    return res.status(400).json({ message: "Price es obligatorio" });
  }

  const errorPrice = validatePrice(newGame.price);
  if (errorPrice) {
    return res.status(400).json({ message: errorPrice });
  }

  await games.insertOne(newGame);

  res.status(201).json({ message: "Juego creado" });
}

async function updateGame(req, res) {
  const games = await getGamesCollection();
  const { title } = req.params;
  const changes = req.body;

  //validar campos
  const allowedFields = ["genre", "score", "price", "platform"];
  const fields = Object.keys(changes); //array de llaves (campos)

  const badFields = fields.filter((field) => !allowedFields.includes(field));

  if (badFields.length > 0) {
    return res
      .status(400)
      .json({ message: "Se ingresaron campos invalidos", badFields });
  }

  if (changes.price !== undefined) {
    //validamos campo precio
    const error = validatePrice(changes.price);
    if (error) {
      return res.status(400).json({ message: error });
    }
  }

  if (changes.score !== undefined) {
    //validamos campo score
    //se envio score entre los cambios?
    const error = validateScore(changes.score); //si no hay error, devuelve null

    if (error) {
      return res.status(400).json({ message: error });
    }
  }

  if (changes.genre !== undefined) {
    //validamos campo genre
    const error = validateString(changes.genre, "genre");
    if (error) {
      return res.status(400).json({ message: error });
    }
  }

  if (changes.platform !== undefined) {
    //validamos campo platform
    const error = validateString(changes.platform, "platform");
    if (error) {
      return res.status(400).json({ message: error });
    }
  }

  const resultado = await games.updateOne(
    { title },
    //changes ya es un objeto de la forma {score:100}
    { $set: changes },
  );

  if (resultado.matchedCount === 0) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }
  res.json({ message: "Cambio realizado" });
}

async function deleteGame(req, res) {
  const games = await getGamesCollection();
  const { title } = req.params;

  const resultado = await games.deleteOne({ title });
  if (resultado.deletedCount === 0) {
    return res.status(404).json({ message: "No se encontro el juego" });
  }
  res.json({ message: "Juego eliminado correctamente" });
}

module.exports = {
  getGames,
  getGamesByTitle,
  createGame,
  updateGame,
  deleteGame,
};
