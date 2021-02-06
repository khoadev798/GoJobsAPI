const mongoose = require("mongoose");
const GLOBAL = require("../global/global");

let conn = async (req, res, next) => {
  try {
    await mongoose.connect(
      GLOBAL.MONGO_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      () => {
        console.log("Mongoose is connected at " + Date());
        next();
      }
    );
  } catch (error) {
    console.log(error);
    res.status(GLOBAL.SERVER_ERROR_CODE).send("Cannot link to DB.");
  }
};

module.exports = {
  conn,
};
