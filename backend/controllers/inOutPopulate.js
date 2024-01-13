const adminSchema = require("../models/adminSchema");
const CustomError = require("../utils/errors/CustomError");
const decodeJwt = require("../utils/security/jwt/decodeJwt");
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
  let jwtToken = req.headers.authentication;
  const payload = await decodeJwt(jwtToken, process.env.ADMIN_JWT_SECRET);
  let gateMan = await adminSchema.findOne({ _id: payload._id });
  if (!gateMan) {
    throw new CustomError("logInAgainYourTokenHasBeenExpired", 403);
  }
  if (gateMan.role != "gateMan") {
    throw new CustomError("youAreNotTheGateMan", 403);
  }
  let student;
  let daysData;
  if (status == true) {
    student = await studentSchema.findOneAndUpdate(
      { rollNo: rollNo },
      {
        isOut: false,
        $set: {
          "history.$[elem].entryDate": Date.now() + offsetMilliSeconds,
          "history.$[elem].entryGate": payload.gateNo,
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
          "data.$[elem].entryGate": payload.gateNo,
          "data.$[elem].entryDate": Date.now() + offsetMilliSeconds,
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
            exitDate: Date.now() + offsetMilliSeconds,
            exitGate: payload.gateNo,
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
            exitDate: Date.now() + offsetMilliSeconds,
            exitGate: payload.gateNo,
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
            exitGate: payload.gateNo,
            exitDate: Date.now() + offsetMilliSeconds,
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
            exitGate: payload.gateNo,
            exitDate: Date.now() + offsetMilliSeconds,
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
  res.json(response);
});
module.exports = inOutPopulate;
