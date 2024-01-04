import Mustache from 'mustache';
import inputPaneTemplate from './templates/inputPane.mustache';

export function setupInputPane(parameters, configInputs, onInputChange) {
    // Render the input fields using Mustache
    const renderedHtml = Mustache.render(inputPaneTemplate, { inputs: configInputs });
    document.getElementById('inputPane').innerHTML = renderedHtml;

    // Set up event listeners for each input field
    configInputs.forEach(input => {
        const inputElement = document.getElementById(input.name);
        inputElement.addEventListener('input', (event) => {
            // Update the parameters object and call the callback function
            parameters[input.name] = parseInputValue(input.type, event.target.value);
            onInputChange(parameters);
        });
    });
}

function parseInputValue(type, value) {
    // Parse the input value based on its type
    switch (type) {
        case 'number':
            return parseFloat(value);
        default:
            return value;
    }
}
