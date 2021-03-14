const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
const jobController = require("../controller/job.controller");
const sendNotificationController = require("../controller/notifycationSendApp.controller");
route.post("/", dbConn.conn, jobController.createNewJob);

route.get("/allJobTypes", dbConn.conn, jobController.getAllJobTypes);

route.get("/allJobs", dbConn.conn, jobController.getAllJobs);

route.get("/allJobs", dbConn.conn, jobController.getAllJobsOfEmployerById);

route.get("/jobPagination", dbConn.conn, jobController.jobPagination);

route.get("/oneJobFullDetail", (req, res) => {});

route.put("/", (req, res) => {
  res.send("Update job");
});

route.delete("/", (req, res) => {
  res.send("Delete job");
});

route.post("/notification", sendNotificationController.sendNotification);

module.exports = route;
