<template>
  <div class="section">
    <!-- Text List -->
    <div v-if="section.type === 'textList'" class="text-list">
      <ul>
        <li v-for="(value, key) in inputData" :key="key">{{ key }}: {{ value }}</li>
      </ul>
    </div>

    <!-- Chart -->
    <div v-if="section.type === 'chart'" class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <!-- Map -->
    <div v-if="section.type === 'map'" class="map-container" ref="mapContainer"></div>

    <!-- Input Types (Select, Range Slider, etc.) -->
    <!-- Implement input rendering logic here if needed -->

  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import Chart from 'chart.js/auto';
import L from 'leaflet';

export default {
  props: {
    section: Object,
    inputData: Object // Only needed for output sections
  },
  setup(props) {
    const chartCanvas = ref(null);
    const mapContainer = ref(null);

    watch(() => props.inputData, (newData) => {
      if (props.section.type === 'chart') {
        renderChart(newData);
      }
    }, { immediate: true });

    const renderChart = (data) => {
      // Placeholder logic to render a chart using Chart.js
      // Modify this to use actual data
      const ctx = chartCanvas.value.getContext('2d');
      new Chart(ctx, {
        type: 'line', // Change as needed
        data: {
          labels: ['Sample 1', 'Sample 2', 'Sample 3'],
          datasets: [{ data: [data.sample1, data.sample2, data.sample3] }] // Example data
        },
        options: {} // Chart options
      });
    };

    onMounted(() => {
      if (props.section.type === 'map') {
        // Placeholder logic to initialize a Leaflet map
        // Modify this to use actual data
        const map = L.map(mapContainer.value).setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
        }).addTo(map);
      }
    });

    return {
      chartCanvas,
      mapContainer
    };
  }
};
</script>
