const adminSchema = require("../models/adminSchema");
const CustomError = require("../utils/errors/CustomError");
const asyncErrorHandler = require("../utils/errors/asyncErrorHandler");
const decodeJwt = require("../utils/security/jwt/decodeJwt");
const auth = asyncErrorHandler(async (req, res, next) => {
  let token = req.headers.authentication;
  if (!token) {
    const err = new CustomError("noJwtFoundLogInAgain", 403);
    throw err;
  } else if (!token.startsWith("Bearer")) {
    const err = new CustomError("invalidToken", 403);
    throw err;
  } else {
    const jwtToken = token.split(" ")[1];
    let payload = await decodeJwt(jwtToken, process.env.ADMIN_JWT_SECRET);
    // console.log(payload);
    if (payload._id) {
      const admin = await adminSchema.findById(payload._id);
      // console.log(admin);
      if (!admin) {
        const err = new CustomError("notAuthorized", 403);
        throw err;
      } else {
        req.adminData = admin;
        // console.log(req.adminData);
        next();
      }
    }
  }
});
module.exports = auth;
