require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(process.env.DB_URL, {
  useUnifiedTopology: true,
});
client
  .connect()
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => console.error(err));

app.get("/:symbol", async (req, res) => {
  const { symbol } = req.params;
  let query = {};
  if (symbol !== "all") {
    query = { symbol };
  }
  const db = client.db("fake_stock_data");
  const data = await db.collection("stockdata").find(query).toArray();
  res.json(data);
});

app.listen(4000, () => console.log("server running"));
