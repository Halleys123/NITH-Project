const CustomError = require("../utils/errors/CustomError");
const asyncErrorHandler = require("../utils/errors/asyncErrorHandler");
const Response = require("../utils/response/responseClass");
const studentSchema = require("../models/studentSchema");
const checkStudentStatus = asyncErrorHandler(async (req, res, next) => {
  const { rollNo } = req.body;
  let gateMan = req.adminData;
  if (gateMan.role != "gateMan") {
    throw new CustomError("youAreNotTheGateMan", 403);
  }
  const student = await studentSchema.findOne({ rollNo: rollNo });
  let response;
  if (!student) {
    response = new Response(
      true,
      null,
      { status: false, isNew: true, message: "Student is in the college" },
      "success",
      200,
      null
    );
    return res.status(response.statusCode).json(response);
  } else {
    response = new Response(
      true,
      null,
      {
        status: student.isOut,
        isNew: false,
        message: student.isOut
          ? `The Student is out for ${student.reasonArray[student.reason]}`
          : `Student is in the college`,
      },
      "success",
      200,
      null
    );
    return res.status(response.statusCode).json(response);
  }
});
module.exports = checkStudentStatus;
