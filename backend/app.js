const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const mongoose = require(`mongoose`);
const app = express();
const port = process.env.PORT || 9000
const log4js = require("log4js");
const logger = log4js.getLogger();
log4js.configure({
  appenders: {
    console: { type: "console" },
    file: {
      type: "file",
      filename: "logs/app.log",
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
    },
  },
  categories: {
    default: { appenders: ["console", "file"], level: "info" },
  },
});

global.logger = logger;

const studentRoutes = require(`./api/routes/student`);
const adminRoutes = require(`./api/routes/admin`);
const moderatorRoutes = require(`./api/routes/moderator`);
const authRoutes = require(`./api/routes/auth`);
const userRoutes = require(`./api/routes/user`);
const isAuth = require(`./api/middlewares/is-auth`);

const MONGO_URL = `mongodb+srv://vansh1501:StudentLeave@cluster0.zzxw7zq.mongodb.net/sleave`;

(async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGO_URL);
    logger.info("Connected to DB");
  } catch (error) {
    logger.error("Error while connecting to DB: ", JSON.stringify(error));
  }
})();

mongoose.connection.on("connecting", () => {
  logger.info("MongoDB Connecting");
});

mongoose.connection.on("disconnected", () => {
  logger.error("MongoDB Lost Connection");
});

mongoose.connection.on("reconnect", () => {
  logger.info("MongoDB Reconnected");
});

mongoose.connection.on("connected", () => {
  logger.info("MongoDB Connected");
});

mongoose.connection.on("reconnectFailed", () => {
  logger.error("MongoDB Failed to Reconnect");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

cron.schedule(
  "0 0 1 6 *",
  async () => {
    try {
      const users = await User.find();

      for (const user of users) {
        user.leave = 10;
        await user.save();
      }

      console.log("Leave updated for all users successfully.");
    } catch (error) {
      console.error("Error updating leave for users:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/student", isAuth, studentRoutes);
app.use("/moderator", isAuth, moderatorRoutes);
app.use("/admin", isAuth, adminRoutes);

function errorHandler(err, req, res, next) {
  if (res.statusCode == 405) {
    res.json({ message: "Method Not allowed" });
  } else if (res.statusCode == 400) {
    let error = "Bad Request";
    if (err.code == "INVALID_TYPE")
      error += `: Invalid value for param ${err.paramName}`;
    res.json({ message: error });
  } else return next(err);
}

app.use(errorHandler);
app.listen(port);

module.exports = app;
