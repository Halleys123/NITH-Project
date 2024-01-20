const dailySchema = require("../models/dailySchema");
const CustomError = require("../utils/errors/CustomError");
const asyncErrorHandler = require("../utils/errors/asyncErrorHandler");
const Response = require("../utils/response/responseClass");
const offsetMilliSeconds = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
const getDaysData = asyncErrorHandler(async (req, res, next) => {
  let dateNow = new Date(Date.now() + offsetMilliSeconds);
  let {
    pageNo = 1,
    pageSize = 10,
    filter = {},
    sort,
    startDate,
    endDate,
  } = req.query;
  if (!startDate) {
    throw new CustomError("dateNecessary", 400);
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
  // if (!sort) {
  //   formattedSort["data.entryDate"] = -1;
  // }

  if (filter.isLate == "true") {
    formattedFilter["$or"] = [
      { "data.isLate": true },
      { "data.entryGate": null, "data.expectedEntryDate": { $lt: dateNow } },
    ];
  } else if (filter.isLate == "false") {
    formattedFilter["$or"] = [
      { "data.isLate": false, "data.entryDate": { $ne: null } },
      { "data.isLate": false, "data.expectedEntryDate": { $gt: dateNow } },
    ];
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
        } else originalFilter[key] = parseInt(originalFilter[key]);
      }
      if (key == "isLate") {
        continue;
      } else if (originalFilter.hasOwnProperty(key)) {
        const formattedKey = `data.${key}`;
        storage[formattedKey] = originalFilter[key];
      }
    }
  }
  formatObject(filter, formattedFilter);
  formatObject(sort, formattedSort);
  console.log(formattedSort);
  console.log(formattedFilter);

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
          data: "$allData",
        },
      },
    ]);

    let noOfPages = 0;
    let response;
    if (result.length > 0) {
      noOfPages = Math.ceil(result[0].data.length / pageSize);
      response = new Response(
        true,
        null,
        { result: result[0].data.splice(skip, pageSize), noOfPages },
        "success",
        200,
        null
      );
    } else {
      response = new Response(
        true,
        null,
        { result: [], noOfPages },
        "success",
        200,
        null
      );
    }
    return res.status(response.statusCode).json(response);
  }
});
module.exports = getDaysData;
