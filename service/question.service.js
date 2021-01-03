const mongoose = require('mongoose');
const GLOBAL = require("../global/global")
const Question = require("../model/question");
const QuestionModel = mongoose.model("Question" ,  Question);

let handleError = (err) =>
{  
    console.log ("Got an error", err)
    return err
}
let createQuestion = async (question) => {
    const newQuestion = QuestionModel(question);
   
    await newQuestion.save((err) => {
        if(err) return handleError(err);
    })
  
        return { code: 200, message: "Message inserted!"}
    
    
}

let readAllQuestionOfUser = async (userId) => {
    let questions;
    await QuestionModel.find({userId: userId.toString()}, (err, docs) =>{
        if(err) {
        return handleError(err);
        }
        else{
            questions = [...docs]
        }
    })
    if(questions){
        return {code: 200, questions}
    }
    else{
        return {code: 404, questions: "Not found!"}
    }
}

let deleteQuestion =async (questionId) => {
    await QuestionModel.deleteOne({_id: questionId}, (err)=>{
        if(err) {
            return handleError(err);
            }
    })
    return {code: 200, message: "Question deleted!"}
}

let updateQuestion = async (question) =>{
    const filter = {_id: question.questionId}
        const update = {
            title : question.title,
            content : question.content
        }
        let doc = await QuestionModel.findOneAndUpdate(filter, update, {new: true})
        if(doc){
            return {code: GLOBAL.SUCCESS_CODE, message : `Question updated!`}
        }
}

module.exports = {
    createQuestion,
    readAllQuestionOfUser,
    deleteQuestion,
    updateQuestion
}