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
        empId, pageNumber, pageSize
    } = req.body;

    let getNotificationMessageResult = await messageService.getNotificationMessageByEmp({
        empId, pageNumber, pageSize
    });
    res.status(getNotificationMessageResult.code).send(getNotificationMessageResult.listNotification);
};

let getNotificationMessageByFlc = async(req, res) =>{
    let {
        flcId, pageNumber, pageSize
    } = req.query;

    let getNotificationMessageResult = await messageService.getNotificationMessageByFlc({
        flcId, pageNumber, pageSize
    });
    res.status(getNotificationMessageResult.code).send(getNotificationMessageResult.listNotification);
};

let getMessageDetail = async (req, res) =>{
    let {_id, pageNumber, pageSize} = req.query;
    let getMessageDetailResult = await messageService.getMessageDetail({_id, pageNumber, pageSize});
    res.status(getMessageDetailResult.code).send(getMessageDetailResult.messageDetail);
}
module.exports = {
    newMessage,
    getNotificationMessageByEmp,
    getNotificationMessageByFlc,
    getMessageDetail
}