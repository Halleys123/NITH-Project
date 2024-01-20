const token = localStorage.getItem("token");
// ----------------------------------------------------

const rollInput = document.querySelector(".input");
const checkStatus = document.querySelector(".checkStatus");
const datePicker = document.querySelector(".dateBox");
const datePickerInput = document.querySelector(".datePickerInput");
//  --------------------------------------------------------------------
//  Questions and Options
const question = document.querySelector(".inCollege");
const options = document.querySelectorAll(".inCollegeOption");
const noData = document.querySelector(".noData");
const noDataOptions = document.querySelectorAll(".noDataOption");
const outOfCollege = document.querySelector(".outOfCollege");
const outOfCollegeOptions = document.querySelectorAll(".outOfCollegeOption");
//  --------------------------------------------------------------------

const confirmationbox = document.querySelector(".confirmationbox");

// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------
const valid = {
  input: false,
  isInCollege: false,
  isGoingHome: true,
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

async function getStudentData() {
  console.log(valid.rollNo);
  const res = await fetch(`${link}/checkStudentStatus`, {
    method: "POST",
    body: JSON.stringify({ rollNo: valid.rollNo }),
    headers: {
      authentication: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data;
}

rollInput.addEventListener("input", async () => {
  const regex = /^[0-9]{2}[a-z0-9]{3}[0-9]{3}$/;

  rollInput.value = rollInput.value.toLowerCase();

  if (regex.test(rollInput.value)) {
    valid.input = true;
    if (rollInput.value.length == 8) {
      valid.rollNo = rollInput.value;
      question.classList.remove("hide");
      rollInput.classList.remove("invalidRoll");
      rollInput.classList.add("validRoll");
      console.log(await getStudentData());
    } else {
      rollInput.classList.remove("invalidRoll");
      rollInput.classList.remove("validRoll");
    }
  } else {
    valid.input = false;
    options.forEach((option) => {
      option.classList.remove("selectedOption");
    });
    question.classList.add("hide");
    if (rollInput.value.length == 8) {
      rollInput.classList.add("invalidRoll");
      rollInput.classList.remove("validRoll");
    } else {
      rollInput.classList.remove("invalidRoll");
      rollInput.classList.remove("validRoll");
    }
  }
  inputHandler();
});

// Checks if the roll number entered is valid or not
// If valid then it enables the check status button and
// also shows the question that has to be asked
rollInput.addEventListener("input", function () {
  const inputValue = rollInput.value.trim();

  if (inputValue.length === 8) {
    const regex = /^[0-9]{2}[A-Z0-9]{3}[0-9]{3}$/;
    isValidFormat = regex.test(inputValue);

    if (!isValidFormat) {
      rollInput.classList.add("invalid-field");
    } else {
      rollInput.classList.remove("invalid-field");
    }
  } else {
    rollInput.classList.remove("invalid-field");
    isValidFormat = false;
  }
});

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

function inputHandler() {
  // if valid input and goind home then date is required
  // if valid input and not going home then date is not required

  if (valid.input) {
    if (valid.isGoingHome) {
      if (valid.date) {
        checkStatus.removeAttribute("disabled");
      } else {
        checkStatus.setAttribute("disabled", true);
      }
    } else {
      checkStatus.removeAttribute("disabled");
    }
  } else {
    checkStatus.setAttribute("disabled", true);
  }
}

// ----------------------------------------------------
// ----------------------------------------------------
// ----------------------------------------------------

// Selecting one option from options
options.forEach((option) => {
  option.addEventListener("click", () => {
    options.forEach((option) => {
      option.classList.remove("selectedOption");
    });
    option.classList.add("selectedOption");
    if (option.innerText === "Home") {
      valid.isInCollege = true;
      valid.isGoingHome = true;

      // Date picker show
      datePicker.classList.remove("hide");
    } else {
      valid.isInCollege = true;
      valid.isGoingHome = false;
      // Date picker hide
      datePicker.classList.add("hide");
    }
    inputHandler();
  });
});

// ----------------------------------------------------
// ----------------------------------------------------
// ----------------------------------------------------

checkStatus.addEventListener("click", () => {});
