// const jwtHelper = require("../helpers/jwt.helper");
const jwtHelpers = require("../helpers/jwt.helpers");
const debug = console.log.bind(console);

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

let isAuth = async (req, res, next) => {
  const tokenFromClient =
    req.body.token || req.query || req.headers["x-accsess-token"];

  if (tokenFromClient) {
    try {
      const decoded = await jwtHelpers.verifyToken(
        tokenFromClient,
        accessTokenSecret
      );

      req.jwtDecode = decoded;
      next();
    } catch (error) {
      debug("Error while verify token:", error);
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }
  } else {
    return res.status(403).send({
      message: "No token provided.",
    });
  }
};

module.exports = {
  isAuth: isAuth,
};
