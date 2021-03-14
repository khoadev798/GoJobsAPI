const jwt = require("jsonwebtoken");
const GLOBAL = require("../global/global");

let generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    const userData = {
      _id: user._id,
    };

    jwt.sign(
      { data: userData },
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
      }
    );
  });
};

let verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
};

let generateAdminWebToken = async (res, _id, name) => {
  const token = await jwt.sign({ _id, name }, GLOBAL.ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: GLOBAL.ACCESS_TOKEN_LIFE,
  });
  return res.cookie("token", token, {
    expires: new Date(Date.now() + 3600000), // miliseconds
    secure: false, // set to true if your using https
    httpOnly: true,
  });
};

module.exports = {
  generateToken,
  verifyToken,
  generateAdminWebToken,
};
