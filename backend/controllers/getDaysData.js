const dailySchema = require("../models/dailySchema");
const CustomError = require("../utils/errors/CustomError");
const asyncErrorHandler = require("../utils/errors/asyncErrorHandler");
const Response = require("../utils/response/responseClass");
const getDaysData = asyncErrorHandler(async (req, res, next) => {
  let { date, pageNo = 1, pageSize = 10 } = req.query;
  if (!date) {
    throw new CustomError("noDateGiven", 403);
  }
  pageNo = parseInt(pageNo);
  pageSize = parseInt(pageSize);
  if (req.adminData.role != "admin") {
    throw new CustomError("notAuthorized", 403);
  } else {
    const skip = (pageNo - 1) * pageSize;

    const result = await dailySchema.aggregate([
      { $match: { date: date } },
      {
        $project: {
          data: {
            $slice: ["$data", skip, pageSize],
          },
        },
      },
    ]);

    const response = new Response(true, null, result, "success", 200, null);
    return res.status(response.statusCode).json(response);
  }
});
module.exports = getDaysData;
