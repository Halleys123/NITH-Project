const inputs = document.querySelectorAll(".inp input");
const labels = document.querySelectorAll(".inp label");

const loginBtn = document.querySelector(".btn");

inputs.forEach((input) => {
  input.addEventListener("input", function (e) {
    const user = inputs[0].value;
    const pass = inputs[1].value;

    if (user.trim() !== "" && pass.trim() !== "") {
      loginBtn.removeAttribute("disabled");
    } else {
      loginBtn.setAttribute("disabled", true);
    }

    const currentLabel = labels[e.currentTarget.getAttribute("count") * 1];

    if (this.value.trim() !== "") {
      currentLabel.classList.add("up");
    } else {
      currentLabel.classList.remove("up");
    }
  });
});

loginBtn.addEventListener("click", function () {
  authorizeUser();
});

function authorizeUser() {
  const [borderUser, borderPass] = document.querySelectorAll(".inp");

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  const username = usernameInput.value;
  const password = passwordInput.value;
  if (username.trim() !== "" && password.trim() !== "") {
    borderUser.classList.remove("error-border");
    borderPass.classList.remove("error-border");
  } else {
    borderUser.classList.add("error-border");
    borderPass.classList.add("error-border");
  }
}
