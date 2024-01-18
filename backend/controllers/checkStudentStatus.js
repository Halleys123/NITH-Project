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
  console.log(req.body);
  const student = await studentSchema.findOne({ rollNo: rollNo });
  let response;
  if (!student) {
    response = new Response(
      true,
      null,
      { student: null },
      "success",
      200,
      null
    );
    return res.status(response.statusCode).json(response);
  } else {
    student.history = student.history.pop();
    response = new Response(
      true,
      null,
      {
        student: student,
      },
      "success",
      200,
      null
    );
    return res.status(response.statusCode).json(response);
  }
});
module.exports = checkStudentStatus;
