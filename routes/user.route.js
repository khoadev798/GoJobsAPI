const express = require("express");
const route = express.Router();
const userController = require("../controller/user.controller")
const dbConn = require('../middleware/dbConn.middle')
const infoValidator = require("../middleware/infoValidation.middle")

route.post("/register", infoValidator.emailValidate, dbConn.conn,userController.register)

route.post("/login", dbConn.conn, userController.login)

route.put("/updatePassword",dbConn.conn, userController.updatePassword)
// 
route.get("/getAllQuestions/:id", userController.getAllQuestions)

module.exports = route