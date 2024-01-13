const express = require("express");
const signUp = require("../controllers/signUpAdmin");
const logIn = require("../controllers/logInAdmin");
const checkStudentStatus = require("../controllers/checkStudentStatus");
const inOutPopulate = require("../controllers/inOutPopulate");
const getDaysData = require("../controllers/getDaysData");
const auth = require("../middleware/auth");
const getStudentData = require("../controllers/getStudentData");
const getUnreturnedStudents = require("../controllers/getUnreturnedStudents");
const router = express.Router();
router.route("/adminSignup").post(signUp);
router.route("/adminLogin").post(logIn);
router.route("/checkStudentStatus").post(auth, checkStudentStatus);
router.route("/inOutPopulate").post(auth, inOutPopulate);
router.route("/getDaysData").get(auth, getDaysData);
router.route("/getStudentData").get(auth, getStudentData);
router.route("/getUnreturnedStudents").get(auth, getUnreturnedStudents);

module.exports = router;
