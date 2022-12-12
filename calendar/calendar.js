// Overall function (to be converted to module)
function getCalendarData(startDate, endDate) {

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
    const nMonth = dateEnd.getMonth() - firstMonth + 1 + 12 * nYear;

    // Create array of year&month items to display in calendar
    monthData = [];
    for (let i = firstMonth; i < firstMonth + nMonth; i++) {
        monthData.push([firstYear + Math.floor(i / 12),
        i % 12, monthName[i % 12]]);
    }

    // Create array of first/last weekdays for each month
    const x = new Date();
    dayData = monthData.map(m => {
        console.log('month data', m);
        x.setUTCFullYear(m[0]);
        x.setUTCMonth(m[1]);
        x.setUTCDate(1);
        let lastDay = new Date(m[0], m[1] + 1, 0).getDate();
        return [x.getUTCDay(), lastDay];
    })

    return { "months": monthData, "days": dayData };
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
        title.textContent = `${m[2]} ${m[0]}`;

        // Add days with their numbers into correct day divs
        let daysdiv = clon.querySelector('.calendar__days');

        let mDays = [];
        for (let j = 0; j < data.days[i][0]; j++) {
            mDays.push(`<div></div>`);
        }
        for (let j = 1; j <= data.days[i][1]; j++) {
            mDays.push(`<div data-year=${m[0]} data-month=${m[1]}>${j}</div>`);
        }

        daysdiv.innerHTML = mDays.join('');

        months.appendChild(clon);
    });

    calendar.appendChild(months);
}

// Run code

const calData = getCalendarData('2022-10-26 CDT', '2023-01-15 CDT');

const calEvents = {
    "2022-10-28": ['interview 1', 'interview 2'],
    "2023-01-20": ['review']
 };

const calendar = document.querySelector('.calendar__body');

// Create calendar content using month template
createCalendar(calendar, calData);

// Add colors according to calEvents

// Add click listener to calendar 
calendar.addEventListener('click', e => {
    let year = parseInt(e.target.dataset.year);
    let month = parseInt(e.target.dataset.month);
    let day = parseInt(e.target.textContent);
    console.log(year, month + 1, day);
    //alert(`${year}-${month+1}-${day}`);
});

// Create objects of day info and color selected days based on the info type

