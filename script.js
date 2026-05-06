const keys = document.querySelector('.container-bottom');
const display = document.querySelector('.display');
const calculator = document.querySelector('.calculator');
const previousKey = calculator.dataset.previousKey;

keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const key = e.target;
        const action = key.dataset.action;
        const keyContent = key.textContent;
        const displayed = display.textContent;
        let first = calculator.dataset.first;
        let operator = calculator.dataset.operator;
        let second = displayed
        console.log(calculator.dataset.previousKey);
        //when a number is clicked, display number
        if (!action) {
            if (displayed === '0' || calculator.dataset.previousKey === 'operators') {
                display.textContent = keyContent;
                calculator.dataset.previousKey = 'numbers'
            } else {
                display.textContent += keyContent;
            }
        }
        //when action is clicked, remember action
        if (action === 'add' || action === 'subtract' ||
            action === 'multiply' || action === 'divide') {
            if (first && operator && calculator.dataset.previousKey !== 'operators') {
                const temporaryCalc = calculate(first, operator, second);
                if (temporaryCalc === 'ERROR') {
                    delete calculator.dataset.first;
                } else calculator.dataset.first = temporaryCalc;
                display.textContent = temporaryCalc;
            } else {
                calculator.dataset.first = displayed;
            }
            console.log(action);
            calculator.dataset.operator = action;
            calculator.dataset.previousKey = 'operators';
        }
        //add/remove negative in front of number
        if (action === 'plus-minus') {
            display.textContent = displayed * -1;
            calculator.dataset.previousKey = 'plus-minus';
        }
        //decimals, prevent more than one decimal
        if (action === 'dot') {
            if (calculator.dataset.previousKey === 'operators') {
                display.textContent = '0.';
            } else if (!displayed.includes('.')) {
                display.textContent += '.';
            }
            calculator.dataset.previousKey = 'dot';
        }
        //when equal sign is clicked, calculate
        if (action === 'equals') {
            first = calculator.dataset.first;
            operator = calculator.dataset.operator;
            second = displayed;
            if (!operator) {
                display.textContent = displayed;
                console.log(display.textContent);
            } else if (first && operator && calculator.dataset.previousKey !== 'operators') {
                const temporaryCalc = calculate(first, operator, second);
                display.textContent = temporaryCalc;
                if (temporaryCalc === 'ERROR') {
                    delete calculator.dataset.first;
                } else calculator.dataset.first = temporaryCalc;
            } else {
                display.textContent = calculate(first, operator, second);
            }
            calculator.dataset.previousKey = 'operators';
            delete calculator.dataset.first;
            delete calculator.dataset.operator;
        }
        //reset calculator
        if (action === 'clear') {
            display.textContent = 0;
            delete calculator.dataset.previousKey;
            delete calculator.dataset.first;
            delete calculator.dataset.operator;
        }
    }
})

function calculate(n1, op, n2) {
    n1 = parseFloat(n1);
    n2 = parseFloat(n2);
    let result = '';
    if (op === 'add') {
        result = n1 + n2;
    } else if (op === 'subtract') {
        result = n1 - n2;
    } else if (op === 'multiply') {
        result = n1 * n2;
    } else if (op === 'divide') {
        if (n2 === 0) {
            return result = 'ERROR'
        } else result = n1 / n2;
    }
    if (result.toString().length > 13) {
        result = result.toString().slice(0, 13);
    }
    return result;
}