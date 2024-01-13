const CustomError = require("../utils/errors/CustomError");
const asyncErrorHandler = require("../utils/errors/asyncErrorHandler");
const Response = require("../utils/response/responseClass");
const studentSchema = require("../models/studentSchema");
const dailySchema = require("../models/dailySchema");
const offsetMilliSeconds = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
const inOutPopulate = asyncErrorHandler(async (req, res, next) => {
  const { rollNo, reason, status } = req.body;
  if (!rollNo) {
    throw new CustomError("enterAValidRollNo");
  }
  let gateMan = req.adminData;
  if (gateMan.role != "gateMan") {
    throw new CustomError("youAreNotTheGateMan", 403);
  }
  let student;
  let daysData;
  let dateNow = Date.now() + offsetMilliSeconds;
  if (status == true) {
    student = await studentSchema.findOneAndUpdate(
      { rollNo: rollNo },
      {
        isOut: false,
        $set: {
          "history.$[elem].entryDate": dateNow,
          "history.$[elem].entryGate": gateMan.gateNo,
        },
      },
      {
        arrayFilters: [
          {
            "elem.entryDate": null,
          },
        ],
        new: true,
      }
    );

    const exitDate =
      student.history[student.history.length - 1].exitDate.toLocaleDateString();
    daysData = await dailySchema.findOneAndUpdate(
      {
        date: exitDate,
      },
      {
        $set: {
          "data.$[elem].entryGate": gateMan.gateNo,
          "data.$[elem].entryDate": dateNow,
        },
      },
      {
        arrayFilters: [
          {
            "elem.entryDate": null,
            "elem.rollNo": rollNo,
          },
        ],
        new: true,
      }
    );
  } else {
    student = await studentSchema.findOneAndUpdate(
      { rollNo: rollNo },
      {
        $set: { isOut: true },
        $push: {
          history: {
            exitDate: dateNow,
            exitGate: gateMan.gateNo,
            entryGate: null,
            entryDate: null,
            reason: reason,
          },
        },
      }
    );
    if (!student) {
      student = await studentSchema.create({
        rollNo: rollNo,
        isOut: true,
        history: [
          {
            exitDate: dateNow,
            exitGate: gateMan.gateNo,
            entryGate: null,
            entryDate: null,
            reason: reason,
          },
        ],
      });
    }
    daysData = await dailySchema.findOneAndUpdate(
      { date: new Date().toLocaleDateString() }, // Invoke toLocaleDateString
      {
        $push: {
          data: {
            rollNo: rollNo,
            searchId: student._id,
            exitGate: gateMan.gateNo,
            exitDate: dateNow,
            entryDate: null,
            entryGate: null,
            reason: reason,
          },
        },
      },
      { new: true } // If you want the modified document to be returned
    );

    if (!daysData) {
      daysData = await dailySchema.create({
        date: new Date().toLocaleDateString(),
        data: [
          {
            rollNo: rollNo,
            searchId: student._id,
            exitGate: gateMan.gateNo,
            exitDate: dateNow,
            entryDate: null,
            entryGate: null,
            reason: reason,
          },
        ],
      });
    }
  }

  const response = new Response(
    true,
    null,
    {
      message: `The Student with roll No ${rollNo} is ${
        !status ? "out to" : "in from"
      } ${reason}`,
    },
    "success",
    200,
    null
  );
  return res.status(response.statusCode).json(response);
});
module.exports = inOutPopulate;
