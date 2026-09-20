require("dotenv").config();

const express = require("express");
const gamesRouter = require("./routes/games.routes");

const app = express();

app.use(express.json());

app.use("/games", gamesRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});
