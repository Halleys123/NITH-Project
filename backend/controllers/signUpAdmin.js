const adminSchema = require("../models/adminSchema");
const CustomError = require("../utils/errors/CustomError");
const asyncErrorHandler = require("../utils/errors/asyncErrorHandler");
const Response = require("../utils/response/responseClass");
const createJwt = require("../utils/security/jwt/createJwt");
const {
  isValidEmail,
  isValidPassword,
} = require("../utils/validators/validators");
const hashPassword = require("../utils/security/passwords/hashPasswors");
const signUp = asyncErrorHandler(async (req, res, next) => {
  const { username, password, email, role } = req.body;
  if (!(username && password && email && role)) {
    throw new CustomError("pleaseEnterAllTheCredentials", 400);
  }
  if (!isValidEmail(email) && !isValidPassword(password, 6)) {
    throw new CustomError("pleaseEnterA6DigitPAssword", 400);
  }
  let hashedPassword = await hashPassword(password);
  const user = await adminSchema.create({
    username,
    password: hashedPassword,
    email,
    role,
  });
  const jwt = await createJwt(
    { _id: user._id, role: user.role },
    process.env.ADMIN_JWT_SECRET
  );
  const response = new Response(true, null, { user, jwt }, "success", 201);
  return res.json(response);
});
module.exports = signUp;
