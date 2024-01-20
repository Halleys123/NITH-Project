const express = require("express");
const signUp = require("../controllers/signUpAdmin");
const logIn = require("../controllers/logInAdmin");
const checkStudentStatus = require("../controllers/checkStudentStatus");
const inOutPopulate = require("../controllers/inOutPopulate");
const getDaysData = require("../controllers/getDaysData");
const auth = require("../middleware/auth");
const getStudentData = require("../controllers/getStudentData");
const getFilteredStudentData = require("../controllers/getFilteredStudentData");
const blockStudent = require("../controllers/blockStudent");
const unblockStudent = require("../controllers/unblockStudent");
const router = express.Router();

router.route("/adminSignup").post(signUp);
router.route("/adminLogin").post(logIn);
router.route("/checkStudentStatus").post(auth, checkStudentStatus);
router.route("/inOutPopulate").patch(auth, inOutPopulate);
router.route("/getDaysData").get(auth, getDaysData);
router.route("/blockStudent").patch(auth, blockStudent);
router.route("/unblockStudent").patch(auth, unblockStudent);
router.route("/getStudentData").get(auth, getStudentData);
router.route("/getFilteredStudentData").get(auth, getFilteredStudentData);
module.exports = router;
