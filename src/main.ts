import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import "vue-sonner/style.css";
import App from "./App.vue";
import router from "./router.ts";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "./composables/useInstallPrompt"; // starts listening for the browser's install prompt right away
import { setupPwa } from "./pwa";


const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);


app.use(pinia);
app.use(router);
app.mount("#app");

setupPwa(router);
