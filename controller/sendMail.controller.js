const sendMailService = require("../service/sendMail.service");

let sendMailRePasswordEmp = async (req, res, next) =>{
    let {empEmail} = req.body;
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
    let {flcEmail} = req.body;
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