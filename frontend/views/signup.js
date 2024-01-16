document.addEventListener("DOMContentLoaded", function() {
    const inputs = document.querySelectorAll(".inp input");
    const loginBtn = document.querySelector(".btn");

    inputs.forEach(input => {
        input.addEventListener("input", function() {
            const label = this.nextElementSibling;
            label.classList.toggle("up", this.value.trim() !== "");
        });
    });

    loginBtn.addEventListener("click", function() {
        authorizeUser();
    });

    function authorizeUser() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username.trim() !== "" && password.trim() !== "") {
            alert("Authorization logic goes here!");
          
        } else {
            alert("Please enter both username and password");
        }
    }

    function focusinp(inp) {
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");

        if (inp === 'usr') {
            usernameInput.focus();
        } else if (inp === 'pass') {
            passwordInput.focus();
        } else {
            usernameInput.focus();
        }
    }
});
