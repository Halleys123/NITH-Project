const dailySchema = require("../models/dailySchema");
const CustomError = require("../utils/errors/CustomError");
const asyncErrorHandler = require("../utils/errors/asyncErrorHandler");
const Response = require("../utils/response/responseClass");
const studentSchema = require("../models/studentSchema");
const getUnreturnedStudents = asyncErrorHandler(async (req, res, next) => {
  let { pageNo = 0, pageSize = 10 } = req.query;

  pageNo = parseInt(pageNo);
  pageSize = parseInt(pageSize);
  if (req.adminData.role != "admin") {
    throw new CustomError("notAuthorized", 403);
  } else {
    const skip = (pageNo - 1) * pageSize;
    const students = await studentSchema
      .find({ isOut: true })
      .skip(skip)
      .limit(pageSize)
      .exec();
    const response = new Response(true, null, students, "success", 200, null);
    return res.status(response.statusCode).json(response);
  }
});
module.exports = getUnreturnedStudents;
