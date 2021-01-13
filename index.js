const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user.route");
const questionRoute = require("./routes/question.route");
const companyRoute = require("./routes/company.route");
const companyTypeRoute = require("./routes/companyType.route");
const freelancerRoute = require("./routes/freelancer.route");
const flcFeedbackRoute = require("./routes/flcFeedback.route");
const GLOBAL = require("./global/global");

const PORT = GLOBAL.PORT;

const app = express();

app.use(bodyParser.json({ limit: "15360mb", type: "application/json" }));
app.use(
  bodyParser.urlencoded({
    limit: "15360mb",
    extended: true,
    type: "application/json",
    parameterLimit: 5000000,
  })
);

app.get("/", (req, res) => {
  res.send("OK!");
});

app.use("/user", userRoute);

app.use("/question", questionRoute);

app.use("/company", companyRoute);

app.use("/freelancer", freelancerRoute);

app.use("/flcFeedback", flcFeedbackRoute);

app.use("/companyType", companyTypeRoute);

app.listen(PORT, () => {
  console.log(`App is running ${PORT}`);
});
