const keys = document.querySelector('.container-bottom');
const display = document.querySelector('.display-bottom');
const steps = document.querySelector('.display-top');
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

        console.log(calculator.dataset.previousKey === 'equals');
        //display
        if (keyContent === '.') {
            if (displayed === '0' || calculator.dataset.previousKey === 'equals') {
                display.textContent = '0.';
                console.log(display.textContent);
                calculator.dataset.previousKey = 'input';
            } else if (checkDecimal(displayed)) {
                //check current number got decimal or not
                display.textContent += '.';
            }
        } else if (displayed === '0' && (keyContent === '+' || keyContent === '-')) {
            //allow + and - be the first but prevent × and ÷ 
            display.textContent = keyContent;
        } else if (displayed === '0' || calculator.dataset.previousKey === 'equals') {
            if (action) {
                //continue calculating with previous answer
                display.textContent += keyContent;
            } else {
                //start a new calculation
                display.textContent = keyContent;
            }
            calculator.dataset.previousKey = 'input';
        } else if (keyContent === 'DEL') {
            //"backspace"
            display.textContent = displayed.slice(0, -1);
        } else {
            display.textContent += keyContent;
        }

        //calculate
        if (keyContent === '=') {
            steps.textContent = displayed;
            display.textContent = calculate(displayed);
            calculator.dataset.previousKey = 'equals';
        }

        //clear
        if (action === 'clear') {
            display.textContent = 0;
            steps.textContent = 0;
            delete calculator.dataset.previousKey;
            delete calculator.dataset.first;
            delete calculator.dataset.operator;
        }
    }
})

//check current number got decimal or not
function checkDecimal(str) {
    let value = values(str);
    if (!value[value.length - 1].includes('.')) {
        return true;
    }
}

//separate numbers by operators and put into array
function values(str) {
    let value = [];
    let prev;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '+' || str[i] === '-' ||
            str[i] === '×' || str[i] === '÷') {
            str = str.slice(0, i) + '|' + str.slice(i + 1);
        }
    }
    value = str.split('|');
    return value;
}

function calculate(input) {
    //calculate separately in "× ÷ - +" order
    let equation = [];
    let temporaryAns;
    for (let i = 0; i < input.length; i++) {
        //do × and ÷ first
        if (input[i] === '×') {
            //multiply
            //prevent ×÷
            if (input[i + 1] === '÷') {
                return 'ERROR';
            } else if ((input[i + 1] === '+' || input[i + 1] === '-') && input[i + 2]) {
                //put negative to front
                input = input[i + 1] + input.slice(0, i + 1) + input.slice(i + 2);
            }
            console.log(input);
            equation[0] = checkAdjacentNum(input, -1, 0, i - 1);
            equation[1] = checkAdjacentNum(input, 1, i + 1, input.length);
            temporaryAns = equation[0] * equation[1];
            input = input.slice(0, i - equation[0].length) +
                temporaryAns + input.slice(i + equation[1].length + 1);
            i = 0;
            console.log(equation);
        } else if (input[i] === '÷') {
            //divide
            //prevent ÷×
            if (input[i + 1] === '×') {
                return 'ERROR';
            }
            equation[0] = checkAdjacentNum(input, -1, 0, i - 1);
            equation[1] = checkAdjacentNum(input, 1, i + 1, input.length);
            console.log(equation);
            temporaryAns = equation[0] / equation[1];
            if (equation[1] === '0') {
                return 'ERROR';
            } else input = input.slice(0, i - equation[0].length) +
                temporaryAns + input.slice(i + equation[1].length + 1);
            i = 0;
        }
    }
    for (let i = 0; i < input.length; i++) {
        if (input[i] === '-') {
            //merge - and + (-+ and +- becomes -)
            if (input[i - 1] === '+') {
                input = input.slice(0, i - 1) + input.slice(i);
                i -= 1;
            } else if (input[i + 1] === '+') {
                input = input.slice(0, i + 1) + input.slice(i + 2);
            }
            //subtract
            equation[0] = checkAdjacentNum(input, -1, 0, i - 1);
            equation[1] = checkAdjacentNum(input, 1, i + 1, input.length);
            temporaryAns = equation[0] - equation[1];
            if (i === 0 || i === input.length) {
                break;
            } else if (temporaryAns < 0) {
                console.log(equation);
                console.log(input.slice(0, i - equation[0].length - 1));
                if (input.indexOf(equation[0]) === 0 && equation[0] !== '0') {
                    input = temporaryAns;
                } else {
                    input = input.slice(0, i - equation[0].length - 1) +
                    temporaryAns + input.slice(i + equation[1].length + 1);
                    i = 0;
                }
            } else {
                input = input.slice(0, i - equation[0].length) +
                temporaryAns + input.slice(i + equation[1].length + 1);
            }
        }
    }
    for (let i = 0; i < input.length; i++) {
        if (input[i] === String.fromCharCode(43)) {
            //merge - and + (-+ and +- becomes -)
            if (input[i - 1] === '-') {
                input = input.slice(0, i - 1) + input.slice(i);
            } else if (input[i + 1] === '-') {
                input = input.slice(0, i + 1) + input.slice(i + 2);
            }
            //add
            console.log(input);
            equation[0] = checkAdjacentNum(input, -1, 0, i - 1);
            equation[1] = checkAdjacentNum(input, 1, i + 1, input.length);
            if (input[0] === '-') {
                temporaryAns = equation[1] - equation[0];
                input = input.slice(0, i - equation[0].length - 1) +
                    temporaryAns + input.slice(i + equation[1].length + 1);
            } else {
                temporaryAns = +equation[0] + +equation[1];
                input = input.slice(0, i - equation[0].length) +
                    temporaryAns + input.slice(i + equation[1].length + 1);
            }
            i = 0;
        }
    }
    return input;
}

//check numbers before and after operator
function checkAdjacentNum(str, check, start, end) {
    if (check === -1) { //check number before operator
        for (let i = end; i >= start; i--) {
            if (str[i] === '+' || str[i] === '-' ||
                str[i] === '×' || str[i] === '÷') {
                console.log(str.slice(i + 1, end + 1));
                return str.slice(i + 1, end + 1);
            }
        }
        return str.slice(0, end + 1);
    }
    if (check === 1) { //check number after operator
        for (let i = start; i <= end; i++) {
            if (str[i] === '+' || str[i] === '-' ||
                str[i] === '×' || str[i] === '÷') {
                return str.slice(start, i);
            }
        }
        return str.slice(start, end);
    }
}