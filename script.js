// Catturo gli elementi
const buttons = document.querySelectorAll("button");
const displayExpressionLine = document.querySelector("#expression-line");
const displayInputLine = document.querySelector("#input-line");
const equalBtn = document.querySelector("#equal");
const resetBtn = document.querySelector("#reset");
const deleteBtn = document.querySelector("#delete");

let isOn = false;
let isEqualPressed = false;

// Power on and reset
resetBtn.onclick = () => {
  isOn = true;
  reset();
  displayExpressionLine.textContent = "";
  displayInputLine.textContent = "0";
};

function reset() {
  result = 0;
  currentInput = "";
  storedInput = "";
  operationSymbol = "";
}

// Display input
for (let i = 0; i < buttons.length; i++) {
  if (buttons[i].classList.contains("digit")) {
    buttons[i].addEventListener("click", typeNumber);
  }
}

function typeNumber() {
  if (!isOn) return;
  if (isEqualPressed) {
    displayExpressionLine.textContent = "";
    isEqualPressed = false;
  }
  if (currentInput === "") {
    displayInputLine.textContent = "";
  }
  if (currentInput.length < 13) {
    currentInput += `${this.textContent}`;
    displayInputLine.textContent = currentInput;
  }
}

deleteBtn.onclick = () => {
  if (currentInput !== "")
    currentInput = currentInput.substr(0, currentInput.length - 1);
  displayInputLine.textContent = currentInput;
};

// Operazioni
for (let i = 0; i < buttons.length; i++) {
  if (buttons[i].getAttribute("data-type") === "operation") {
    buttons[i].addEventListener("click", function () {
      if (!isOn) return;

      console.log(this.textContent);
      if (this.textContent.trim() !== "/") {
        operationSymbol = this.textContent;
      } else {
        operationSymbol = ":";
      }

      displayExpressionLine.textContent += `${
        currentInput + operationSymbol.trim()
      }`;
      if (storedInput === "") {
        storedInput = currentInput;
      } else {
        calculate(storedInput, currentInput, operation);
        storedInput = result;
        displayInputLine.textContent = result;
      }
      currentInput = "";
      operation = this.getAttribute("id");
    });
  }
}

equalBtn.addEventListener("click", function () {
  if (!isOn) return;
  calculate(storedInput, currentInput, operation);
  displayExpressionLine.textContent += `${currentInput}=`;
  displayInputLine.textContent = result;
  reset();
  isEqualPressed = true;
});

function calculate(a, b, c) {
  switch (c) {
    case "divide":
      divide(a, b);
      break;
    case "multiply":
      multiply(a, b);
      break;
    case "subtract":
      subtract(a, b);
      break;
    case "sum":
      sum(a, b);
      break;
  }
}

function divide(a, b) {
  result = a / b;
  let resultString = String(result).length;

  if (resultString > 13) {
    result = result.toFixed(13 - (String(result.toFixed()).length + 1));
  }
  return result;
}
function multiply(a, b) {
  result = a * b;
  return result;
}

function subtract(a, b) {
  result = a - b;

  return result;
}

function sum(a, b) {
  result = +a + +b;
  return result;
}
