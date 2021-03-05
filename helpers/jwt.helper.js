const jwt = require("jsonwebtoken");

let generateToken = (employer, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    const userData = {
      _id: employer._id,
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
let verifyToken = (token, secretKey) =>{
    return new Promise((resolve, reject) =>{
        jwt.verify(token, secretKey, (error, decoded) =>{
            if (error) {
                return reject(error);
            }
            resolve(decoded);
        });
let verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      reject(decoded);
    });
  });
};
    });
  }

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
};
