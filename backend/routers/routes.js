const express = require("express");
const signUp = require("../controllers/signUpAdmin");
const logIn = require("../controllers/logInAdmin");
const router = express.Router();
router.route("/adminSignup").post(signUp);
router.route("/adminLogin").post(logIn);
module.exports = router;
