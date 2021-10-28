function draw(id) {
  const canvas = document.getElementById(id);
  if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(197, 0, 0, 0.5)';
      ctx.fillRect(17, 20, 100, 100);
      ctx.fillStyle = 'rgba(-3, 200, 0, 0.5)';
      ctx.fillRect(37, 40, 100, 100);
      ctx.fillStyle = 'rgba(-3, 0, 200, 0.5)';
      ctx.fillRect(57, 60, 100, 100);
  }
}

//draw('mycanvas');
draw('mycanvas2');

// get data
const data_1 = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  series: [
    [4, 2, 4, 2, 0]
  ]
};

const data_2 = {
  labels: ['One', 'Two', 'Three', 'Four', 'Five'],
  series: [
    [7, 13, -1, 2, -8]
  ]
};

const data_3 = {
  labels: ['One', 'Two', 'Three', 'Four', 'Five'],
  series: [
    [7, 13, -1, 2, -8]
  ]
};

const options_3 = {
    width: 500,
    height: 500
}

// Make plots
new Chartist.Line('#chart-1', data_1);
new Chartist.Bar('#chart-2', data_2);
new Chartist.Line('#chart-3', data_3);

// Update newly visible charts when tabs are changed
const radios = document.querySelectorAll('input[type=radio][name="section-choice"]');
radios.forEach(radio => radio.addEventListener('change', (event) => {
    const sec = event.currentTarget.value;
    const charts = document.querySelectorAll(`#${sec} .ct-chart`);
    charts.forEach(c => c.__chartist__.update())
}))

//var mymap = L.map('mapid').setView([51.505, -0.09], 13);
var mymap = L.map('mapid').setView([37.8, -96], 4);


/*
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);
*/

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

