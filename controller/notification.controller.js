const notificationService = require("../service/notification.service");

let getNotification = async(req, res) =>{
    let {flcId} = req.query;

    let getNotificationResult = await notificationService.getNotification({flcId});
    res.status(getNotificationResult.code).send(getNotificationResult.notifi);
}

module.exports = {
    getNotification
}