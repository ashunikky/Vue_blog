import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Create the app instance
const app = createApp(App);

// Add the router and mount the app
app.use(router).mount('#app');

// Register the FontAwesomeIcon component globally
app.component("font-awesome-icon", FontAwesomeIcon);
