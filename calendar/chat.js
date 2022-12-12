// Calendar generation function
function generateCalendar(month, year) {
  // Create an array of all the days in the month
  var days = [];
  var numDays = new Date(year, month, 0).getDate();
  for (var i = 1; i <= numDays; i++) {
    days.push(i);
  }
  
  // Generate the calendar HTML
  var calendarHTML = '<table>';
  calendarHTML += '<thead><tr><th colspan="7">';
  calendarHTML += month + ' ' + year;
  calendarHTML += '</th></tr></thead><tbody><tr>';
  
  // Add the days of the week to the calendar
  var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekdays.forEach(function(weekday) {
    calendarHTML += '<td>' + weekday + '</td>';
  });
  
  // Add the days of the month to the calendar
  calendarHTML += '</tr><tr>';
  for (var i = 0; i < days.length; i++) {
    if (i % 7 === 0 && i > 0) {
      calendarHTML += '</tr><tr>';
    }
    calendarHTML += '<td>' + days[i] + '</td>';
  }
  calendarHTML += '</tr></tbody></table>';
  
  return calendarHTML;
}

// Form submission event listener
document.getElementById('calendar-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  var month = document.getElementById('month').value;
  var year = document.getElementById('year').value;
  
  var calendarHTML = generateCalendar(month, year);
  document.getElementById('calendar').innerHTML = calendarHTML;
});

