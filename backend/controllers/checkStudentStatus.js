const adminSchema = require("../models/adminSchema");
const CustomError = require("../utils/errors/CustomError");
const decodeJwt = require("../utils/security/jwt/decodeJwt");
const asyncErrorHandler = require("../utils/errors/asyncErrorHandler");
const Response = require("../utils/response/responseClass");
const studentSchema = require("../models/studentSchema");
const checkStudentStatus = asyncErrorHandler(async (req, res, next) => {
  const { rollNo } = req.body;
  let jwtToken = req.headers.authentication;
  const payload = await decodeJwt(jwtToken, process.env.ADMIN_JWT_SECRET);
  let gateMan = await adminSchema.findOne({ _id: payload._id });
  if (!gateMan) {
    throw new CustomError("logInAgainYourTokenHasBeenExpired", 403);
  }
  if (gateMan.role != "gateMan") {
    throw new CustomError("youAreNotTheGateMan", 403);
  }
  const student = await studentSchema.findOne({ rollNo: rollNo });
  let response;
  if (!student) {
    response = new Response(
      true,
      null,
      { status: false, message: "Student is in the college" },
      "success",
      200,
      null
    );
  } else {
    response = new Response(
      true,
      null,
      {
        status: student.isOut,
        message: student.isOut
          ? `The Student is out for ${student.reasonArray[student.reason]}`
          : `Student is in the college`,
      },
      "success",
      200,
      null
    );
  }
  return res.json(response);
});
module.exports = checkStudentStatus;
