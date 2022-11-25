// Return all months/years between start and end dates
function getCalendarMonths(startDate, endDate) {
    // Take date range and create calendar
    const dateStart = new Date(startDate);
    const dateEnd = new Date(endDate);

    // Years 
    const firstYear = dateStart.getFullYear();
    const nYear = dateEnd.getFullYear() - firstYear;

    // Months
    const firstMonth = dateStart.getMonth();
    const nMonth = dateEnd.getMonth() - firstMonth + 1 + 12*nYear;

    // Create array of year&month items to display in calendar
    monthArray = [];
    for (let i = firstMonth; i < firstMonth + nMonth; i++) {
      monthArray.push([firstYear + Math.floor(i / 12) , i % 12]);
    }

    return monthArray;
}


// Return length of a month adjusted for leap years
function monthLength(m, y = 2022) {

  // Lengths of individual months (February is for non-leap year)
  const monLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Is the year leap year?
  const leapYear = y => ((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0);

  return monLength[m] + (m === 1 && leapYear[y]) ? 1 : 0;
}

function getCalendarDays(months) {

    const x = new Date();
    return months.map(m => {
        x.setUTCFullYear(m[0]);
        x.setUTCMonth(m[1]);
        x.setUTCDate(1);
        d = (m[1] === 1 && leapYear[m[0]]) ? 1 : 0;
        return [x.getUTCDay(), monthLength(m[1], m[0])];
    })
}

const monthData = getCalendarMonths('2022-10-26 CDT', '2023-01-15');
const daysData = getCalendarDays(monthData);

// Create a calendar element using html template of month
function createCalendar(calendar, monthTemplate) {

  const months = document.createDocumentFragment();

  // Generate months from templates
  data.months.forEach((m, i) => {
    let clon = monthTemplate.content.cloneNode(true);
    months.appendChild(clon);
  });

  calendar.appendChild(months);
}

// Create calendar using month template
createCalendar(
    calendar = calendar,
    monthTemplate = document.getElementById('calendar-month-template'),
    data = {months: monthData, days: daysData}
);

const calendar = document.querySelector('.calendar');

calendar.addEventListener('click', e => {
    console.log(e.target.id);
})