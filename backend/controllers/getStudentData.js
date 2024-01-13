const CustomError = require("../utils/errors/CustomError");
const asyncErrorHandler = require("../utils/errors/asyncErrorHandler");
const studentSchema = require("../models/studentSchema");
const Response = require("../utils/response/responseClass");
const getStudentData = asyncErrorHandler(async (req, res, next) => {
  const { rollNo } = req.query;
  if (!rollNo) {
    throw new CustomError("pleaseGiveARollNo", 403);
  }
  if (req.adminData.role != "admin") {
    throw new CustomError("notAuthorized", 403);
  } else {
    const student = await studentSchema.findOne({ rollNo: rollNo });
    const response = new Response(true, null, student, "success", 200, null);
    return res.status(response.statusCode).json(response);
  }
});
module.exports = getStudentData;
