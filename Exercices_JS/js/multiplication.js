const number = document.querySelector('#number');
const count = document.querySelector('#count');
const resultButton = document.querySelector('.multiplication_result_btn');
const resultDiv = document.querySelector('.multiplication_result');

resultButton.addEventListener('click', function () {
    // resultDiv.innerHTML = "";
    // let currentElements = resultDiv.children;
    // console.log(currentElements)
    // while (resultDiv.firstElementChild) {
    //     resultDiv.firstElementChild.remove();
    // }
    resultDiv.replaceChildren();

    let myNumber = number.valueAsNumber;
    let myCount = count.valueAsNumber;

    for (let i = 0; i < myCount; i++) {
        let result = (myNumber * (i + 1));
        let tempResultP = document.createElement('p');
        tempResultP.textContent = `${myNumber} x ${i + 1} = ${result}`; myNumber + "x"
        tempResultP.id = i;
        resultDiv.append(tempResultP);
    }
})