console.log("signup.js loaded");
let form = document.querySelector(".form");

let username = new InputField("Username", "text");
let password = new InputField("Password", "password");
form.appendChild(username.input);
form.appendChild(password.input);
