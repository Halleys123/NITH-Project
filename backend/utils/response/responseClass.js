class Response {
  constructor(
    success = false,
    errMessage = null,
    responseMessage = null,
    status = "error",
    statusCode = 500,
    stack = null
  ) {
    this.success = success;
    this.errMessage = errMessage;
    this.responseMessage = responseMessage;
    this.status = status;
    this.statusCode = statusCode;
    this.stack = stack;
  }
}
module.exports = Response;
