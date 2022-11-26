// Overall function (to be converted to module)
function getCalendarData(startDate, endDate) {

    // Lengths of individual months (February is for non-leap year)
    const monLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Is the year leap year?
    const leapYear = y => ((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0);

    // Return length of a month adjusted for leap years
    const monthLength = (m, y) => {
        return monLength[m] + ((m === 1 && leapYear[y]) ? 1 : 0);
    };

    // Month names
    const monthName = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
         'August', 'September', 'October', 'November', 'December'
    ];

    // Return all months/years between start and end dates
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
    monthData = [];
    for (let i = firstMonth; i < firstMonth + nMonth; i++) {
      monthData.push([firstYear + Math.floor(i / 12) ,
                       i % 12, monthName[i % 12]]);
    }

    // Create array of first/last weekdays for each month
    const x = new Date();
    dayData = monthData.map(m => {
        x.setUTCFullYear(m[0]);
        x.setUTCMonth(m[1]);
        x.setUTCDate(1);
        return [x.getUTCDay(), monthLength(m[1], m[0])];
    })

    return {"months": monthData, "days": dayData};
}

// Create a calendar element using html template of month
function createCalendar(calendar, data) {

  const monthTemplate = calendar.querySelector('template');
  const months = document.createDocumentFragment();

  // Generate months from templates
  data.months.forEach((m, i) => {
    let clon = monthTemplate.content.cloneNode(true);

    // Set title to Month/Year
    let title = clon.querySelector('.calendar__title');
    title.textContent = `${monthName[m[1]]} ${m[0]}`;

    // Add days with their numbers into correct day divs
    let daysdiv = clon.querySelector('.calendar__days');

    let monthDayDivs = [];

    daysdiv.innerHTML = monthDayDivs;

    months.appendChild(clon);
  });

  calendar.appendChild(months);
}

// Run code

const calData = getCalendarData('2022-10-26 CDT', '2023-01-15 CDT');

const calendar = document.querySelector('.calendar');

// Add click listener to calendar 
calendar.addEventListener('click', e => {
    console.log(e.target.id);
})

// Create calendar using month template
createCalendar(calendar = calendar, data = calData);