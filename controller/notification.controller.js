const notificationService = require("../service/notification.service");

let getNotification = async(req, res) =>{
    let {flcId, empId} = req.query;

    let getNotificationResult = await notificationService.getNotification({flcId, empId});
    res.status(getNotificationResult.code).send(getNotificationResult.notifi);
}

module.exports = {
    getNotification
}