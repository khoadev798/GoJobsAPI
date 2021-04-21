const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
const jobController = require("../controller/job.controller");
const authMiddleware = require("../middleware/authMiddleware");

route.get("/allJobs",authMiddleware.isAuth, dbConn.conn, jobController.getAllJobs);

route.post("/createNewJob",authMiddleware.isAuth, dbConn.conn, jobController.createNewJob);

route.get(
  "/allJobsByEmpId",
  authMiddleware.isAuth,
  dbConn.conn,
  jobController.getAllJobsOfEmployerById
);

route.get("/jobPagination",authMiddleware.isAuth, dbConn.conn, jobController.jobPagination);

route.get("/oneJobFullDetail", (req, res) => {});

route.get(
  "/jobPaginationWithTime",
  authMiddleware.isAuth,
  dbConn.conn,
  jobController.jobPaginationWithTime
);

route.put("/", (req, res) => {
  res.send("Update job");
});

route.get(
  "/jobPaginationWithAddress",
  authMiddleware.isAuth,
  dbConn.conn,
  jobController.jobPaginationWithAddress
);

route.get("/jobDetail",authMiddleware.isAuth, dbConn.conn, jobController.getJobDetail);

route.get("/fieldForSearch", authMiddleware.isAuth, dbConn.conn, jobController.filForSearch);

route.delete("/deleteJob", authMiddleware.isAuth,dbConn.conn, jobController.deleteJobNotContract);

route.get("/checkContract", authMiddleware.isAuth, dbConn.conn, jobController.checkContract)

module.exports = route;
