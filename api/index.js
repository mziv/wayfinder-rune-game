"use strict";

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const { MongoClient } = require("mongodb");
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost";

// let DATABASE_NAME = "runes";
let DATABASE_NAME = "heroku_2t8pl3kf";

let api = express.Router();
let conn;
let db;
let Votes, Status;

module.exports = async (app) => {
  app.set("json spaces", 2);
  app.use("/api", api);

  /* Connect to MongoDB */
  conn = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
  db = conn.db(DATABASE_NAME);
  Votes = db.collection("votes");
  Status = db.collection("status");
};

api.use(bodyParser.json());
api.use(cors());

api.get("/", (req, res) => {
  res.json({ message: "API running" });
});

/* Initializes and resets the db. */
api.post("/init", async (req, res) => {
  await Status.replaceOne({ id: "config" }, { id: "config", votingComplete: false });

  let runes = req.body.runes;
  let votes = await Votes.find().toArray();
  votes.forEach((r) => Votes.deleteOne({ id: r.id }));
  runes.forEach((r) => Votes.insertOne({ id: r, nVotes: 0 }));
  res.json({ "success": true });
});

/* Close voting */
api.post("/status/close", async (req, res) => {
  await Status.replaceOne({ id: "config" }, { id: "config", votingComplete: true });
  res.json({ "success": true });
});

/* Get whether or not voting is complete */
api.get("/status/done", async (req, res) => {
  let status = await Status.findOne({ id: "config" });
  let { votingComplete } = status;

  let response = { votingComplete };
  if (votingComplete) {
    response.winner = await getWinner();
  }
  res.json(response);
});

/* Close the voting */
api.post("/status/close", async (req, res) => {
  let status = await Status.findOne({ id: "config" });

  status.votingComplete = true;
  await Votes.replaceOne({ id: status.id }, status);
  res.json({ "success": true });
});

/* Open the voting */
api.post("/status/open", async (req, res) => {
  let status = await Status.findOne({ id: "config" });

  status.votingComplete = false;
  await Votes.replaceOne({ id: status.id }, status);
  res.json({ "success": true });
});

/* Get the list of rune objects */
api.get("/votes", async (req, res) => {
  let votes = await Votes.find().toArray();
  res.json({ votes });
});

/* Get the name of the rune that won. */
const getWinner = async () => {
  let votes = await Votes.find().toArray();
  let mostVotes = Math.max.apply(Math, votes.map((r) => r.nVotes));
  let {id, nVotes} = votes.find((r) => r.nVotes === mostVotes);
  return id;
}

/* Get the name of the rune that won. */
api.get("/votes/winner", async (req, res) => {
  let id = await getWinner();
  res.json({ id });
});

/* Get the number of votes for a specific rune */
api.get("/votes/:id", async (req, res) => {
  let id = req.params.id;
  let rune = await Votes.findOne({ id });
  if (!rune) {
    res.status(404).json({ error: "Rune doesn't exist" });
    return;
  }
  let { nVotes } = rune;
  res.json({ nVotes });
});

/* Add one vote to this rune. */
api.post("/votes/:id/add", async (req, res) => {
  let status = await Status.findOne({ id: "config" });
  let { votingComplete } = status;
  if (votingComplete) {
    res.status(400).json({ error: "Voting is closed" });
    return;
  }

  let id = req.params.id;
  let rune = await Votes.findOne({ id });
  if (!rune) {
    res.status(404).json({ error: "Rune doesn't exist" });
    return;
  }

  rune.nVotes += 1;
  await Votes.replaceOne({ id: rune.id }, rune);
  res.json({ "success": true });
});