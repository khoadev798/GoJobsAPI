const otpService = require("../service/otp.service");

let getOTP = async (req, res, next) => {
  let { phone } = req.query;
  const getOTPResult = await otpService.getOTP({
    phone,
  });
  res.status(getOTPResult.code).send({
    message: getOTPResult.message,
  });
};

let verifyOTP = async (req, res) => {
  let { phone, code } = req.query;
  const verifyOTPFlcResult = await otpService.verifyOTP({
    phone,
    code,
  });

  res.status(verifyOTPFlcResult.code).send(verifyOTPFlcResult.message);
};

module.exports = {
  getOTP,
  verifyOTP,
};
