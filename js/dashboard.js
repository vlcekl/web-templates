/*
	Set up a simple reactive system.
	The ideas and reactive functionality mostly copied from
	https://piccalil.li/tutorial/build-a-light-and-global-state-system/
*/

// Set up an array of subscribers (general code)
window.subscribers = [];

// Proxy handler (general code)
const handler = {
  set(state, key, value) {
    const oldState = {...state};

    state[key] = value;

    window.subscribers.forEach(callback => callback(state, oldState));

    return state;
  }
}

// Initial state holding both data (empty) and default controls (dashboard-specific)
const defaultState = {
	data: { data_1: null, data_2: null },  // Start with empty dataset
	ctrl_1: 0.5, // Default values for dashboard controls
	ctrl_2: 0.5
};

// Create proxy holding the global state of the system
const state = new Proxy(defaultState, handler);


/*
	Read data file upon user request
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
	    state.data = JSON.parse(e.target.result);  // Save to global state proxy
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

/* 
	Populate select items using data
*/

// Create & subscribe callback populating grower select box
const grower_select = document.getElementById('grower-sel');
const populate_select = (state, oldState) => {
	if (typeof(state.data.growers) === "undefined"
	 || state.data.growers === oldState.data.growers) {
		return;
	}

	grower_select.options.length = 0;  // Reset 
	// Default disabled option
	grower_select.options[0] = new Option("Grower email...");
	grower_select.options[0].setAttribute('hidden', true);

	// Cycle through growers
	state.data.growers.forEach((g) => {
		grower_select.options[grower_select.options.length] = new Option(g)
	})
}
window.subscribers.push(populate_select);


/*
	Make plots and maps
*/

/* Chartist.js charts */
chart1 = new Chartist.Line('#chart-1', null);
chart2 = new Chartist.Bar('#chart-2', null);
chart3 = new Chartist.Line('#chart-3', null);

// Function factory making chart update callbacks
const update_charts = function(chart, dataset) {
	return (state, oldState) => {
		if (typeof(state.data[dataset]) === "undefined"
		 || state.data[dataset] === oldState.data[dataset]) { return; }
		chart.update(state.data[dataset]);
	}
}

// Define and subscribe callbacks updating chart data
window.subscribers.push(update_charts(chart1, 'data_1'));
window.subscribers.push(update_charts(chart2, 'data_2'));
window.subscribers.push(update_charts(chart3, 'data_2'));

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
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapUSA);
mapMapping.set(mapDivUSA, mapUSA);

// Map Missouri
const mapDivMO = document.getElementById('map-mo');
const mapMO = L.map(mapDivMO).setView([38.627, -90.1994], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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