// Catturo gli elementi
const buttons = document.querySelectorAll("button");
const displayExpressionLine = document.querySelector("#expression-line");
const displayInputLine = document.querySelector("#input-line");
const equalBtn = document.querySelector("#equal");
const resetBtn = document.querySelector("#reset");
const deleteBtn = document.querySelector("#delete");
const oppositeBtn = document.querySelector("#opposite");
const sqrtBtn = document.querySelector("#sqrt");

let isOn = false;
let isEqualPressed = false;
let operation = [undefined, undefined];

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
  operation = [undefined, undefined];
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
    reset();
    displayExpressionLine.textContent = "";
    isEqualPressed = false;
  }
  if (currentInput.length < 13) {
    if (this.textContent === "." && String(currentInput).includes(".")) return;
    currentInput += `${this.textContent}`;
    displayInputLine.textContent = currentInput;
  }
}

deleteBtn.onclick = () => {
  if (isEqualPressed) {
    reset();
    displayExpressionLine.textContent = "";
    displayInputLine.textContent = "0";
    isEqualPressed = false;
  } else if (currentInput !== "") {
    currentInput = currentInput.substr(0, currentInput.length - 1);
    displayInputLine.textContent = currentInput;
  }
};

// Opposite button
oppositeBtn.onclick = () => {
  result = Number(displayInputLine.textContent) * -1;
  displayInputLine.textContent = result;
  console.log(result, currentInput);
};

// Main operations
for (let i = 0; i < buttons.length; i++) {
  if (buttons[i].getAttribute("data-type") === "operation") {
    buttons[i].addEventListener("click", selectOperation);
  }
}

function selectOperation() {
  if (!isOn) return;
  if (this.textContent.trim() !== "/") {
    operationSymbol = this.textContent.trim();
  } else {
    operationSymbol = "÷";
  }

  if (isEqualPressed) {
    isEqualPressed = false;
    storedInput = result;
    currentInput = "";
    displayExpressionLine.textContent = storedInput + operationSymbol;
    operation.push(this.getAttribute("id"));
    operation.shift();
  } else {
    operation.push(this.getAttribute("id"));
    operation.shift();
    displayExpressionLine.textContent += currentInput + operationSymbol;
  }

  if (storedInput === "") {
    storedInput = currentInput;
    currentInput = "";
  }

  if (currentInput !== "") {
    calculate(storedInput, currentInput, operation[0]);
    storedInput = result;
    displayInputLine.textContent = result;
  }

  currentInput = "";
}

equalBtn.addEventListener("click", function () {
  if (!isOn) return;
  if (storedInput == "") {
    result = currentInput;
  } else {
    calculate(storedInput, currentInput, operation[1]);
  }
  displayInputLine.textContent = result;
  displayExpressionLine.textContent += `${currentInput}=`;
  isEqualPressed = true;
});

// Calculation functions
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

// Other operations
sqrtBtn.onclick = () => {};
