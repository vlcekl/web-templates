let data_global = {};

/*
  File reader
*/
document.querySelector("#read-button").addEventListener('click', function() {
	if(document.querySelector("#file-input").files.length == 0) {
		alert('Error : No file selected');
		return;
	}

	// new FileReader object
	const reader = new FileReader();

	// event fired when file reading finished
	reader.addEventListener('load', function(e) {
	    data_global = JSON.parse(e.target.result);  // Save to global object
	});

	// event fired when file reading failed
	reader.addEventListener('error', function() {
	    alert('Error : Failed to read file');
	});

	// file selected by user
	const file = document.querySelector("#file-input").files[0];
    console.log("my file: ", file.name, file.type, file.size);

	// read file as text file
	reader.readAsText(file);
});

/* Chartist.js charts */
const data_1 = data_global['data_1'];
const data_2 = data_global['data_2'];

new Chartist.Line('#chart-1', data_1);
new Chartist.Bar('#chart-2', data_2);
new Chartist.Line('#chart-3', data_2);

// Set up chartist resize observers
const chartist_obs = new ResizeObserver(entries => {
  entries.forEach(entry => {
    entry.target.__chartist__.update()
  })
});
const ctCharts = document.querySelectorAll(`.ct-chart`);
ctCharts.forEach(c => chartist_obs.observe(c));

/* Leaflet.js maps */
// Set up object for mapping from mapDiv to the inner map object
const mapMapping = new Map();

// Map USA
const mapDivUSA = document.getElementById('map-usa');
const mapUSA = L.map(mapDivUSA).setView([37.8, -96], 4);
const osmUSA = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapUSA);
mapMapping.set(mapDivUSA, mapUSA);

// Map Missouri
const mapDivMO = document.getElementById('map-mo');
const mapMO = L.map(mapDivMO).setView([38.627, -90.1994], 9);
const osmMO = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapMO);
mapMapping.set(mapDivMO, mapMO);

// Set up chartist resize observers
const leaflet_obs = new ResizeObserver(entries => {
  entries.forEach(entry => {
    mapMapping.get(entry.target).invalidateSize()
  })
});
const leafletMaps = document.querySelectorAll('.leaflet-map');
leafletMaps.forEach(c => leaflet_obs.observe(c));