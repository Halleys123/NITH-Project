document.addEventListener("DOMContentLoaded", function() {
    const inputs = document.querySelectorAll(".inp input");

    inputs.forEach(input => {
        input.addEventListener("input", function() {
            const label = this.nextElementSibling;
            label.classList.toggle("up", this.value.trim() !== "");
        });
    });
});

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
