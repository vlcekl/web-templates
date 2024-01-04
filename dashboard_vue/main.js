import { createApp } from 'vue';
import App from './App.vue';

// Import the compiled CSS file from the correct location
import './assets/css/main.css';

const app = createApp(App);
// If you have any global components or plugins to register, do it here
// For example:
// app.component('global-component', GlobalComponent);
app.mount('#app');

