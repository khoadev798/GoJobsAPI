const express = require("express");
const route = express.Router();
const dbConn = require('../middleware/dbConn.middle')
const questionController = require('../controller/question.controller')
route.post("/createQuestion/:userId/:title/:content",dbConn.conn, questionController.createQuestion)

route.get("/getQuestionsOfUser/:userId", dbConn.conn, questionController.getQuestionsOfUser)

route.post("/getOneQuestion/:questionId",dbConn.conn, questionController.getOneQuestion)

route.delete("/deleteQuestion/:questionId",dbConn.conn, questionController.deleteOneQuestion)

route.put("/updateQuestion/:questionId/:title/:content", dbConn.conn, questionController.updateOneQuestion)

module.exports = route


