const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
route.post("/", dbConn.conn, (req, res) => {
  res.send("Creating job type...");
});

route.get("/getAllJobTypes", dbConn.conn, (req, res) => {
  res.send("Getting all job types...");
});

route.delete("/:id", dbConn.conn, (req, res) => {
  res.send("Deleting...");
});

route.put("/:id", dbConn.conn, (req, res) => {
  res.send("Updating...");
});

module.exports = route;
