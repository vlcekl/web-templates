import dashboardConfig from './config/dashboardConfig.json';
import { reactive } from './reactivity.js';
import { setupInputPane } from './inputPane.js';
import { setupOutputPane, updateOutputPane } from './outputPane.js';
import { calculateStatistics } from './statistics.js';

// Initialize parameters from dashboardConfig inputs
const initialParameters = dashboardConfig.inputs.reduce((params, input) => {
    params[input.name] = input.defaultValue;
    return params;
}, {});

// Initialize reactive data structure
const data = reactive({
    parameters: initialParameters,
    statistics: {}
}, () => {
    // Recalculate statistics and update output pane when parameters change
    data.statistics = calculateStatistics(data.parameters);
    updateOutputPane(data.statistics);
});

// Initialize input and output panes
setupInputPane(data.parameters, dashboardConfig.inputs, (newParameters) => {
    Object.assign(data.parameters, newParameters);
});
setupOutputPane(dashboardConfig.outputs);

// Initial calculation and rendering
data.statistics = calculateStatistics(data.parameters);
updateOutputPane(data.statistics);




