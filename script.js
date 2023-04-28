// Catturo gli elementi
const buttons = document.querySelectorAll("button");
const displayExpressionLine = document.querySelector("#expression-line");
const displayInputLine = document.querySelector("#input-line");
const equalBtn = document.querySelector("#equal");
const resetBtn = document.querySelector("#reset");
const deleteBtn = document.querySelector("#delete");
const oppositeBtn = document.querySelector("#opposite");
const sqrtBtn = document.querySelector("#sqrt");
const factorialBtn = document.querySelector("#factorial");

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
    buttons[i].addEventListener("click", function () {
      let btn = this.textContent;
      typeNumber(btn);
    });
  }
}

document.addEventListener("keypress", (e) => {
  let keyboardInput = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
  let keyboardOperation = ["+", "-", "*", "/"];
  if (keyboardInput.includes(e.key)) {
    typeNumber(e.key);
  }
  if (keyboardOperation.includes(e.key)) {
    typeNumber(e.key);
  }
});

function typeNumber(digit) {
  if (!isOn) return;
  if (isEqualPressed) {
    reset();
    displayExpressionLine.textContent = "";
    isEqualPressed = false;
  }
  if (currentInput.length < 13) {
    if (digit === "." && String(currentInput).includes(".")) return;
    currentInput += `${digit}`;
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
  } else {
    displayExpressionLine.textContent += currentInput + operationSymbol;
    checkOperationSymbolNumber();
    checkExpressionLineLenght(displayExpressionLine.textContent);
  }

  operation.push(this.getAttribute("id"));
  operation.shift();

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
  if (!isOn || isEqualPressed) return;
  if (storedInput == "") {
    result = currentInput;
  } else {
    calculate(storedInput, currentInput, operation[1]);
  }
  displayInputLine.textContent = result;
  displayExpressionLine.textContent += `${currentInput}=`;
  checkExpressionLineLenght(displayExpressionLine.textContent);
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
  result = checkResultLenght(result);
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

oppositeBtn.onclick = () => {
  result = Number(displayInputLine.textContent) * -1;
  currentInput = result;
  displayInputLine.textContent = result;
};

sqrtBtn.onclick = () => {
  result = Number(displayInputLine.textContent);
  if (result < 0) {
    displayInputLine.textContent = "error";
    reset();
  } else {
    result = Math.sqrt(result);
    displayInputLine.textContent = result;
    storedInput = result;
  }
  isEqualPressed = true;
};

factorialBtn.onclick = () => {
  result = Number(displayInputLine.textContent);
  if (result % 1 !== 0) {
    displayInputLine.textContent = "only integer";
    reset();
  } else {
    if (result === 0 || result === 1) return 1;
    for (let i = result - 1; i >= 1; i--) {
      result *= i;
    }
    displayInputLine.textContent = result;
    storedInput = result;
  }
  isEqualPressed = true;
};

// Control function
function checkOperationSymbolNumber() {
  let displayString = displayExpressionLine.textContent;
  let displayLastChar = displayString.toString().slice(-2, -1);
  if (
    displayLastChar === "+" ||
    displayLastChar === "-" ||
    displayLastChar === "x" ||
    displayLastChar === "÷"
  ) {
    displayExpressionLine.textContent =
      displayString.slice(0, -2) + displayString.slice(-1);
  }
}

function checkResultLenght(result) {
  let resultString = String(result).length;
  if (resultString > 13) {
    result = result.toExponential(7);
  }
  return result;
}

function checkExpressionLineLenght(exp) {
  if (exp.length > 29) {
    exp = "..." + exp.slice(exp.length - 26);
  }
  displayExpressionLine.textContent = exp;
}

// mettere input tastiera
// funzioni mancanti
// riduzione opacità con dito sul sensore
// spegnimento automatico
