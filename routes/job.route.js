const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");

route.post("/", (req, res) => {
  res.send("New job");
});

route.get("/allJobs", (req, res) => {
  res.send("All jobs");
});

route.get("/empJobList", (req, res) => {
  res.send("Jobs of 1 employer");
});

route.get("/oneJobFullDetail", (req, res) => {});

route.put("/", (req, res) => {
  res.send("Update job");
});

route.delete("/", (req, res) => {
  res.send("Delete job");
});

module.exports = route;
