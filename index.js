require("dotenv").config();

const express = require("express");
const gamesRouter = require("./routes/games.routes");
const logger = require("./middlewares/logger.middleware");
const app = express();

app.use(express.json());
app.use(logger);

app.use("/games", gamesRouter);

const PORT = 3000;

app.get("/test", (req, res) => {
  res.json({
    message: "Express funciona correctamente",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});
