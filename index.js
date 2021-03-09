const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const userRoute = require("./routes/user.route");
const questionRoute = require("./routes/question.route");
const freelancerRoute = require("./routes/freelancer.route");
const flcFeedbackRoute = require("./routes/flcFeedback.route");
const empTypeRoute = require("./routes/empType.route");
const jobTypeRoute = require("./routes/jobType.route");
const employerRoute = require("./routes/employer.route");
const contractRoute = require("./routes/contract.route");
const walletRoute = require("./routes/wallet.route");
const sendMailRoute = require("./routes/sendMail.route");
const locationRoute = require("./routes/location.route");
const empFeedbackRoute = require("./routes/empFeedback.route");
const swaggerDocument = YAML.load("docs/swagger.yaml");

const jobRoute = require("./routes/job.route");

const otpRoute = require("./routes/otp.route");

const GLOBAL = require("./global/global");

const PORT = GLOBAL.PORT || 80;

const app = express();

const http = require("http").Server(app);

const io = require("socket.io")(http);

app.use(bodyParser.json({ limit: "15360mb", type: "application/json" }));
app.use(
  bodyParser.urlencoded({
    limit: "15360mb",
    extended: true,
    type: "application/json",
    parameterLimit: 5000000,
  })
);

io.on("connection", function (socket) {
  console.log("User Conncetion");

  socket.on("connect user", function (user) {
    console.log("Connected user ");
    io.emit("connect user", user);
  });

  socket.on("on typing", function (typing) {
    console.log("Typing.... ");
    io.emit("on typing", typing);
  });

  socket.on("chat message", function (msg) {
    console.log("Message " + msg["message"]);
    io.emit("chat message", msg);
  });
});

app.get("/", (req, res) => {
  res.send("OK!");
});

app.use(
  "/api-docs",
  function (req, res, next) {
    swaggerDocument.host = req.get("host");
    req.swaggerDoc = swaggerDocument;
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup()
);

app.use("/otp", otpRoute);

app.use("/sendMail", sendMailRoute);

app.use("/user", userRoute);

app.use("/question", questionRoute);

app.use("/freelancer", freelancerRoute);

app.use("/flcFeedback", flcFeedbackRoute);

app.use("/empType", empTypeRoute);

app.use("/employer", employerRoute);

app.use("/job", jobRoute);

app.use("/jobType", jobTypeRoute);

app.use("/contract", contractRoute);

app.use("/wallet", walletRoute);

app.use("/location", locationRoute);
app.use("/empFeedback", empFeedbackRoute);

http.listen(process.env.PORT || PORT, () => {
  console.log(`App is running ${PORT}`);
});
