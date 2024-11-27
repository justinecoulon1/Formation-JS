const date1 = document.querySelector('#date1');
const date2 = document.querySelector('#date2');
const calendarResultBtn = document.querySelector('#calendar_result_btn');
const pCalendarResult = document.querySelector('#calendar_result_p');

calendarResultBtn.addEventListener('click', function () {
    const firstDateValue = date1.valueAsDate;
    const secondDateValue = date2.valueAsDate;

    if (firstDateValue === null || secondDateValue === null) {
        pCalendarResult.textContent = `Veuillez entrer une date`
    } else {
        let differenceInDays = (firstDateValue - secondDateValue) / 86400000;
        pCalendarResult.textContent = `Le résultat est :  ${Math.abs(differenceInDays)} jour de différence`;
    }
})