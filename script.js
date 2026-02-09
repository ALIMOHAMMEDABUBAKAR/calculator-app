const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const sciButtons = document.querySelectorAll(".btn-sci");

const themeToggle = document.getElementById("themeToggle");
const body = document.body;

const memButtons = document.querySelectorAll(".btn-mem");
let memoryValue = 0;

const copyBtn = document.getElementById("copyBtn");

let currentInput = "";

// Copy button
copyBtn.addEventListener("click", () => {
    if (display.value === "") return;

    navigator.clipboard.writeText(display.value)
        .then(() => {
            copyBtn.textContent = "✅ Copied!";
            setTimeout(() => {
                copyBtn.textContent = "Copy";
            }, 1500);
        })
        .catch(() => {
            alert("Copy failed. Your browser may not support clipboard.");
        });
});

// Update display + Auto scroll
function updateDisplay() {
    display.value = currentInput;
    display.scrollLeft = display.scrollWidth;
}

// Operator checker
function isOperator(char) {
    return ["+", "-", "*", "/"].includes(char);
}

// Scientific Action
function scientificAction(action) {
    try {
        if (currentInput === "") return;

        let value = eval(currentInput);

        if (action === "sqrt") {
            value = Math.sqrt(value);
        } 
        else if (action === "square") {
            value = Math.pow(value, 2);
        } 
        else if (action === "sin") {
            value = Math.sin(value * Math.PI / 180);
        } 
        else if (action === "cos") {
            value = Math.cos(value * Math.PI / 180);
        } 
        else if (action === "tan") {
            value = Math.tan(value * Math.PI / 180);
        } 
        else if (action === "log") {
            value = Math.log10(value);
        } 
        else if (action === "ln") {
            value = Math.log(value);
        } 
        else if (action === "pi") {
            currentInput += Math.PI.toFixed(8);
            updateDisplay();
            return;
        }

        currentInput = value.toString();
        updateDisplay();

    } catch (error) {
        display.value = "Error";
        currentInput = "";
    }
}

// Add input safely
function addInput(value) {
    const lastChar = currentInput.slice(-1);

    // Prevent starting with operator except "-"
    if (currentInput === "" && isOperator(value) && value !== "-") {
        return;
    }

    // Prevent two operators together
    if (isOperator(lastChar) && isOperator(value)) {
        return;
    }

    // Prevent multiple dots in a number
    if (value === ".") {
        const parts = currentInput.split(/[\+\-\*\/\(\)]/);
        const lastNumber = parts[parts.length - 1];

        if (lastNumber.includes(".")) {
            return;
        }
    }

    // Prevent closing bracket without opening
    if (value === ")") {
        const openCount = (currentInput.match(/\(/g) || []).length;
        const closeCount = (currentInput.match(/\)/g) || []).length;

        if (closeCount >= openCount) {
            return;
        }

        if (isOperator(lastChar)) {
            return;
        }
    }

    // Prevent operator after "("
    if (isOperator(value) && lastChar === "(") {
        return;
    }

    currentInput += value;
    updateDisplay();
}

// Calculate
function calculate() {
    try {
        const lastChar = currentInput.slice(-1);

        if (isOperator(lastChar) || lastChar === "(") {
            return;
        }

        // Auto close brackets
        const openCount = (currentInput.match(/\(/g) || []).length;
        const closeCount = (currentInput.match(/\)/g) || []).length;

        let expression = currentInput;

        if (openCount > closeCount) {
            expression += ")".repeat(openCount - closeCount);
        }

        const result = eval(expression).toString();

        currentInput = result;
        updateDisplay();
    } catch (error) {
        display.value = "Error";
        currentInput = "";
    }
}

// Event Listener for Scientific Buttons
sciButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-action");
        scientificAction(action);
    });
});

// Buttons click support
buttons.forEach((button) => {
    button.addEventListener("click", () => {

        if (button.id === "copyBtn") return;
        const value = button.textContent;

        if (value === "C") {
            currentInput = "";
            updateDisplay();
        }

        else if (value === "DEL") {
            currentInput = currentInput.slice(0, -1);
            updateDisplay();
        }

        else if (value === "=") {
            calculate();
        }

        else {
            addInput(value);
        }
    });
});

// Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "." ||
        key === "(" ||
        key === ")"
    ) {
        addInput(key);
    }

    else if (key === "Enter") {
        event.preventDefault();
        calculate();
    }

    else if (key === "Backspace") {
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }

    else if (key === "Escape") {
        currentInput = "";
        updateDisplay();
    }
});

// Theme toggle
themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
}

// Memory Logic
function handleMemory(action) {
    try {
        if (action === "mc") {
            memoryValue = 0;
            alert("Memory Cleared!");
        }

        else if (action === "mr") {
            currentInput = memoryValue.toString();
            updateDisplay();
        }

        else if (action === "mplus") {
            if (currentInput === "") return;
            memoryValue += eval(currentInput);
            alert("Added to Memory!");
        }

        else if (action === "mminus") {
            if (currentInput === "") return;
            memoryValue -= eval(currentInput);
            alert("Subtracted from Memory!");
        }
    } catch (error) {
        display.value = "Error";
        currentInput = "";
    }
}

memButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-mem");
        handleMemory(action);
    });
});
