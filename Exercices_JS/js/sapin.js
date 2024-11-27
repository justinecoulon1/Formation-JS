const size = document.querySelector('#sapin_size');
const validateSizeButton = document.querySelector('.sapin_size_btn');
const validateSizePixelArtButton = document.querySelector('.sapin_pixelart_size_btn');
const drawingDiv = document.querySelector('.drawing_div')

validateSizeButton.addEventListener('click', function () {
    drawingDiv.innerHTML = "";
    let sizeValue = size.valueAsNumber;
    for (let i = 0; i < sizeValue; i++) {
        let string = "";
        const row = document.createElement('pre');
        row.textContent = string;
        for (let j = 0; j < (sizeValue - 2 - i); j++) {
            string = string.concat(" ");
        }

        drawingDiv.append(row);
        string = string.concat("*".repeat(2 * i + 1))

        row.textContent = string;

        if (i === (sizeValue - 1)) {
            string = "";
            string = string.concat(" ".repeat(sizeValue - 2));
            string = string.concat("#");
        }
        row.textContent = string;
        drawingDiv.append(row);
    }
})


validateSizePixelArtButton.addEventListener('click', function () {
    drawingDiv.innerHTML = "";
    let sizeValue = size.valueAsNumber;
    for (let i = 0; i < sizeValue; i++) {
        const row = document.createElement('div');
        row.classList.add('row');

        for (let j = 0; j < (sizeValue - 2 - i); j++) {
            const whitePixel = document.createElement('div');
            whitePixel.classList.add('white_pixel');
            row.append(whitePixel);
        }

        for (let j = 0; j < 2 * i + 1; j++) {
            const greenPixel = document.createElement('div');
            greenPixel.classList.add('green_pixel');
            row.append(greenPixel);
        }

        if (i === (sizeValue - 1)) {
            row.innerHTML = "";
            for (let j = 0; j < sizeValue - 2; j++) {
                const whitePixel = document.createElement('div');
                whitePixel.classList.add('white_pixel');
                row.append(whitePixel);
            }
            const brownPixel = document.createElement('div');
            brownPixel.classList.add('brown_pixel');
            row.append(brownPixel);
        }

        drawingDiv.append(row);
    }
})
