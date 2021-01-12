const express = require("express");
const route = express.Router();

route.post("/", (req, res) => {
  res.send("Creating job type...");
});

route.get("/getAllJobTypes", (req, res) => {
  res.send("Getting all job types...");
});

route.delete("/:id", (req, res) => {
  res.send("Deleting...");
});

route.put("/:id", (req, res) => {
  res.send("Updating...");
});

module.exports = route;
