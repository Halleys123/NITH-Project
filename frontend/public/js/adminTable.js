const sortByDate = document.querySelectorAll(".sortOne__optns__date__item");
const sortByPlace = document.querySelectorAll(".sortOne__optns__place__item");
const tableItemTag = document.querySelectorAll(".tableItemTag");

const pages = document.querySelectorAll(".pageBoxItemNum");
const pageMove = document.querySelectorAll(".pageMove");
const totalPages = 12;

const maxEntries = document.querySelector(".maxEntriesInput");

class Confirmation {
  constructor(dialogBoxType, question, yesCallback, noCallback) {
    const frameA = document.createElement("frame-a");
    const frameB = document.createElement("frame-b");
    const framesStack = document.createElement("frames-stack");
    const selectionConfirmationIcon = document.createElement(
      "selection-confirmation-icon"
    );
    const confirmation = document.createElement("h3");
    const areYouSure = document.createElement("div");
    const confirmationDialog = document.createElement("div");

    const toggleFrame = document.createElement("div");
    const no = document.createElement("input");
    const toggleFrame1 = document.createElement("div");
    const yes = document.createElement("div");

    frameA.classList.add("frame-a");
    frameB.classList.add("frame-b");
    framesStack.classList.add("frames-stack");
    selectionConfirmationIcon.classList.add("selection-confirmation-icon");
    confirmation.classList.add("confirmation");
    areYouSure.classList.add("are-you-sure");
    confirmationDialog.classList.add("confirmation-dialog");
    toggleFrame.classList.add("toggle-frame");
    no.classList.add("no");
    toggleFrame1.classList.add("toggle-frame1");
    yes.classList.add("yes");

    confirmation.innerText = dialogBoxType;
    areYouSure.innerText = question;
    no.placeholder = "No";
    yes.innerText = "Yes";

    toggleFrame.appendChild(no);
    toggleFrame1.appendChild(yes);
    confirmationDialog.appendChild(toggleFrame);
    confirmationDialog.appendChild(toggleFrame1);
    frameB.appendChild(framesStack);
    frameB.appendChild(selectionConfirmationIcon);
    frameB.appendChild(confirmation);
    frameB.appendChild(areYouSure);
    frameB.appendChild(confirmationDialog);
    frameA.appendChild(frameB);
    this.dialogBox = frameA;
    this.yes = yes;
    this.no = no;
    this.yesCallback = yesCallback;
    this.noCallback = noCallback;
    this.yes.addEventListener("click", this.yesCallback);
    this.no.addEventListener("click", this.noCallback);
  }
  getDialogBox() {
    return this.dialogBox;
  }
}

sortByDate.forEach((item) => {
  item.addEventListener("click", (e) => {
    sortByDate.forEach((item) => {
      if (item.classList.contains("sortOne__optns__date--selected")) {
        item.classList.remove("sortOne__optns__date--selected");
      } else {
        item.classList.add("sortOne__optns__date--selected");
      }
    });
  });
});

sortByPlace.forEach((item) => {
  item.addEventListener("click", (e) => {
    sortByPlace.forEach((item) => {
      if (item === e.currentTarget)
        item.classList.add("sortOne__optns__place--selected");
      else item.classList.remove("sortOne__optns__place--selected");
    });
  });
});

const totalButtons = 5;
let currentlyShowing = 1;
let currentPage = 5;

function changeSelected() {
  pages.forEach((item) => {
    if (item.innerHTML == currentPage) {
      item.classList.add("selectedPage");
    } else {
      item.classList.remove("selectedPage");
    }
  });
}

pageMove[0].addEventListener("click", (e) => {
  if (currentPage > 1) {
    currentPage--;
    pages.forEach((item) => {
      item.innerHTML = currentlyShowing;
      currentlyShowing++;
    });
  }
  changeSelected();
});
pageMove[1].addEventListener("click", (e) => {
  if (currentPage < totalPages) {
    currentPage++;
    if (currentlyShowing <= totalPages - totalButtons)
      currentlyShowing = currentPage;
    pages.forEach((item) => {
      item.innerHTML = currentlyShowing;
      currentlyShowing++;
    });
  }
  changeSelected();
});

document.querySelector(".pagination").appendChild(
  new Confirmation(
    "Question",
    "Are you sure to do this",
    () => {},
    () => {}
  ).getDialogBox()
);
