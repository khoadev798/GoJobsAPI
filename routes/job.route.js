const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
const jobController = require("../controller/job.controller");
const sendNotificationController = require("../controller/notifycationSendApp.controller");
route.post("/createNewJob", dbConn.conn, jobController.createNewJob);

route.get("/allJobs", dbConn.conn, jobController.getAllJobs);

route.get("/allJobsByEmpId", dbConn.conn, jobController.getAllJobsOfEmployerById);

route.get("/jobPagination", dbConn.conn, jobController.jobPagination);

route.get("/oneJobFullDetail", (req, res) => {});

route.get(
  "/jobPaginationWithTime",
  dbConn.conn,
  jobController.jobPaginationWithTime
);

route.put("/", (req, res) => {
  res.send("Update job");
});

route.delete("/", (req, res) => {
  res.send("Delete job");
});

route.post("/notification", sendNotificationController.sendNotification);

route.get(
  "/jobDetail",
  dbConn.conn,
  jobController.getJobDetail
)

module.exports = route;
