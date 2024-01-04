<template>
  <div>
    <header class="header">
      <select v-model="mode">
        <option value="simulation">Simulation</option>
        <option value="optimization">Optimization</option>
        <option value="experimentDesign">Experiment Design</option>
      </select>
    </header>
    <div class="dashboard">
      <InputPanel :config="inputConfig[mode]" @inputChanged="updateOutput" />
      <OutputPanel :config="outputConfig[mode]" :inputData="inputData" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import InputPanel from './components/InputPanel.vue';
import OutputPanel from './components/OutputPanel.vue';
import inputConfig from './config/inputConfig.json';
import outputConfig from './config/outputConfig.json';

export default {
  components: { InputPanel, OutputPanel },
  setup() {
    const mode = ref('simulation');
    const inputData = ref({});

    function updateOutput(data) {
      inputData.value = data;
    }

    return { mode, inputConfig, outputConfig, inputData, updateOutput };
  }
};
</script>

