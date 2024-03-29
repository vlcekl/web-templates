/*
	Set up a simple global reactive/state system.
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
const reqProps = ['inputSelect1', 'inputSelect2', 'inputSlider', 'inputNumber', 'controls', 'data', 'data_proc'];

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


/* -----------------------
    Set up input elements
   ----------------------- */

// Create & subscribe callback populating grower select box
function populate_select(inpElement, thisSelect) {
	return (state, oldState) => {
		if (!hasChangedState(state, oldState, 'controls')) return;

		inpElement.options.length = 0;  // Reset 
		// Default disabled option
		//inpElement.options[0] = new Option("Select option...");
		//inpElement.options[0].setAttribute('hidden', true);
 
		// Cycle through options
		state.controls[thisSelect].forEach(g => {
			inpElement.options[inpElement.options.length] = new Option(g)
		});
	}
}

const select1 = document.getElementById('control-1-select');
window.subscribers.push(populate_select(select1, 'inputSelect1'));
const select2 = document.getElementById('control-2-select');
window.subscribers.push(populate_select(select2, 'inputSelect2'));

const select1b = document.getElementById('control-1-select');
select1b.addEventListener('change', e => {
	state['inputSelect1'] = e.target.value;
})

const select2b = document.getElementById('control-2-select');
select2b.addEventListener('change', e => {
	state['inputSelect2'] = e.target.value;
})

// Number input event listener updating state proxy
const number1 = document.getElementById('control-1-number');
number1.addEventListener('input', e => {
	state['inputNumber'] = e.target.value;
})

// Create & subscribe callback populating slider
function makeDetailsElement(state, oldDatalist, thisSelect) {

	const datalist = document.createElement('datalist');
	datalist.id = oldDatalist.id;

	datalist.options.length = 0;  // Reset 

	state.controls[thisSelect]['datalist'].forEach(g => {
		opt = new Option(g);
		opt.setAttribute('value', g);
		opt.setAttribute('label', g);
		datalist.appendChild(opt);
	})
	return datalist;
}


function populate_slider(inpElement, oldDatalist, thisSelect) {
	return (state, oldState) => {
		if (!hasChangedState(state, oldState, 'controls')) return;

		// Create datalist for slider labels
		const newDatalist = makeDetailsElement(state, oldDatalist, thisSelect);
		newDatalist.id = oldDatalist.id;
		oldDatalist.parentNode.replaceChild(newDatalist, oldDatalist);

		// Set slider attributes
		inpElement.setAttribute('min', state.controls[thisSelect].min);
		inpElement.setAttribute('max', state.controls[thisSelect].max);
		inpElement.setAttribute('value', state.controls[thisSelect].value);
		inpElement.setAttribute('list', newDatalist.id);
	}
}

const slider1 = document.getElementById('control-1-slider');
const datalist1 = document.getElementById('control-1-slider-list');
window.subscribers.push(populate_slider(slider1, datalist1, 'inputSlider'));

const slider1a = document.getElementById('control-1-slider');

slider1a.addEventListener('change', e => {
	state['inputSlider'] = e.target.value;
});

/* --------------
    Process data
   --------------*/

// Sample array (with replacement)
function sample(a, n = 1) {
	//return new Array(n).fill().map(() => Math.floor(Math.random()*a.length))
	return new Array(n).fill().map(() => a[Math.floor(Math.random()*a.length)])
}

// Filter dataset using callbacks stored in filters array
function filter_data(data_in, filtercol, filterval) {

	// get boolean array indicating rows that pass filter
	const cols = Object.keys(data_in);
	const nrow = data_in[cols[0]].length;
	idx_arr = [];
	if (typeof(data_in[filtercol][0]) === "number") {
		for (let i = 0; i < nrow; i++) {
			idx_arr.push(data_in[filtercol][i] < filterval); // filters.every(filter_fun => filter_fun(data_in, i)));
		}
	} else {
		for (let i = 0; i < nrow; i++) {
			//idx_arr.append(filters.every(filter_fun => filter_fun(data_in, i)));
			idx_arr.push(data_in[filtercol][i] === filterval); // filters.every(filter_fun => filter_fun(data_in, i)));
		}
	}

	// filter elements in all columns based on the boolean array
	data_out = {};
	cols.forEach( c => {
		data_out[c] = data_in[c].filter((e, i) => idx_arr[i]);
	})

	return data_out;
}

// Groups data based on a column, returns an object with group datasets
function groupby_data(data_in, groupBy = null) {

	const cols = Object.keys(data_in);

	// Initialize an object with empty columns
	row_groups = {};

	// Cycle through the group column
	data_in[groupBy].forEach((grp, i) => {
		// Create new group dataframe if it doesn't exist
		if (!row_groups.hasOwnProperty(grp))
			row_groups[grp] = Object.fromEntries(cols.map(c => [c, []]));

		// For each column, add values to the group dataframe
		cols.forEach(c => row_groups[grp][c].push(data_in[c][i]));
	})

	return row_groups;
}

// Summarize data using callbacks stored in summs array
function summarize_data(data_in, summs = null) {
	// loop through columns, calculate means (if number), construct object from resulting entries
	return Object.fromEntries(Object.entries(data_in).map(([k, val]) => {
		[k, typeof(val[0]) === 'number' ? val.reduce((a, b) => a + b, 0) / val.length : null]
	}));
}

// Summarize data using callbacks stored in summs array
// If provided, groups define grouping for aggregation
function aggregate(data_in, summs = null, groupBy = null) {
	// If groupBy column exists cycle over group data objects
	if (groupBy === null) {
		return summarize_data(data_in)
	}

	const cols = Object.keys(data_in);
	const data_group = groupby_data(data_in, groupBy);
	let data_agg = null;

	Object.values(data_group['row_groups']).forEach( df => {
		if (data_agg === null)
			data_agg = Object.fromEntries(cols.map(c => [c, []]));

		const df_new = summarize_data(df);
		for (c in cols) {
			data_agg[c].push(df_new[c])
		}
	});
	
	return data_agg;
}

// Calculate a histogram for a given numeric array
function hist(vec, bins = 20) {

	bins = 1*bins;

    let min = Math.min(...vec);
    let max = Math.max(...vec);
	let width = (max - min)/bins;

	// Adjust - set bins a bit larger and minimum smaller
	min -= 0.5*width;
	width += width/bins;

    const histo = new Array(bins).fill(0);
    const binarr = new Array(bins).fill().map((element, index) => min + index*width)

    for (const item of vec) {
        histo[Math.floor((item - min) / width)]++;
    }

    return {hst: histo, bin: binarr};
}

function calculate_histogram() {
	return (state, oldState) => {
		if (!hasChangedState(state, oldState, 'data_proc') &&
			!hasChangedState(state, oldState, 'inputSlider') &&
			!hasChangedState(state, oldState, 'inputSelect1') &&
			!hasChangedState(state, oldState, 'inputNumber') || 
			typeof(state['inputSelect1']) === "undefined" ||
			typeof(state['data']) === "undefined")
			return;

		let data_filt = filter_data(state['data'], filtercol = "state", filterval = state['inputSelect1']);
		data_filt = filter_data(data_filt, filtercol = "yield", filterval = state['inputSlider']);

		const hst_obj = hist(data_filt['yield'], state['inputNumber']);
		const {hst, bin} = {...hst_obj};

		const a = state['data_proc']['series'];
		if (typeof(a) === "object" && a[0].every(item => hst.includes(item)) && hst.every(item => a[0].includes(item)))
			return;

		state['data_proc']['series'] = [hst];
		state['data_proc']['labels'] = bin.map(v => Math.round(v));
		updateState('data_proc');
	}
}
window.subscribers.push(calculate_histogram());


/*
function update_data_callback(dataset, inputs) {
	return (state, oldState) => {
		if (!hasChangedState(state, oldState, dataset)
		 && !hasChangedState(state, oldState, inputs))
			return;
		
		state['data_proc'] = process_data(state[dataset], inputs);
	};
}

window.subscribers.push(update_data_callback('data', ));
*/

/* -------------------
	Chartist.js plots
   ------------------- */

// Function factory making chart update callbacks
function update_charts(chart, dataset) {
	return (state, oldState) => {
		if (!hasChangedState(state, oldState, dataset))
			return;
		chart.update(state[dataset]);
	};
}

// Define and subscribe callbacks updating chart data
chart1 = new Chartist.Bar('#chart-1', null);
window.subscribers.push(update_charts(chart1, 'data_proc'));

// Set up chartist resize observers
const chartist_obs = new ResizeObserver(entries => {
	entries.forEach(entry => {
		entry.target.__chartist__.update()
	})
});
const ctCharts = document.querySelectorAll('.ct-chart');
ctCharts.forEach(c => chartist_obs.observe(c));


/* --------------------------
	Create/update HTML table
   -------------------------- */

// Construct HTML table element for a dataset object
function makeTableElement(data) {
	const cols = Object.keys(data);
	const nrow = data[cols[0]].length;

	// Header - iterate over array of column names
	headHTML = '<thead><tr>';
	cols.forEach(col => {
		headHTML += `<td>${col}</td>`;
	});
	headHTML += '</tr></thead>';

	// Body - iterate over array of records (arrays)
	bodyHTML = '<tbody>';
	for (let i = 0; i < nrow; i++) {
		bodyHTML += '<tr>';
		cols.forEach(c => {
			bodyHTML += `<td>${data[c][i]}</td>`;
		});
		bodyHTML += '</tr>';
	};
	bodyHTML += '</tbody>';

	// Create HTML table element
	const newTable = document.createElement('table');
	newTable.innerHTML = headHTML + bodyHTML;

	return newTable;
}

// Function factory making callbacks that update tables
function update_table(oldTable, dataset) {
	return (state, oldState) => {
		if (!hasChangedState(state, oldState, dataset))
			return;

		// Create new table and replace the old one
		const newTable = makeTableElement(state[dataset]);
		newTable.id = oldTable.id;
		oldTable.parentNode.replaceChild(newTable, oldTable);
	};
}

// Define and subscribe callbacks updating chart data
const table1 = document.getElementById('test-table');
//window.subscribers.push(update_table(table1, 'data_proc'));


/* -----------------
	Leaflet.js maps
   ----------------- */

// Set up object for mapping from mapDiv to the inner map object
const mapMapping = new Map();

// Map Missouri
const mapDivMO = document.getElementById('map-mo');
const mapMO = L.map(mapDivMO).setView([38.627, -90.1994], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapMO);
mapMapping.set(mapDivMO, mapMO);

// Set up leaflet resize observers
const leaflet_obs = new ResizeObserver(entries => {
	entries.forEach(entry => {
		mapMapping.get(entry.target).invalidateSize()
	})
});
const leafletMaps = document.querySelectorAll('.leaflet-map');
leafletMaps.forEach(c => leaflet_obs.observe(c));


/* ------------------------------------------------
	CANVAS setup for 2D drawing - color noise test
   ------------------------------------------------*/

const canvas = document.getElementById('testcanvas');
const ctx = canvas.getContext('2d');

const imageData = ctx.createImageData(canvas.width, canvas.height);

const create_image = () => {
	// Iterate through every pixel
	for (let i = 0; i < imageData.data.length; i += 4) {
		// Modify pixel data - random with a given hue
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
