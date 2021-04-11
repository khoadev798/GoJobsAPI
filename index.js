const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const adminRoute = require("./routes/admin.route");
const freelancerRoute = require("./routes/freelancer.route");
const feedbackRoute = require("./routes/feedback.route");
const employerRoute = require("./routes/employer.route");
const contractRoute = require("./routes/contract.route");
const walletRoute = require("./routes/wallet.route");
const sendMailRoute = require("./routes/sendMail.route");
const locationRoute = require("./routes/location.route");
const swaggerDocument = YAML.load("docs/swagger.yaml");
const jobRoute = require("./routes/job.route");
const otpRoute = require("./routes/otp.route");
const followRoute = require("./routes/follow.route");
const notificationRoute = require("./routes/notification.route");
const messageRoute = require("./routes/messagge.route");
const webAdminRoute = require("./routes/webAdmin.route");
const receiptRoute = require("./routes/receipt.route");
const fs = require("fs");
const GLOBAL = require("./global/global");

const PORT = GLOBAL.PORT || 80;

const app = express();

const http = require("http").Server(app);

const io = require("socket.io")(http);

const multer = require("multer");

// app.use(bodyParser.urlencoded({ limit: "15360mb", type: "application/json", extended: true }));

app.use(
  express.urlencoded({
    limit: "15360mb",
    extended: true,
    // type: "application/json",
    parameterLimit: 5000000,
  })
);

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.use(multerMid.single("file"));
app.disable("x-powered-by");
/** Cookies setup here */
app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  if ("OPTIONS" === req.method) {
    res.status(204).send();
  } else {
    next();
  }
});

app.use(cookieParser());

var room;

io.on("connection", function (socket) {
  let roomName;
  socket.on("join", function (room) {
    roomName = room["room"];
    console.log(roomName);
    socket.join(roomName);
  });

  socket.in(roomName).on("connect user", function (user) {
    io.to(roomName).emit("connect user", user);
  });

  socket.in(roomName).on("chat message", function (msg) {
    console.log("Message " + msg["message"]);
    io.to(roomName).emit("chat message", msg);
  });
  // }
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

app.use("/admin", adminRoute);

app.use("/freelancer", freelancerRoute);

app.use("/feedback", feedbackRoute);

app.use("/employer", employerRoute);

app.use("/job", jobRoute);

app.use("/contract", contractRoute);

app.use("/wallet", walletRoute);

app.use("/location", locationRoute);

app.use("/follow", followRoute);

app.use("/notification", notificationRoute);

app.use("/message", messageRoute);

app.use("/receipt", receiptRoute);

http.listen(process.env.PORT || PORT, () => {
  console.log(`App is running ${PORT}`);
});

const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const { emit } = require("./model/employer");
const { use } = require("./routes/admin.route");

/**BEGIN OF ADMIN WEBSITE */
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "hbs");

app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    layoutsDir: __dirname + "/views/layouts/",
    defaultLayout: "layout",
    helpers: require("./util/hbsHelper"),
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

app.use("/web", webAdminRoute);

/**END OF ANDMING WEBSITE */
