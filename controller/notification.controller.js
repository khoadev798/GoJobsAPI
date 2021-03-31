const notificationService = require("../service/notification.service");

let getNotification = async(req, res) =>{
    let {flcId, empId, pageNumber, pageSize} = req.query;

    let getNotificationResult = await notificationService.getNotification({flcId, empId, pageNumber, pageSize});
    res.status(getNotificationResult.code).send(getNotificationResult.notifi);
}

let getNotificationForEmp =  async(req, res) =>{
    let {flcId, empId, pageNumber, pageSize} = req.query;

    let getNotificationForEmpResult = await notificationService.getNotificationForEmp({
        empId,
        flcId, pageNumber, pageSize
    });
    res.status(getNotificationForEmpResult.code).send(getNotificationForEmpResult.notifi);
}

module.exports = {
    getNotification,
    getNotificationForEmp
}