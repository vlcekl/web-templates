<template>
  <div class="input-panel">
    <Tab v-for="tab in config.tabs" :key="tab.id" :tab="tab" @inputChanged="handleInputChanged" />
  </div>
</template>

<script>
import Tab from './Tab.vue';

export default {
  components: { Tab },
  props: {
    config: Object
  },
  methods: {
    handleInputChanged(data) {
      this.$emit('inputChanged', data);
    }
  }
};
</script>
