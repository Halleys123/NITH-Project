// div > [span(absolute) + input + icondiv]
class InputField {
  constructor(placeholder, type) {
    this.div = document.createElement("div");
    this.div.classList.add("input-field");
    this.span = document.createElement("span");

    this.span.innerText = placeholder;
    this.span.classList.add("placeholder");

    this.input = document.createElement("input");
    this.input.type = type;

    this.icondiv = document.createElement("div");
    this.icondiv.classList.add("icon");

    this.div.appendChild(this.span);
    this.div.appendChild(this.input);
    this.div.appendChild(this.icondiv);
  }
  getValue() {
    return this.input;
  }
}
