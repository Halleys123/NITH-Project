const CustomError = require("../utils/errors/CustomError");
const asyncErrorHandler = require("../utils/errors/asyncErrorHandler");
const studentSchema = require("../models/studentSchema");
const Response = require("../utils/response/responseClass");
const blockStudent = asyncErrorHandler(async (req, res, next) => {
  let admin = req.adminData;
  if (!admin) {
    throw new CustomError("noAdmin", 403);
  }
  console.log(admin);
  if (admin.role != "admin") {
    throw new CustomError("youAreNotAdmin", 403);
  }
  let { rollNo } = req.body;
  if (!rollNo) {
    throw new CustomError("ProvideARollNo", 400);
  }
  rollNo = rollNo.toUpperCase();
  const student = await studentSchema.findOne({ rollNo: rollNo });

  if (!student) {
    await studentSchema.create({
      rollNo: rollNo,
      isOut: false,
      lateTimes: false,
      isAllowed: false,
      history: [],
    });
  } else {
    await studentSchema.findOneAndUpdate(
      { rollNo: rollNo },
      { $set: { isAllowed: false } }
    );
  }
  const response = new Response(
    true,
    null,
    `rollNo${rollNo}BlockedSuccessfully`,
    "success",
    200,
    null
  );
  res.json(response);
});
module.exports = blockStudent;
