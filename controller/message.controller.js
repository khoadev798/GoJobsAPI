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

module.exports = {
    newMessage,
}