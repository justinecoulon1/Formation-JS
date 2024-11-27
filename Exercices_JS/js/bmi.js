const weightInput = document.querySelector('#weightInput');
const heightInput = document.querySelector('#heightInput');
const submitBtn = document.querySelector('#submitBtn');
const response = document.querySelector('#response');

const burgerBtn = document.querySelector('#burger-btn');
const menuDiv = document.querySelector('.menu-div');


submitBtn.addEventListener('click', function () {
    const weightInputValue = weightInput.valueAsNumber;
    const heightInputValue = heightInput.valueAsNumber;
    const convertedHeight = heightInputValue / 100;
    const imc = weightInputValue / (convertedHeight * convertedHeight);
    // response.textContent = 'Votre IMC est ' + imc.toFixed(2)
    response.textContent = `Votre IMC est ${imc.toFixed(2)}`
});

burgerBtn.addEventListener('click', function () {
    menuDiv.classList.toggle('visible')
})