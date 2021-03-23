const messageService = require("../service/message.service");

let newMessage = async (req, res) =>{
    let {
        empId,
        flcId,
        content,
    } = req.body;

    const createMessageResult = await messageService.newMessage({
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
    } = req.body;

    let getNotificationMessageResult = await messageService.getNotificationMessageByFlc({
        flcId,
    });
    res.status(getNotificationMessageResult.code).send(getNotificationMessageResult.listNotification);
};

module.exports = {
    newMessage,
    getNotificationMessageByEmp,
    getNotificationMessageByFlc,
}