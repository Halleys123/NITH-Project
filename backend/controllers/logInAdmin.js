const adminSchema = require("../models/adminSchema");
const CustomError = require("../utils/errors/CustomError");
const asyncErrorHandler = require("../utils/errors/asyncErrorHandler");
const Response = require("../utils/response/responseClass");
const createJwt = require("../utils/security/jwt/createJwt");
const checkPasswords = require("../utils/security/passwords/checkPasswords");
const logIn = asyncErrorHandler(async (req, res, next) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    throw new CustomError("pleaseEnterAllTheCredentials", 400);
  }
  const user = await adminSchema.findOne({ username: username });
  if (!user) {
    throw new CustomError("usernameOrPasswordDidNotMatch", 403);
  }
  const jwt = await createJwt(
    { _id: user._id, role: user.role },
    process.env.ADMIN_JWT_SECRET
  );
  let passwordCheck = await checkPasswords(password, user.password);
  if (passwordCheck) {
    const response = new Response(true, null, { user, jwt }, "success", 200);
    return res.json(response);
  } else {
    throw new CustomError("usernameOrPasswordDidNotMatch", 403);
  }
});
module.exports = logIn;
