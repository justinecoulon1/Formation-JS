const pTimer = document.querySelector('#time');
const startBtn = document.querySelector('#start_chronometer_button');
const stopBtn = document.querySelector('#stop_chronometer_button');
const pauseBtn = document.querySelector('#pause_chronometer_button');

pTimer.textContent = "00:00:00:00";
stopBtn.toggleAttribute('disabled')
let interval = setInterval(function () { });

startBtn.addEventListener('click', function () {
    let startTime = new Date().getTime();
    startBtn.toggleAttribute('disabled');
    stopBtn.toggleAttribute('disabled')

    interval = setInterval(function () {
        let differenceInSeconds = (new Date().getTime() - startTime) / 1000;
        let convertedSeconds = convertSeconds(differenceInSeconds);
        pTimer.textContent = convertedSeconds;
    })
})

stopBtn.addEventListener('click', function () {
    clearInterval(interval);
    startBtn.toggleAttribute('disabled');
    stopBtn.toggleAttribute('disabled')
})

// pauseBtn.addEventListener('click', function () { })

function convertSeconds(differenceInSeconds) {
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let days = 0;
    let temp = 0;

    seconds = Math.floor(differenceInSeconds % 60);
    temp = differenceInSeconds / 60;
    minutes = Math.floor(temp % 60);
    temp = temp / 60;
    hours = Math.floor(temp % 24);
    days = Math.floor(temp / 24);

    let secondsString = seconds.toString();
    let minutesString = minutes.toString();
    let hoursString = hours.toString();
    let daysString = days.toString();

    return `${daysString.padStart(2, '0')}:${hoursString.padStart(2, '0')}:${minutesString.padStart(2, '0')}:${secondsString.padStart(2, '0')}`
}