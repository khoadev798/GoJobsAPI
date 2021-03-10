const otpService = require("../service/otp.service");

let getOTP = async (req, res, next) =>{
    let { empEmail, empPhone } = req.query;
    const getOTPResult = await otpService.getOTP({
        empEmail,
        empPhone,
    });
    if(getOTPResult.code == 200){
        res.status(getOTPResult.code).send({
            message: getOTPResult.message,
        });
    }
};

let verifyOTP = async (req, res, next) => {
    let {empEmail, empPhone, code } = req.query;
    const verifyOTPResult = await otpService.verifyOTP({
        empEmail,
        empPhone,
        code
    });
    res.status(verifyOTPResult.code).send({
        message: verifyOTPResult.message
    });
};

module.exports = {
    getOTP,
    verifyOTP
}