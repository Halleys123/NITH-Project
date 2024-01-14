const dailySchema = require("../models/dailySchema");
const CustomError = require("../utils/errors/CustomError");
const asyncErrorHandler = require("../utils/errors/asyncErrorHandler");
const Response = require("../utils/response/responseClass");
const getDaysData = asyncErrorHandler(async (req, res, next) => {
  let {
    pageNo = 1,
    pageSize = 10,
    filter = {},
    date,
    sort,
    startDate,
    endDate,
  } = req.query;
  if (!startDate) {
    throw new CustomError("dateNecessary");
  }
  const startDateFormat = new Date(startDate);
  const endDateFormat = new Date(endDate);
  let formattedFilter = {
    dateAsDate: { $lte: endDateFormat, $gte: startDateFormat },
  };
  if (!endDate) {
    formattedFilter = { date: startDate };
  }

  const formattedSort = {};
  if (!sort) {
    formattedSort["entryDate"] = -1;
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
        const formattedKey = `data.${key}`;
        storage[formattedKey] = originalFilter[key];
      }
    }
  }
  formatObject(filter, formattedFilter);
  formatObject(sort, formattedSort);
  console.log(formattedFilter);
  console.log(date);
  console.log(filter);
  pageNo = parseInt(pageNo);
  pageSize = parseInt(pageSize);
  if (req.adminData.role != "admin") {
    throw new CustomError("notAuthorized", 403);
  } else {
    const skip = (pageNo - 1) * pageSize;
    const result = await dailySchema.aggregate([
      {
        $addFields: {
          dateAsDate: {
            $dateFromString: {
              dateString: "$date",
              timezone: "Asia/Kolkata",
            },
          },
        },
      },
      {
        $unwind: {
          path: "$data",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: formattedFilter,
      },
      { $sort: formattedSort },
      {
        $project: {
          data: 1, // Include the data field in the output
          dateAsDate: 1,
        },
      },
      {
        $group: {
          _id: null, // Group by null to accumulate all entries
          allData: { $push: "$data" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the output
          data: { $slice: ["$allData", skip, pageSize] },
        },
      },
    ]);

    const response = new Response(true, null, result, "success", 200, null);
    return res.status(response.statusCode).json(response);
  }
});
module.exports = getDaysData;
