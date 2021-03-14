const jwt = require("jsonwebtoken");
const GLOBAL = require("../global/global");
const { ACCESS_TOKEN_SECRET } = require("../global/global");
const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);

let isAuth = async (req, res, next) => {
  const tokenFromClient =
    req.body.token || req.query || req.headers["x-accsess-token"];
  if (tokenFromClient) {
    try {
      const decoded = await jwtHelper.verifyToken(
        tokenFromClient,
        ACCESS_TOKEN_SECRET
      );

      // const payload = jwtDecode(decoded);
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

let isAuthOnWebAdminFromCookieToken = async (req, res, next) => {
  const token = req.cookies.token || "";
  // console.log(req.cookies.token);
  try {
    if (!token) {
      return res.status(401).json("You need to Login");
    }
    const decode = await jwt.verify(token, GLOBAL.ACCESS_TOKEN_SECRET);
    req.admin = {
      _id: decode._id,
      name: decode.name,
    };
    next();
  } catch (error) {
    return res.status(500).json(error.toString());
  }
};

module.exports = {
  isAuth,
  isAuthOnWebAdminFromCookieToken,
};
