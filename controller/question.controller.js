const questionService = require("../service/question.service")
const mongoose = require('mongoose');
let createQuestion = async (req, res) => {
    let {userId, title, content} = req.params;
    // let {title, content}  = req.body;
    userId = userId.replace(/\"/g,"");
    title = title.replace(/\"/g,"");
    content = content.replace(/\"/g,"");
    const question = {
        userId,
        title,
        content
    }
    console.log(question);
    let createQuestionResult = await questionService.createQuestion(question);
    console.log(createQuestionResult);
    res.status(createQuestionResult.code).send(createQuestionResult.message)
}

let getQuestionsOfUser =async (req, res) => {
    let {userId} = req.params;
    // console.log("Received from client:", userId);
    userId = userId.replace(/\"/g,"");
    userId = mongoose.Types.ObjectId(userId)
    console.log("Received from client:", userId);
    let getAllResult = await questionService.readAllQuestionOfUser(userId)
    console.log(getAllResult);
    res.status(getAllResult.code).send(
         getAllResult.questions
    )
}

let getOneQuestion = (req, res) => {
    const{questionId} = req.params;
    res.send("Reading one...")
}

let deleteOneQuestion = async (req, res) => {
    let {questionId} = req.params;
    questionId = questionId.replace(/\"/g,"");
    questionId = mongoose.Types.ObjectId(questionId)
    let deleteResult = await questionService.deleteQuestion(questionId)
    res.status(deleteResult.code).send(deleteResult.message)
}

let updateOneQuestion = async (req, res) => {
    let {questionId, title, content} = req.params;
    questionId = questionId.replace(/\"/g,"");
    questionId = mongoose.Types.ObjectId(questionId)
    // let {}  = req.body;
    const question = {
        questionId,
        title,
        content
    }
    let updateResult = await questionService.updateQuestion(question);
    res.status(updateResult.code).send(updateResult.message)
}

module.exports = {
    createQuestion,
    getQuestionsOfUser,
    getOneQuestion,
    deleteOneQuestion,
    updateOneQuestion
}