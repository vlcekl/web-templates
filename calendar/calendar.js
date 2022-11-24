console.log('started');

const months = document.querySelectorAll('.calendar__month');


months.forEach(e => {
    e.addEventListener('click', () => e.style.backgroundColor = 'blue');
})

function getCalendarMonths(startDate, endDate) {
    // Take date range and create calendar
    const dateStart = new Date(startDate);
    const dateEnd = new Date(endDate);

    // Years 
    const firstYear = dateStart.getFullYear();
    const lastYear = dateEnd.getFullYear();
    const nYear = lastYear - firstYear;

    // Months
    const firstMonth = dateStart.getMonth();
    const lastMonth = dateEnd.getMonth();
    const nMonth = lastMonth - firstMonth + 1 + 12*nYear;

    // Create array of year&month items to display in calendar
    monthArray = [];
    for (let i = firstMonth; i < firstMonth + nMonth; i++) {
      monthArray.push([firstYear + Math.floor(i / 12) , i % 12]);
    }

    return monthArray;
}

// Lengths of individual months (February is for non-leap year)
const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// Is the year leap year?
const leapYear = y => ((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0);

function getCalendarDays(months) {

    const x = new Date();
    return months.map(m => {
        x.setUTCFullYear(m[0]);
        x.setUTCMonth(m[1]);
        x.setUTCDate(1);
        d = (m[1] === 1 && leapYear[m[0]]) ? 1 : 0;
        return [x.getUTCDay(), monthLength[m[1]] + d];
    })
}

const monthData = getCalendarMonths('2022-10-26 CDT', '2023-01-15');
const daysData = getCalendarDays(monthData);



