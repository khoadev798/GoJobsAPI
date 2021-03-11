const sendMailService = require("../service/sendMail.service");

let sendMailRePasswordEmp = async (req, res, next) =>{
    let {empEmail} = req.query;
    console.log("empEmail: " + empEmail);
    const sendMailRePasswordEmpResult = await sendMailService.sendMailRePasswordEmp({
        empEmail,
    });
    res.status(sendMailRePasswordEmpResult.code).send({
        message: sendMailRePasswordEmpResult.message,
        empPassword: sendMailRePasswordEmpResult.empPassord
    });
};

let sendMailRePasswordFlc = async (req, res, next) =>{
    let {flcEmail} = req.query;
    const sendMailRePasswordFlcResult = await sendMailService.sendMailRePasswordFlc({
        flcEmail,
    });

    res.status(sendMailRePasswordFlcResult.code).send({
       message: sendMailRePasswordFlcResult.message,
       flcPassword: sendMailRePasswordFlcResult.flcPassord
    });
};

module.exports = {
    sendMailRePasswordEmp,
    sendMailRePasswordFlc,
}