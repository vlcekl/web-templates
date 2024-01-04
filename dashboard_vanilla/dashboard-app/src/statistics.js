export function calculateStatistics(parameters) {
    // Dummy data generation based on parameters
    // In a real scenario, you would replace this with actual data processing logic
    const data = Array.from({ length: parameters.sampleCount }, () => 
        Math.random() * parameters.standardDeviation + parameters.mean
    );

    return {
        meanResult: calculateMean(data),
        standardDeviationResult: calculateStandardDeviation(data)
    };
}

function calculateMean(data) {
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
}

function calculateStandardDeviation(data) {
    const mean = calculateMean(data);
    const squareDiffs = data.map(value => {
        const diff = value - mean;
        return diff * diff;
    });
    const avgSquareDiff = calculateMean(squareDiffs);
    return Math.sqrt(avgSquareDiff);
}

