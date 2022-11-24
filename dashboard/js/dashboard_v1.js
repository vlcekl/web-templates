/*
	Set up a simple global reactive/state system.
	The idea and code mostly copied from
	https://piccalil.li/tutorial/build-a-light-and-global-state-system/
*/

// Set up an array of subscribers
window.subscribers = [];

// Proxy holding the global state of the system. Initial state read from data
let state = new Proxy({}, {
	set(state, key, value) {
		const oldState = { ...state };

		success = Reflect.set(...arguments);
		console.log('proxy set', success);

		window.subscribers.forEach(callback => callback(state, oldState));

		return success;
	}
});

// Initialize state with values provided in a data object
// If props provided, check if data contains all required properties
const initState = function (data, reqProps = null) {
	// Validate properties against reqProps
	if (reqProps) {
		dataKeys = Object.keys(data);
		if (!reqProps.every(p => dataKeys.includes(p))) {
			return false;
		}
	}
	// Assign data properties into state Proxy
	Object.entries(data).forEach(entry => {
		state[entry[0]] = entry[1]
	})
	return true;
}

// Update top level object properties to fire the proxy
const updateState = function (prop) {
	if (!typeof (state[prop]) === "object") return;

	if (Array.isArray(state[prop])) {
		state[prop] = [...state[prop]]
	} else {
		state[prop] = { ...state[prop] }
	}
}

// Check if state has changed (if not, a callback can be exited right away)
const hasChangedState = function (state, oldState, prop) {
	if (typeof (state[prop]) === "undefined" || state[prop] === oldState[prop]) {
		return false
	}
	return true
}


/* ---------------------------------------
	Read data file upon user request
------------------------------------------*/

// Required properties in the loaded dataset
const reqProps = ['inputGrowers', 'inputSlider', 'data1', 'data2'];

document.querySelector("#load-button").addEventListener('click', () => {

	// new FileReader object
	const reader = new FileReader();

	// event fired when file reading finished
	reader.addEventListener('load', e => {
		// Validate and initialize global state with data from the file
		try {
			loaded_data = JSON.parse(e.target.result);
		} catch {
			alert('Error : Loaded file cannot be parsed');
		}
		if (!initState(loaded_data, reqProps)) {
			alert('Error : Loaded file does not contain required data');
		};
	});

	// event fired when file reading failed
	reader.addEventListener('error', () => {
		alert('Error : Failed to read file');
	});

	const files = document.querySelector("#file-input").files;
	if (files.length == 0) {
		alert('Error : No file selected');
		return;
	}

	// file selected by user
	console.log("my file:", files[0].name, files[0].type, files[0].size);


	// read file as text file
	reader.readAsText(files[0]);
});

/* Dashboard-specific functions */

/* Set up input elements */

// Create & subscribe callback populating grower select box
const growerSel = document.getElementById('grower-sel');
const populate_select = (state, oldState) => {
	if (!hasChangedState(state, oldState, 'inputGrowers')) return;

	growerSel.options.length = 0;  // Reset 
	// Default disabled option
	growerSel.options[0] = new Option("Grower email...");
	growerSel.options[0].setAttribute('hidden', true);

	// Cycle through growers
	state.inputGrowers.forEach(g => {
		growerSel.options[growerSel.options.length] = new Option(g)
	});
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
const update_charts = function (chart, dataset) {
	return (state, oldState) => {
		if (!hasChangedState(state, oldState, dataset)) return;
		chart.update(state[dataset]);
	}
}

// Define and subscribe callbacks updating chart data
window.subscribers.push(update_charts(chart1, 'data1'));
window.subscribers.push(update_charts(chart2, 'data2'));
window.subscribers.push(update_charts(chart3, 'data2'));

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


/*
	CANVAS setup for 2D drawing - white noise test
*/
const canvas = document.getElementById('testcanvas');
const ctx = canvas.getContext('2d');

const imageData = ctx.createImageData(canvas.width, canvas.height);

const create_image = () => {
	// Iterate through every pixel
	for (let i = 0; i < imageData.data.length; i += 4) {
		// Modify pixel data - color
		//imageData.data[i + 0] = Math.floor(Math.random()*256);  // R value
		//imageData.data[i + 1] = Math.floor(Math.random()*256);  // G value
		//imageData.data[i + 2] = Math.floor(Math.random()*256);  // B value
		// Modify pixel data - B & W
		rnum = Math.floor(Math.random() * 256)
		imageData.data[i + 0] = 0;  // R value
		imageData.data[i + 1] = rnum;  // G value
		imageData.data[i + 2] = 0;  // B value
		imageData.data[i + 3] = 255;  // A value
	}
	// Draw image data to the canvas
	ctx.putImageData(imageData, 0, 0);
}


// Keep generating new white noise images
const new_frame = function () {
	create_image()
	setTimeout(() => requestAnimationFrame(new_frame), 17)
}

requestAnimationFrame(new_frame);
