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

const confirmationbox = document.querySelector(".confirmationbox");
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

  expectedReturnDate: null,
  rollNo: null,
};
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
function fillQuestion(question, options) {
  questionValue.innerText = question;
  for (let i = 0; i < optionsValue.length; i++) {
    optionsValue[i].textContent = options[i];
    console.log(optionsValue);
    optionsValue[i].setAttribute("value", options[i]);
  }
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
  inputHandler();
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
  } else {
    valid.date = false;
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
    options.forEach((option) => {
      option.classList.remove("selectedOption");
    });
    option.classList.add("selectedOption");
    console.log(option.getAttribute("value"));
    if (option.getAttribute("value") == "Home") {
      valid.isGoingOut = true;
      valid.isGoingToCollege = false;
      valid.isGoingHome = true;
      valid.isGoingMarket = false;
    } else if (option.getAttribute("value") == "Market") {
      valid.isGoingOut = true;
      valid.isGoingToCollege = false;
      valid.isGoingMarket = true;
      valid.isGoingHome = false;
    } else if (option.getAttribute("value") == "in College") {
      valid.isGoingToCollege = true;
      valid.isGoingOut = false;
      valid.isGoingHome = false;
      valid.isGoingMarket = false;
    } else if (option.getAttribute("value") == "out of College") {
      valid.isGoingToCollege = false;
      valid.isGoingOut = true;
      noDataBox.classList.remove("hide");
    }
    inputHandler();
  });
});
noDataOptions.forEach((option) => {
  option.addEventListener("click", () => {
    noDataOptions.forEach((option) => {
      option.classList.remove("selectedOption");
    });
    option.classList.add("selectedOption");
    if (option.getAttribute("value") == "Home") {
      valid.isGoingOut = true;
      valid.isGoingToCollege = false;
      valid.isGoingHome = true;
      valid.isGoingMarket = false;
    } else if (option.getAttribute("value") == "Market") {
      valid.isGoingOut = true;
      valid.isGoingToCollege = false;
      valid.isGoingMarket = true;
      valid.isGoingHome = false;
    }
    inputHandler();
  });
});
function inputHandler() {
  if (valid.input) {
    console.log("validInput");
    if (valid.isGoingOut) {
      console.log("validGoingOut");
      if (valid.date) {
        console.log("validDate");
        checkStatus.removeAttribute("disabled");
      } else {
        console.log("invalidDate");
        checkStatus.setAttribute("disabled", true);
      }
    }
    if (valid.isGoingToCollege) {
      console.log("validGoingToCollege");
      checkStatus.removeAttribute("disabled");
    }
  } else {
    console.log("invalidInput");
    checkStatus.setAttribute("disabled", true);
  }
}

// ----------------------------------------------------
// ----------------------------------------------------
// ----------------------------------------------------

checkStatus.addEventListener("click", () => {});
