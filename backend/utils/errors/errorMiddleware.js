const Response = require("../response/responseClass");

const errorHandlerMiddleWare = (err, req, res, next) => {
  const response = new Response(
    false,
    err.message,
    null,
    err.status || "fail",
    err.statusCode,
    err.stack
  );
  // console.log(response);
  return res
    .status(response.statusCode ? response.statusCode : 500)
    .json(response);
};
module.exports = errorHandlerMiddleWare;
