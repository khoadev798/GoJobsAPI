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

let getOTPFlc = async (req, res) =>{
    let { flcEmail, flcPhone} = req.query;
    const getOTPFlcResult = await otpService.getOTPFlc({
        flcEmail,
        flcPhone
    });
    if (getOTPFlcResult.code == 200){
        res.status(getOTPFlcResult.code).send({message: getOTPFlcResult.message});
    }
}

let verifyOTPFlc = async (req, res) =>{
    let {flcEmail, flcPhone, code} = req.query;
    const verifyOTPFlcResult = await otpService.verifyOTPFlc({
        flcEmail,
        flcPhone,
        code
    });
    if (verifyOTPFlcResult.code == 200){
        res.status(verifyOTPFlcResult.code).send(verifyOTPFlcResult.message);
    }
}

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
    verifyOTP,
    getOTPFlc,
    verifyOTPFlc
}