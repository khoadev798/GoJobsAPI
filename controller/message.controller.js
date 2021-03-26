const messageService = require("../service/message.service");

let newMessage = async (req, res) =>{
   
    let {
        empId,
        flcId,
        content
    } = req.body;
  
    let createMessageResult = await messageService.newMessage({
        empId,
        flcId,
        content,
    });
    res.status(createMessageResult.code).send(createMessageResult.message);
}

let getNotificationMessageByEmp = async(req, res) =>{
    let {
        empId,
    } = req.body;

    let getNotificationMessageResult = await messageService.getNotificationMessageByEmp({
        empId,
    });
    res.status(getNotificationMessageResult.code).send(getNotificationMessageResult.listNotification);
};

let getNotificationMessageByFlc = async(req, res) =>{
    let {
        flcId,
    } = req.query;

    let getNotificationMessageResult = await messageService.getNotificationMessageByFlc({
        flcId,
    });
    res.status(getNotificationMessageResult.code).send(getNotificationMessageResult.listNotification);
};

let getMessageDetail = async (req, res) =>{
    let {_id} = req.query;
    let getMessageDetailResult = await messageService.getMessageDetail({_id});
    res.status(getMessageDetailResult.code).send(getMessageDetailResult.messageDetail);
}
module.exports = {
    newMessage,
    getNotificationMessageByEmp,
    getNotificationMessageByFlc,
    getMessageDetail
}