const buttons = document.querySelectorAll('.btn');
const display = document.querySelector('.display');
let currentMode = 'binary'; // Default mode
let currentExpression = ''; // To hold the full mathematical expression

// Function to switch calculator mode
function switchMode(newMode) {
  currentMode = newMode;
  document.querySelector('.calculator').className = `calculator ${newMode}-mode`;
  display.textContent = '0'; // Reset display when changing modes
  document.querySelectorAll('.number').forEach(btn => {
    btn.disabled = newMode === 'binary' && !['0', '1'].includes(btn.textContent);
  });
}

// Function to evaluate the expression
function evaluateExpression(expression) {
  let result;
  try {
    if (currentMode === 'binary') {
      // Convert binary numbers to decimal for evaluation
      let decimalExpression = expression.split(' ').map(part => {
        if (part === '0' || part === '1') return part; // Binary literals
        // Handle operators
        if (['+', '-', '*', '/'].includes(part)) return part;
        try {
          // Convert binary string to decimal if it's an operand
          let decimalValue = parseInt(part, 2);
          return decimalValue;
        } catch (e) {
          console.error('Conversion error:', e);
          return 0;
        }
      }).join(' ');

      console.log(`Decimal Expression: ${decimalExpression}`); // Debugging line
      result = Function('"use strict";return (' + decimalExpression + ')')();
      console.log(`Decimal Result: ${result}`); // Debugging line

      // Check if result is valid number
      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid result');
      }

      return result.toString(2); // Convert result back to binary
    } else {
      result = Function('"use strict";return (' + expression + ')')();
      return result.toString();
    }
  } catch (error) {
    console.error('Error evaluating expression:', error);
    return 'Error';
  }
}

// Function to handle conversion between binary and decimal
function convert(conversionType, value) {
  if (conversionType === 'bin2dec') {
    return parseInt(value, 2).toString(10);
  } else {
    return parseInt(value, 10).toString(2);
  }
}

// Adding event listeners to buttons
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const btnValue = button.textContent;

    if (button.classList.contains('clear')) {
      currentExpression = '';
      display.textContent = '0';
    } else if (button.classList.contains('equals')) {
      console.log('Current Expression:', currentExpression); // Debugging line
      display.textContent = evaluateExpression(currentExpression);
      currentExpression = display.textContent; // Continue with the current result
    } else if (button.classList.contains('operator')) {
      if (currentExpression && !currentExpression.endsWith(' ')) {
        currentExpression += ` ${btnValue} `;
        display.textContent = currentExpression;
      }
    } else if (button.classList.contains('number') || button.classList.contains('convert')) {
      if (button.classList.contains('convert')) {
        display.textContent = convert(button.dataset.conv, display.textContent);
        currentExpression = display.textContent;
      } else {
        if (display.textContent === '0') {
          display.textContent = btnValue;
        } else {
          display.textContent += btnValue;
        }
        currentExpression += btnValue;
      }
    } else if (button.classList.contains('toggle-mode')) {
      switchMode(button.dataset.mode);
    }
  });
});

// Initialize to binary mode on load
switchMode('binary');
