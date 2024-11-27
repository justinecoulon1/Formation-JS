const n1 = document.querySelector('#n1');
const n2 = document.querySelector('#n2');
const operator = document.querySelector('#operator');
const pResult = document.querySelector('#result');
const resultBtn = document.querySelector('#result_btn');

resultBtn.addEventListener('click', function () {
    if (isNaN(n1.valueAsNumber) && isNaN(n2.valueAsNumber)) {
        pResult.textContent = `Veuillez entrer un nombre`
    } else if (operator.value === '+') {
        const result = n1.valueAsNumber + n2.valueAsNumber;
        pResult.textContent = `Le résultat est : ${result}`
    } else if (operator.value === '-') {
        const result = n1.valueAsNumber - n2.valueAsNumber;
        pResult.textContent = `Le résultat est : ${result}`
    } else if (operator.value === '*') {
        const result = n1.valueAsNumber * n2.valueAsNumber;
        pResult.textContent = `Le résultat est : ${result}`
    } else {
        if (n2.valueAsNumber === 0) {
            pResult.textContent = `Operation impossible`
        } else {
            const result = n1.valueAsNumber / n2.valueAsNumber;
            pResult.textContent = `Le résultat est :  ${result}`
        }
    }
})