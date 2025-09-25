process.env.TZ = "Etc/UTC";
console.log("Running on UTC", new Date().toTimeString());
import * as dotenv from "dotenv";
if (!process.env.PORT) dotenv.config();
import express from "express";
import morgan from "morgan";

import calculateBackendStat from "./calculateBackendStat.js";
import renderBackendStat from "./renderBackendStat.js";
import http from "http";
import logOnResponse from "./logOnResponse.js";

import router from "./src/router.js";
import errorHandler from "./src/middleware/errorHandler.js";

global.appVersion = 3;

const app = express();

app.use(logOnResponse);
app.disable("x-powered-by");

let httpInstance = http.Server(app);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", true);

  if ("OPTIONS" == req.method) {
    return res.sendStatus(200);
  } else {
    next();
  }
});

app.use(calculateBackendStat);

app.use(morgan("tiny"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use(router);

app.get("/backend-stat", renderBackendStat);

app.use((req, res, next) => {
  next("404, Route not found");
});

app.use(errorHandler);

let port = 8080;

if (process.env.PORT_MANUAL) {
  port = process.env.PORT_MANUAL;
}

if (process.env.PORT) {
  port = process.env.PORT;
}

httpInstance.listen(port, (err) => {
  console.log("Server started on port: http://localhost:" + port);
});

process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.error("Asynchronous error caught.", err);
});

process.on("unhandledRejection", (err) => {
  console.log(err.message);
  console.error("Asynchronous error caught.", err);
});

export default app;
