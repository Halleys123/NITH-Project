const express = require("express");
const CustomError = require("./utils/errors/CustomError");
const errorHandlerMiddleware = require("./utils/errors/errorMiddleware");
const cors = require("cors");
const router = require("./routers/routes");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", router);
app.all("*", (req, res, next) => {
  const err = new CustomError("Page not found", 404);
  next(err);
});
app.use(errorHandlerMiddleware);
module.exports = app;
