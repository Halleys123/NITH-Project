const sortByDate = document.querySelectorAll(".sortOne__optns__date__item");
const sortByPlace = document.querySelectorAll(".sortOne__optns__place__item");
const tableItemTag = document.querySelectorAll(".tableItemTag");

const pages = document.querySelectorAll(".pageBoxItemNum");
const pageMove = document.querySelectorAll(".pageMove");
const totalPages = 12;

const maxEntries = document.querySelector(".maxEntriesInput");

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
