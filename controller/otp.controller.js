const otpService = require("../service/otp.service");

let getOTP = async (req, res, next) =>{
    let {_id, empPhone} = req.body;
    const getOTPResult = await otpService.getOTP({
        _id,
        empPhone
    });
    res.status(getOTPResult.code).send({
        message: getOTPResult.message,
        Phone: getOTPResult.Phone
    });
};

let verifyOTP = async (req, res, next) => {
    let {_id, empPhone, code } = req.body;
    const verifyOTPResult = await otpService.verifyOTP({
        _id,
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