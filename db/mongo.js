const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function getGamesCollection() {
  await client.connect();

  const db = client.db("gametracker");

  return db.collection("games");
}

module.exports = {
  getGamesCollection,
};
