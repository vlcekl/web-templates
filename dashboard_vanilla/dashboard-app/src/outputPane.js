import Mustache from 'mustache';
import outputPaneTemplate from './templates/outputPane.mustache';

export function setupOutputPane(configOutputs) {
    const renderedHtml = Mustache.render(outputPaneTemplate, { outputs: configOutputs });
    document.getElementById('outputPane').innerHTML = renderedHtml;
}

export function updateOutputPane(statistics) {
    // Assuming statistics is an object where keys are the names defined in config
    const statsForTemplate = Object.entries(statistics).map(([key, value]) => ({
        name: key,
        value
    }));

    const renderedHtml = Mustache.render(outputPaneTemplate, { outputs: statsForTemplate });
    document.getElementById('outputPane').innerHTML = renderedHtml;
}


