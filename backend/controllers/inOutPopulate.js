const CustomError = require("../utils/errors/CustomError");
const asyncErrorHandler = require("../utils/errors/asyncErrorHandler");
const Response = require("../utils/response/responseClass");
const studentSchema = require("../models/studentSchema");
const dailySchema = require("../models/dailySchema");
const offsetMilliSeconds = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
const inOutPopulate = asyncErrorHandler(async (req, res, next) => {
  let { rollNo, reason, status, expectedEntryDate } = req.body;

  let isNew;
  console.log(status);
  if (!rollNo) {
    throw new CustomError("enterAValidRollNo", 400);
  }
  rollNo = rollNo.toUpperCase();
  let gateMan = req.adminData;
  if (gateMan.role != "gateMan") {
    throw new CustomError("youAreNotTheGateMan", 403);
  }
  let student;
  let daysData;
  let dateNow = Date.now() + offsetMilliSeconds;
  const foundStudent = await studentSchema.findOne({ rollNo });

  if (!foundStudent) {
    isNew = true;
    if (status != true && status != false) {
      throw new CustomError("PleaseSendStudentsStatus", 400);
    }
  } else {
    isNew = false;
    if (!foundStudent.isAllowed) {
      throw new CustomError("thisStudentIsNotAllowed", 400);
    }
    status = foundStudent.isOut;
  }
  if (reason == "market" && status == false) {
    expectedEntryDate = new Date();
    expectedEntryDate.setHours(29, 29, 0, 0);
  } else if (reason == "home" && status == false) {
    if (!expectedEntryDate) {
      throw new CustomError("PleaseGiveExpectedEntryDate", 400);
    }
    console.log("helllo");
    expectedEntryDate = new Date(expectedEntryDate);
    if (dateNow > expectedEntryDate.getTime()) {
      throw new CustomError("exoectedReturnDateCantBeSmallerYThanDateNow");
    }
  }

  if (isNew) {
    student = await studentSchema.create({
      rollNo: rollNo,
      isOut: !status,
      history: [
        {
          exitDate: status ? null : dateNow,
          exitGate: status ? null : gateMan.gateNo,
          expectedEntryDate: status ? null : expectedEntryDate,
          entryGate: status ? gateMan.gateNo : null,
          entryDate: status ? dateNow : null,
          reason: reason,
        },
      ],
    });

    daysData = await dailySchema.findOneAndUpdate(
      { date: new Date().toLocaleDateString() },
      {
        $push: {
          data: {
            rollNo: rollNo,
            searchId: student._id,
            exitDate: status ? null : dateNow,
            exitGate: status ? null : gateMan.gateNo,
            expectedEntryDate: status ? null : expectedEntryDate,
            entryGate: status ? gateMan.gateNo : null,
            entryDate: status ? dateNow : null,
            reason: reason,
          },
        },
      },
      { new: true }
    );

    if (!daysData) {
      daysData = await dailySchema.create({
        date: new Date().toLocaleDateString(),
        data: [
          {
            rollNo: rollNo,
            searchId: student._id,
            exitDate: status ? null : dateNow,
            exitGate: status ? null : gateMan.gateNo,
            expectedEntryDate: status ? null : expectedEntryDate,
            entryGate: status ? gateMan.gateNo : null,
            entryDate: status ? dateNow : null,
            reason: reason,
          },
        ],
      });
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
  }
  if (status == true) {
    let isLate = false;
    let lateTimes = foundStudent.lateTimes;
    const expectedDate = new Date(
      foundStudent.history[foundStudent.history.length - 1].expectedEntryDate
    );
    if (dateNow > expectedDate.getTime()) {
      isLate = true;
      lateTimes += 1;
    }
    student = await studentSchema.findOneAndUpdate(
      { rollNo: rollNo },
      {
        isOut: false,
        $set: {
          lateTimes: lateTimes,
          "history.$[elem].entryDate": dateNow,
          "history.$[elem].entryGate": gateMan.gateNo,
          "history.$[elem].isLate": isLate,
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

    const exitDate = new Date(
      student.history[student.history.length - 1].exitDate - offsetMilliSeconds
    ).toLocaleDateString();
    console.log(exitDate);
    daysData = await dailySchema.findOneAndUpdate(
      {
        date: exitDate,
      },
      {
        $set: {
          "data.$[elem].entryGate": gateMan.gateNo,
          "data.$[elem].entryDate": dateNow,
          "data.$[elem].isLate": isLate,
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
            expectedEntryDate: expectedEntryDate,
            entryGate: null,
            entryDate: null,
            reason: reason,
          },
        },
      }
    );
    daysData = await dailySchema.findOneAndUpdate(
      { date: new Date().toLocaleDateString() }, // Invoke toLocaleDateString
      {
        $push: {
          data: {
            rollNo: rollNo,
            searchId: student._id,
            exitGate: gateMan.gateNo,
            exitDate: dateNow,
            expectedEntryDate: expectedEntryDate,
            entryDate: null,
            entryGate: null,
            reason: reason,
          },
        },
      },
      { new: true }
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
