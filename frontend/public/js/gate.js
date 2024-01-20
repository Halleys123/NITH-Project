const token = localStorage.getItem("token");
// ----------------------------------------------------

const rollInput = document.querySelector(".input");
const checkStatus = document.querySelector(".checkStatus");
const datePicker = document.querySelector(".dateBox");
const datePickerInput = document.querySelector(".datePickerInput");
//  --------------------------------------------------------------------
//  Questions and Options

const mainQuestionBox = document.querySelector(".inputFeildsQuests");

const question = document.querySelector(".inCollege");
const questionValue = document.querySelector(".inCollegeQuestion");
const options = document.querySelectorAll(".inCollegeOption");
const optionsValue = document.querySelectorAll(".inCollegeOptionText");

const noDataBox = document.querySelector(".noData");
const noDataQuestionValue = document.querySelector(".noDataQuestion");
const noDataOptions = document.querySelectorAll(".noDataOption");
const noDataOptionsValue = document.querySelectorAll(".noDataOptionText");
//  --------------------------------------------------------------------

const confirmationBox = document.querySelector(".blurBackgroundConfirm");
const confirmationBoxButtons = document.querySelectorAll(".confirmBoxButton");
const confirmBoxFinalData = document.querySelectorAll(".finalDataItemTextVal");
const confirmBoxSub = document.querySelector(".confirmBoxSub");
const cancelButton = document.querySelector(".confirmBoxButton-cancel");
const confirmButton = document.querySelector(".confirmBoxButton-confirm");
// -------------------------------------------------
const studentData = document.querySelectorAll(".studentData");
// -------------------------------------------------
const errorOverlay = document.querySelector(".blur");
const blockedStudentButton = document.querySelector(".blockedPersonButton");
// -------------------------------------------------
const studentOptions = {
  noData: {
    status: "The Student is not registered in the database yet. Please Update",
    currently: "No Data Available",
    cssTag: "noDataTag",
    questionSet: [
      {
        question: "Do student wants to go",
        options: ["in College", "out of College"],
      },
      {
        question: "Where does he want to Go?",
        options: ["Home", "Market"],
      },
    ],
  },
  inCollege: {
    status: "Registered",
    currently: "College",
    cssTag: "collegeTag",
    questionSet: [
      {
        question: "Where does he want to Go?",
        options: ["Home", "Market"],
      },
    ],
  },
  atHome: {
    status: "Registered",
    currently: "Home",
    cssTag: "homeTag",
    questionSet: [
      {
        question: "Permit Student to Enter to College?",
        options: ["No", "Yes"],
      },
    ],
  },
  inMarket: {
    status: "Registered",
    currently: "Market",
    cssTag: "marketTag",
    questionSet: [
      {
        question: "Permit Student to Enter to College?",
        options: ["No", "Yes"],
      },
    ],
  },
};
// -------------------------------------------------
const valid = {
  showQuestion: false,
  input: false,

  isGoingOut: false,
  isGoingInCollege: false,
  isGoingHome: false,
  isGoingMarket: false,
  date: false,

  goingTo: null,

  expectedReturnDate: null,
  rollNo: null,
};
const finalData = {
  // Do not change the order
  rollNo: null,
  goingTo: null,
  returnBy: null,
};
// -------------------------------------------------
function init() {
  checkStatus.setAttribute("disabled", true);
}
// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------
function dateConversion(date) {
  if (date === "No Data Available") return date;
  date = new Date(date);
  const formattedDate = date.toLocaleDateString("en-GB", {
    timeZone: "GMT",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    timeZone: "GMT",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const result = `${formattedTime} ${formattedDate}`;
  return result;
}
function todayTomorrowDate(dateInput) {
  const today = new Date();
  const date = new Date(dateInput);
  if (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  ) {
    return "Today";
  } else if (
    today.getDate() + 1 === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  ) {
    return "Tomorrow";
  } else {
    return date.toLocaleDateString("en-GB", {
      timeZone: "GMT",
    });
  }
}
function fillQuestion(question, option) {
  questionValue.innerText = question;
  for (let i = 0; i < optionsValue.length; i++) {
    optionsValue[i].textContent = option[i];
    // console.log(optionsValue);
  }
  for (let i = 0; i < options.length; i++)
    options[i].setAttribute("value", option[i]);
}
function fillStudentObject(rollNo, date, currently, status, cssTag) {
  // This order should not be changed
  // It is used in fillStudentData function
  // studentData[0].children[0].children[0].innerText = studentDataInput.rollNo;
  return {
    rollNo: rollNo,
    lastUpdated: dateConversion(date),
    currently: currently,
    status: status,
    cssTag: cssTag,
  };
}
function isStudentAllowed(func, isAllowed, quest, options) {
  if (isAllowed) {
    func(quest, options);
    question.classList.remove("hide");
    mainQuestionBox.classList.remove("hide");
  } else {
    question.classList.add("hide");
    mainQuestionBox.classList.add("hide");
  }
}
function fillStudentData(studentDataInput) {
  // Remove previous cssTag
  studentData[2].children[0].children[0].classList.remove(
    "collegeTag",
    "homeTag",
    "marketTag",
    "noDataTag"
  );
  // Change value of options
  Object.keys(studentDataInput).forEach((key, i) => {
    if (key !== "cssTag") {
      studentData[i].children[0].children[0].innerText = studentDataInput[key];
    }
  });
  studentData[2].children[0].children[0].classList.add(studentDataInput.cssTag);
}

async function getStudentData() {
  studentData.forEach((item) => {
    item.children[0].classList.add("skeleton");
    item.children[0].children[0].innerText = "";
  });
  const res = await fetch(`${link}/checkStudentStatus`, {
    method: "POST",
    body: JSON.stringify({ rollNo: valid.rollNo }),
    headers: {
      authentication: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  studentData.forEach((item) => {
    item.children[0].classList.remove("skeleton");
  });
  const student = data.responseMessage.student;
  let sData = {};
  if (student) {
    if (student.isAllowed) {
      errorOverlay.classList.remove("showOverlay");
    } else {
      errorOverlay.classList.add("showOverlay");
    }
    valid.showQuestion = student.isAllowed;
    if (!student.isOut) {
      const collegeData = studentOptions.inCollege;
      sData = fillStudentObject(
        student.rollNo,
        student.history[0].entryDate,
        collegeData.currently,
        collegeData.status,
        collegeData.cssTag
      );
      isStudentAllowed(
        fillQuestion,
        valid.showQuestion,
        collegeData.questionSet[0].question,
        collegeData.questionSet[0].options
      );
      fillStudentData(sData);
    } else {
      if (student.history[0].reason === "market") {
        const marketData = studentOptions.inMarket;
        sData = fillStudentObject(
          student.rollNo,
          student.history[0].exitDate,
          marketData.currently,
          marketData.status,
          marketData.cssTag
        );
        isStudentAllowed(
          fillQuestion,
          valid.showQuestion,
          marketData.questionSet[0].question,
          marketData.questionSet[0].options
        );
        fillStudentData(sData);
      } else {
        const homeData = studentOptions.atHome;
        sData = fillStudentObject(
          student.rollNo,
          student.history[0].exitDate,
          homeData.currently,
          homeData.status,
          homeData.cssTag
        );
        isStudentAllowed(
          fillQuestion,
          valid.showQuestion,
          homeData.questionSet[0].question,
          homeData.questionSet[0].options
        );
        fillStudentData(sData);
      }
    }
  } else {
    const noData = studentOptions.noData;
    sData = fillStudentObject(
      rollInput.value,
      "No Data Available",
      noData.currently,
      noData.status,
      noData.cssTag
    );
    isStudentAllowed(
      fillQuestion,
      valid.showQuestion,
      noData.questionSet[0].question,
      noData.questionSet[0].options
    );
    fillStudentData(sData);
  }
  return data;
}

rollInput.addEventListener("input", async () => {
  const regex = /^[0-9]{2}[a-z0-9]{3}[0-9]{3}$/;

  noDataOptions.forEach((option) => {
    option.classList.remove("selectedOption");
  });
  options.forEach((option) => {
    option.classList.remove("selectedOption");
  });
  question.classList.add("hide");
  mainQuestionBox.classList.add("hide");
  noDataBox.classList.add("hide");
  datePicker.classList.add("hide");
  checkStatus.setAttribute("disabled", true);

  Object.keys(valid).forEach((key) => {
    valid[key] = false;
  });
  valid.expectedReturnDate = null;
  valid.rollNo = null;
  valid.date = false;
  datePickerInput.value = "";
  console.log(valid.expectedReturnDate);
  rollInput.value = rollInput.value.toLowerCase();
  if (regex.test(rollInput.value)) {
    valid.input = true;

    if (rollInput.value.length == 8) {
      valid.rollNo = rollInput.value;
      valid.showQuestion = true;

      rollInput.classList.remove("invalidRoll");
      rollInput.classList.add("validRoll");

      await getStudentData();
    } else {
      rollInput.classList.remove("invalidRoll");
      rollInput.classList.remove("validRoll");
    }
    inputHandler();
  } else {
    valid.input = false;
    options.forEach((option) => {
      option.classList.remove("selectedOption");
    });
    valid.showQuestion = false;
    question.classList.add("hide");
    mainQuestionBox.classList.add("hide");

    if (rollInput.value.length == 8) {
      rollInput.classList.add("invalidRoll");
      rollInput.classList.remove("validRoll");
    } else {
      rollInput.classList.remove("invalidRoll");
      rollInput.classList.add("validRoll");
    }
  }
});
blockedStudentButton.addEventListener("click", () => {
  errorOverlay.classList.remove("showOverlay");
});
// ----------------------------------------------------

datePicker.addEventListener("input", (e) => {
  valid.expectedReturnDate = datePickerInput.value;
  // Today ki problem - Agar aaj ki date select kar rahe hain toh kaise confirmation karenge ki aaj
  // ki date hai pata nahi lag raha
  // If date is today or after that then console correct
  if (new Date(datePickerInput.value) >= new Date()) {
    valid.date = true;
    valid.expectedReturnDate = datePickerInput.value;
  } else {
    valid.date = false;
    datePickerInput.value = "";
    valid.expectedReturnDate = null;
  }
  inputHandler();
});

// ----------------------------------------------------
// ----------------------------------------------------
// ----------------------------------------------------

// Selecting one option from options
options.forEach((option) => {
  option.addEventListener("click", () => {
    noDataBox.classList.add("hide");
    valid.expectedReturnDate = null;
    datePickerInput.value = "";

    valid.date = false;
    options.forEach((option) => {
      option.classList.remove("selectedOption");
    });
    option.classList.add("selectedOption");
    if (option.getAttribute("value") == "Home") {
      valid.isGoingOut = true;
      valid.isGoingToCollege = false;
      valid.isGoingHome = true;
      valid.isGoingMarket = false;
      valid.goingTo = "Home";
      datePicker.classList.remove("hide");
    } else if (option.getAttribute("value") == "Market") {
      valid.isGoingOut = true;
      valid.isGoingToCollege = false;
      valid.isGoingMarket = true;
      valid.isGoingHome = false;
      valid.goingTo = "Market";
      datePicker.classList.add("hide");
    } else if (option.getAttribute("value") == "in College") {
      valid.isGoingToCollege = true;
      valid.isGoingOut = false;
      valid.isGoingHome = false;
      valid.isGoingMarket = false;
      valid.goingTo = "College";
      datePicker.classList.add("hide");
    } else if (option.getAttribute("value") == "out of College") {
      valid.isGoingToCollege = false;
      valid.isGoingOut = true;
      valid.isGoingHome = false;
      valid.isGoingMarket = false;

      valid.date = false;
      valid.expectedReturnDate = null;

      noDataBox.classList.remove("hide");
      datePicker.classList.add("hide");

      noDataOptions.forEach((option) => {
        option.classList.remove("selectedOption");
      });
    } else if (option.getAttribute("value") == "Yes") {
      valid.isGoingToCollege = true;
      valid.isGoingOut = false;
      valid.isGoingHome = false;
      valid.isGoingMarket = false;
      valid.goingTo = "College";
      datePicker.classList.add("hide");
    } else if (option.getAttribute("value") == "No") {
      valid.isGoingToCollege = true;
      valid.isGoingOut = false;
      valid.isGoingHome = false;
      valid.isGoingMarket = false;
      valid.goingTo = "College";
      datePicker.classList.add("hide");
    }
    inputHandler();
  });
});
noDataOptions.forEach((option) => {
  option.addEventListener("click", () => {
    noDataOptions.forEach((option) => {
      option.classList.remove("selectedOption");
    });
    datePickerInput.value = "";
    valid.expectedReturnDate = null;
    valid.date = false;
    checkStatus.setAttribute("disabled", true);

    option.classList.add("selectedOption");
    if (option.getAttribute("value") == "Home") {
      valid.isGoingOut = true;
      valid.isGoingToCollege = false;
      valid.isGoingHome = true;
      valid.isGoingMarket = false;
      valid.goingTo = "Home";
      datePicker.classList.remove("hide");
    } else if (option.getAttribute("value") == "Market") {
      valid.isGoingOut = true;
      valid.isGoingToCollege = false;
      valid.isGoingMarket = true;
      valid.isGoingHome = false;
      valid.expectedReturnDate = null;
      valid.goingTo = "Market";
      datePicker.classList.add("hide");
    }
    inputHandler();
  });
});
function inputHandler() {
  if (valid.input) {
    console.log("Valid Roll Number");
    if (valid.isGoingOut) {
      console.log("Student is going out");
      checkStatus.setAttribute("disabled", true);
      if (valid.isGoingHome) {
        console.log("Student is going home");
        if (valid.date) {
          console.log("Valid Date");
          checkStatus.removeAttribute("disabled");
        } else {
          console.log("Invalid Date");
          checkStatus.setAttribute("disabled", true);
        }
      }
      if (valid.isGoingMarket) {
        console.log("Student is going market");
        checkStatus.removeAttribute("disabled");
      }
    }
    if (valid.isGoingToCollege) {
      console.log("Student is going to college");
      checkStatus.removeAttribute("disabled");
    }
  } else {
    console.log("Invalid Roll Number");
    checkStatus.setAttribute("disabled", true);
  }
}

// ----------------------------------------------------
// ----------------------------------------------------
// ----------------------------------------------------

checkStatus.addEventListener("click", () => {
  confirmationBox.classList.add("showOverlay");
  finalData.rollNo = rollInput.value;
  finalData.goingTo = valid.goingTo;
  // date picker or today
  finalData.returnBy =
    valid.goingTo === "College" ? "Invalid" : valid.expectedReturnDate;

  if (valid.goingTo === "College") {
    confirmBoxSub.innerText = `Are you sure you want to allow ${finalData.rollNo} to enter the college?`;
  }
  if (valid.goingTo === "Home") {
    confirmBoxSub.innerText = `${
      finalData.rollNo
    } would be returning on ${todayTomorrowDate(
      finalData.returnBy
    )}. Are you sure you want to allow ${finalData.rollNo} to go to home?`;
  }
  if (valid.goingTo === "Market") {
    confirmBoxSub.innerText = `Are you sure you want to allow ${finalData.rollNo} to go to market?`;
  }
  confirmBoxFinalData.forEach((item, i) => {
    item.innerText = finalData[Object.keys(finalData)[i]];
  });

  question.classList.add("hide");
  mainQuestionBox.classList.add("hide");
  noDataBox.classList.add("hide");
  datePicker.classList.add("hide");
  rollInput.classList.remove("validRoll");
  checkStatus.setAttribute("disabled", true);
  options.forEach((option) => {
    option.classList.remove("selectedOption");
  });
  noDataOptions.forEach((option) => {
    option.classList.remove("selectedOption");
  });
});
cancelButton.addEventListener("click", () => {
  console.log("cancel");
  confirmationBox.classList.remove("showOverlay");
  finalData.rollNo = null;
  finalData.goingTo = null;
  finalData.returnBy = null;

  confirmBoxFinalData.forEach((item, i) => {
    item.innerText = finalData[Object.keys(finalData)[i]];
  });

  valid.isGoingOut = false;
  valid.isGoingInCollege = false;
  valid.isGoingHome = false;
  valid.isGoingMarket = false;
  valid.date = false;
  valid.expectedReturnDate = null;
  valid.rollNo = null;
  valid.goingTo = null;
  valid.showQuestion = false;
  valid.input = false;

  rollInput.value = "";
});

// ----------------------------------------------------
