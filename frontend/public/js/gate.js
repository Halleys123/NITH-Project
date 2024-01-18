const token = localStorage.getItem("token");
const input = document.querySelector(".input");
const checkStatus = document.querySelector(".checkStatus");
const rollNoEntry = document.querySelector(".rollNoEntry");
const lastUpdatedEntry = document.querySelector(".lastUpdatedEntry");
const lastUpdated = document.querySelector(".lastUpdated");
const lastUpdatedHead = document.querySelector(".lastUpdatedHead");
const currentlyEntry = document.querySelector(".currentlyEntry");
const statusEntry = document.querySelector(".statusEntry");
const questions = document.querySelector(".questions");
const questionAlteration = document.querySelector(".questionAlteration");
const optionAlteration1 = document.querySelector(".optionAlteration1");
const optionAlteration2 = document.querySelector(".optionAlteration2");
let selectedOptions = {
  status: false,
  isNew: false,
  rollNo: null,
  reason: "market",
};
let option1Option;
let option2Option;
let isShowing = false;
checkStatus.addEventListener("click", async () => {
  selectedOptions.isNew = false;
  selectedOptions.status = false;
  selectedOptions.rollNo = null;
  selectedOptions.reason = "market";
  optionMarket.classList.remove("selected");
  optionHome.classList.remove("selected");
  optionOutOfCollege.classList.remove("selected");
  optionIntoCollege.classList.remove("selected");
  const rollNo = input.value;
  console.log(rollNo);
  checkStatus.disabled = true;
  currentlyEntry.classList.remove("college");
  currentlyEntry.classList.remove("market");
  currentlyEntry.classList.remove("home");
  rollNoEntry.innerText = "Fetching Please Wait...";
  currentlyEntry.innerText = "Fetching Please Wait...";
  statusEntry.innerText = "Fetching Please Wait...";
  statusEntry.classList.add("noSelection");
  rollNoEntry.classList.add("noSelection");
  currentlyEntry.classList.add("noSelection");
  const res = await fetch(`${link}/checkStudentStatus`, {
    method: "POST",
    body: JSON.stringify({ rollNo: rollNo }),
    headers: {
      authentication: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const response = await res.json();
  console.log(response);
  statusEntry.classList.remove("noSelection");
  rollNoEntry.classList.remove("noSelection");
  currentlyEntry.classList.remove("noSelection");
  const { student } = response.responseMessage;
  rollNoEntry.innerText = rollNo;
  if (student) {
    statusEntry.innerText = "Registered";
    if (student.isOut == false) {
      questions.classList.remove("outCollege");
      questions.classList.remove("inCollege");
      questions.classList.remove("notRegistered");
      questions.classList.add("registered");
      questions.classList.remove("empty");
      selectedOptions.isNew = false;
      selectedOptions.rollNo = rollNo;
      selectedOptions.status = false;
      currentlyEntry.classList.add("college");
      currentlyEntry.innerText = "college";
      lastUpdatedHead.innerText = "Last entry in college:";
      let date = new Date(student.history[0].entryDate);
      lastUpdatedEntry.innerText =
        date.toLocaleDateString("en-GB", {
          timeZone: "GMT",
        }) +
        "  " +
        date.toLocaleTimeString("en-US", {
          timeZone: "GMT",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      lastUpdated.style.opacity = 1;
    } else {
      selectedOptions.isNew = false;
      selectedOptions.rollNo = rollNo;
      selectedOptions.status = true;
      questionAlteration.innerText = `This student wants to enter the college. Allow?`;
      questions.classList.remove("outCollege");
      questions.classList.remove("inCollege");
      questions.classList.remove("notRegistered");
      questions.classList.add("registered");
      questions.classList.remove("empty");
      const reason = student.history[0].reason;
      document.querySelector(
        ".questionAlteration"
      ).innerText = `This student wants to enter the college. Allow?`;
      document.querySelector(".optionAlteration1").innerText = `Deny`;
      document.querySelector(".optionAlteration2").innerText = `Admit`;
      let date = new Date(student.history[0].exitDate);
      lastUpdatedHead.innerText = "Last exit from college:";
      lastUpdatedEntry.innerText =
        date.toLocaleDateString("en-GB", {
          timeZone: "GMT",
        }) +
        "  " +
        date.toLocaleTimeString("en-US", {
          timeZone: "GMT",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

      lastUpdated.style.opacity = 1;
      currentlyEntry.classList.add(reason);
      currentlyEntry.innerText = reason;
    }
  } else {
    selectedOptions.isNew = true;
    selectedOptions.rollNo = rollNo;
    questions.classList.remove("empty");
    questions.classList.add("notRegistered");
    questions.classList.remove("registered");

    lastUpdated.style.opacity = 0;
    currentlyEntry.innerText = "No Records Found";
    statusEntry.innerText =
      "The Student is not registered in the database yet. Please Update";
    optionAlteration1.innerText = `Deny`;
    optionAlteration2.innerText = `Admit`;
  }
});
input.addEventListener("input", () => {
  if (input.value.length == 8) {
    checkStatus.disabled = false;
  } else {
    checkStatus.disabled = true;
  }
});
const optionIntoCollege = document.querySelector(".optionIntoCollege");
optionIntoCollege.addEventListener("click", () => {
  selectedOptions.status = true;
  optionOutOfCollege.classList.remove("selected");
  optionIntoCollege.classList.add("selected");
  questions.classList.add("inCollege");
  questions.classList.remove("outCollege");
  questions.classList.remove("notRegistered");
  console.log(selectedOptions);
});
const optionOutOfCollege = document.querySelector(".optionOutOfCollege");
optionOutOfCollege.addEventListener("click", () => {
  selectedOptions.status = false;
  optionOutOfCollege.classList.add("selected");
  optionIntoCollege.classList.remove("selected");
  questions.classList.add("outCollege");
  questions.classList.remove("inCollege");
  questions.classList.remove("notRegistered");
  questionAlteration.innerText = "Select where does he want to go?";
  optionAlteration1.innerText = `Market`;
  optionAlteration2.innerText = `Home`;
  console.log(selectedOptions);
});
const optionMarket = document.querySelector(".optionMarket");
optionMarket.addEventListener("click", () => {
  optionMarket.classList.add("selected");
  optionHome.classList.remove("selected");
  selectedOptions.reason = "market";
  console.log(selectedOptions);
});
const optionHome = document.querySelector(".optionHome");
optionHome.addEventListener("click", () => {
  optionMarket.classList.remove("selected");
  optionHome.classList.add("selected");
  selectedOptions.reason = "home";
  console.log(selectedOptions);
});
