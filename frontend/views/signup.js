document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(".inp input");
  const loginBtn = document.querySelector(".btn");

  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      const label = this.nextElementSibling;
      label.classList.toggle("up", this.value.trim() !== "");
    });
  });

  loginBtn.addEventListener("click", function () {
    authorizeUser();
  });

  function authorizeUser() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    const username = usernameInput.value;
    const password = passwordInput.value;
    if (username.trim() !== "" && password.trim() !== "") {
      usernameInput.style.border = "2px solid red";
      passwordInput.style.border = "2px solid red";
      usernameInput.classList.remove("error-border");
      passwordInput.classList.remove("error-border");

    } else {
      usernameInput.style.border = "2px solid red";
      passwordInput.style.border = "2px solid red";
      usernameInput.classList.add("error-border");
      passwordInput.classList.add("error-border");

    }
  }

  function focusinp(inp) {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    if (inp === "usr") {
      usernameInput.focus();
    } else if (inp === "pass") {
      passwordInput.focus();
    } else {
      usernameInput.focus();
    }
  }
});
