const express = require("express");
const {
  getGames,
  getGamesByTitle,
  createGame,
  updateGame,
  deleteGame,
} = require("../controllers/games.controller");
const router = express.Router();

router.get("/", getGames);
router.get("/:title", getGamesByTitle);
router.post("/", createGame);
router.patch("/:title", updateGame);
router.delete("/:title", deleteGame);

module.exports = router;
