class CustomError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode || 500;
    this.status = statusCode > 400 && statusCode < 500 ? "fail" : "error";
    this.isOperationalError = true;
    Error.captureStackTrace(this, this.costructor);
  }
}
module.exports = CustomError;
