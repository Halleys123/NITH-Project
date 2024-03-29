const CustomError = require("../utils/errors/CustomError");
const asyncErrorHandler = require("../utils/errors/asyncErrorHandler");
const Response = require("../utils/response/responseClass");
const studentSchema = require("../models/studentSchema");
const getFilteredStudentData = asyncErrorHandler(async (req, res, next) => {
  let { pageNo = 0, pageSize = 10, isOut, filter, sort } = req.query;
  pageNo = parseInt(pageNo);
  pageSize = parseInt(pageSize);
  if (req.adminData.role != "admin") {
    throw new CustomError("notAuthorized", 403);
  } else {
    let formattedFilter = {};
    let formattedSort = {};
    if (!sort) {
      formattedSort["lastHistory.exitDate"] = -1;
    }
    if (sort.lateTimes) {
      formattedSort["lateTimes"] =
        sort.lateTimes == "1" || sort.lateTimes == "-1" ? +sort.lateTimes : -1;
      delete sort.lateTimes;
    }
    if (isOut) {
      isOut = isOut == "false" ? false : true;
      formattedFilter["isOut"] = isOut;
    }

    function formatObject(originalFilter, storage) {
      for (const key in originalFilter) {
        if (
          key == "entryGate" ||
          key == "exitGate" ||
          key == "entryDate" ||
          key == "exitDate"
        ) {
          if (originalFilter[key] == "null") {
            originalFilter[key] = null;
          } else originalFilter[key] = +originalFilter[key];
        }
        if (originalFilter.hasOwnProperty(key)) {
          const formattedKey = `lastHistory.${key}`;
          storage[formattedKey] = originalFilter[key];
        }
      }
    }
    formatObject(filter, formattedFilter);
    formatObject(sort, formattedSort);
    console.log(formattedFilter);
    const skip = (pageNo - 1) * pageSize;

    const result = await studentSchema.aggregate([
      {
        $addFields: {
          lastHistory: { $arrayElemAt: ["$history", -1] },
        },
      },
      {
        $match: formattedFilter,
      },
      {
        $sort: formattedSort,
      },
      {
        $project: {
          _id: 0,
          rollNo: 1,
          isOut: 1,
          isAllowed: 1,
          lateTimes: 1,
          history: 1,
        },
      },
    ]);
    let noOfPages = Math.ceil(result.length / pageSize);

    const response = new Response(
      true,
      null,
      {
        result: result.splice(skip, pageSize),
        noOfPages,
      },
      "success",
      200,
      null
    );
    return res.status(response.statusCode).json(response);
  }
});
module.exports = getFilteredStudentData;
