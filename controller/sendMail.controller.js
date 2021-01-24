const sendMailService = require("../service/sendMail.service");

let sendMailRePasswordEmp = async (req, res, next) =>{
    let empEmail = req.body;
    const sendMailRePasswordEmpResult = await sendMailService.sendMailRePasswordEmp({
        empEmail,
    });
    res.status(sendMailRePasswordEmpResult.code).send(sendMailRePasswordEmpResult.message);
};

let sendMailRePasswordFlc = async (req, res, next) =>{
    let flcEmail = req.body;
    const sendMailRePasswordFlcResult = await sendMailService.sendMailRePasswordFlc({
        flcEmail,
    });

    res.status(sendMailRePasswordFlcResult.code).send(sendMailRePasswordFlcResult.message);
};

module.exports = {
    sendMailRePasswordEmp,
    sendMailRePasswordFlc,
}