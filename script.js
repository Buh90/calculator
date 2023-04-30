// Elements capture
const solarCells = document.querySelector("#solar-cell");
const buttons = document.querySelectorAll("button");
const displayExpressionLine = document.querySelector("#expression-line");
const displayInputLine = document.querySelector("#input-line");
const equalBtn = document.querySelector("#equal");
const resetBtn = document.querySelector("#reset");
const deleteBtn = document.querySelector("#delete");
const oppositeBtn = document.querySelector("#opposite");
const memoryRecallBtn = document.querySelector("#mr");
const memoryPlusBtn = document.querySelector("#mplus");
const memoryMinusBtn = document.querySelector("#mminus");
const percentBtn = document.querySelector("#percent");
const powerBtn = document.querySelector("#power");
const sqrtBtn = document.querySelector("#sqrt");
const factorialBtn = document.querySelector("#factorial");

let isOn = false;
let isEqualPressed = false;
let operation = [undefined, undefined];
let storedMemory = 0;
let isMemoryPressed = false;

// Power on and reset
resetBtn.onclick = reset;

function reset() {
  isOn = true;
  setDefaulValue();
  displayExpressionLine.textContent = "";
  displayInputLine.textContent = "0";
}

function setDefaulValue() {
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

function typeNumber(digit) {
  if (!isOn) return;
  if (isEqualPressed) {
    setDefaulValue();
    displayExpressionLine.textContent = "";
    isEqualPressed = false;
  }
  if (currentInput.length < 13) {
    if (digit === "." && String(currentInput).includes(".")) return;
    currentInput += `${digit}`;

    // prevent zeros before the number
    if (currentInput[0] === "0") {
      if (currentInput.length > 1) {
        if (currentInput[1] === "0") {
          currentInput = currentInput.slice(0, 1);
        } else if (currentInput[1] !== "." && currentInput[1] !== "0") {
          currentInput = currentInput.replace(/^[0]*/g, "");
        }
      }
    } else if (currentInput[0] === ".") {
      currentInput = "0.";
    }

    displayInputLine.textContent = currentInput;
  }
  isMemoryPressed = false;
}

deleteBtn.onclick = deleteDigit;

function deleteDigit() {
  isMemoryPressed = false;
  if (isEqualPressed) {
    setDefaulValue();
    displayExpressionLine.textContent = "";
    displayInputLine.textContent = "0";
    isEqualPressed = false;
  } else if (currentInput !== "") {
    currentInput = currentInput.substr(0, currentInput.length - 1);
    displayInputLine.textContent = currentInput;
  }
}

// Main operations
for (let i = 0; i < buttons.length; i++) {
  if (buttons[i].getAttribute("data-type") === "operation") {
    buttons[i].addEventListener("click", function () {
      let operationSymbol;
      if (this.textContent.trim() === "/") {
        operationSymbol = "÷";
      } else if (this.innerHTML.trim() === "x<sup>y</sup>") {
        operationSymbol = "^";
      } else {
        operationSymbol = this.textContent.trim();
      }
      applyOperation(operationSymbol);
    });
  }
}

function applyOperation(operationSymbol) {
  if (!isOn) return;
  isMemoryPressed = false;
  let chosenOperation;
  if (operationSymbol === "+") chosenOperation = "sum";
  if (operationSymbol === "-") chosenOperation = "subtract";
  if (operationSymbol === "x") chosenOperation = "multiply";
  if (operationSymbol === "÷") chosenOperation = "divide";
  if (operationSymbol === "%") chosenOperation = "percent";
  if (operationSymbol === "^") chosenOperation = "power";

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

  operation.push(chosenOperation);
  operation.shift();

  if (storedInput === "") {
    storedInput = currentInput;
    currentInput = "";
  }

  if (currentInput !== "") {
    if (operation[1] === "percent") {
      if (operation[0] === "sum" || operation[0] === "subtract") {
        currentInput = (storedInput * currentInput) / 100;
      } else {
        currentInput = currentInput / 100;
      }
    }
    calculate(storedInput, currentInput, operation[0]);
    storedInput = result;
    displayInputLine.textContent = result;
  }

  currentInput = "";
}

equalBtn.addEventListener("click", calcResult);

function calcResult() {
  isMemoryPressed = false;
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
}

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
    case "power":
      power(a, b);
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

function power(a, b) {
  result = (+a) ** +b;
  return result;
}

// Other operations

oppositeBtn.onclick = () => {
  isMemoryPressed = false;
  result = Number(displayInputLine.textContent) * -1;
  currentInput = result;
  displayInputLine.textContent = result;
};

memoryPlusBtn.onclick = () => {
  storedMemory += Number(displayInputLine.textContent);
  currentInput = "";
};

memoryMinusBtn.onclick = () => {
  storedMemory -= Number(displayInputLine.textContent);
  currentInput = "";
};

memoryRecallBtn.onclick = () => {
  currentInput = "";
  if (isMemoryPressed) {
    storedMemory = 0;
    isMemoryPressed = false;
    reset();
    return;
  }
  displayInputLine.textContent = storedMemory;
  displayExpressionLine.textContent = "";
  isMemoryPressed = true;
};

sqrtBtn.onclick = () => {
  isMemoryPressed = false;
  result = Number(displayInputLine.textContent);
  if (result < 0) {
    displayInputLine.textContent = "error";
    setDefaulValue();
  } else {
    result = Math.sqrt(result);
    result = checkResultLenght(result);
    displayInputLine.textContent = result;
    storedInput = result;
  }
  isEqualPressed = true;
};

factorialBtn.onclick = () => {
  isMemoryPressed = false;
  result = Number(displayInputLine.textContent);
  if (result % 1 !== 0) {
    displayInputLine.textContent = "only integer";
    setDefaulValue();
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

solarCells.onmouseenter = () => {
  displayInputLine.classList.add("lightless");
  displayExpressionLine.classList.add("lightless");
};

solarCells.onmouseleave = () => {
  displayInputLine.classList.remove("lightless");
  displayExpressionLine.classList.remove("lightless");
};

// keyboard input
document.addEventListener("keypress", (e) => {
  equalBtn.focus();
  let keyboardInput = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
  let keyboardOperation = ["+", "-", "*", "/"];
  if (keyboardInput.includes(e.key)) {
    typeNumber(e.key);
  }
  if (keyboardOperation.includes(e.key)) {
    let operationSymbol;
    if (e.key === "+") operationSymbol = "+";
    if (e.key === "-") operationSymbol = "-";
    if (e.key === "*") operationSymbol = "x";
    if (e.key === "/") operationSymbol = "÷";
    applyOperation(operationSymbol);
  }
  if (e.key === "c" || e.key === "C") {
    deleteDigit();
    return;
  }
  if (e.key === "Enter") {
    calcResult();
  }
  if (e.key === "Delete") {
    reset();
  }
});

// automatic power off
let timer = setTimeout(powerOff, 10000);

document.addEventListener("click", powerOff);
document.addEventListener("keypress", powerOff);

function powerOff() {
  clearTimeout(timer);
  timer = setTimeout(function () {
    setDefaulValue();
    displayExpressionLine.textContent = "";
    displayInputLine.textContent = "";
    isOn = false;
  }, 10000);
}

// funzioni mancanti
