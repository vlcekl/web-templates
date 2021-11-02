document.querySelector("#read-button").addEventListener('click', function() {
	if(document.querySelector("#file-input").files.length == 0) {
		alert('Error : No file selected');
		return;
	}

	// file selected by user
	let file = document.querySelector("#file-input").files[0];

  console.log("my file: ", file.name, file.type, file.size);

	// new FileReader object
	let reader = new FileReader();

	// event fired when file reading finished
	reader.addEventListener('load', function(e) {
	   // contents of the file
	    let text = e.target.result;
      console.log(text);

      // Preprocess into data items and store in sesssionStorage
      sessionStorage.setItem('data', text);
      data = JSON.parse(text);
      Object.entries(data).forEach(p => {
        console.log(`Key: ${p[0]}, Value: ${p[1]}`);
        sessionStorage.setItem(p[0], JSON.stringify(p[1]));
      })

      a = sessionStorage.getItem('b');
	    document.querySelector("#file-contents").textContent = a;
	});

	// event fired when file reading failed
	reader.addEventListener('error', function() {
	    alert('Error : Failed to read file');
	});

	// read file as text file
	reader.readAsText(file);
});

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

// Chartist.js charts
new Chartist.Line('#chart-1', data_1);
new Chartist.Bar('#chart-2', data_2);
new Chartist.Line('#chart-3', data_3);

// Update newly visible charts when tabs are changed
const radios = document.querySelectorAll('input[type=radio]');
radios.forEach(radio => radio.addEventListener('change', (event) => {
    const sec = event.currentTarget.value;
    const charts = document.querySelectorAll(`#${sec} .ct-chart`);
    charts.forEach(c => c.__chartist__.update())
}))

// Leaflet.js map
var mymap = L.map('mapid').setView([37.8, -96], 4);

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);
