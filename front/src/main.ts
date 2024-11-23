import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { io } from 'socket.io-client';
import "./tailwind.css";

const URL = import.meta.env.VITE_APP_API_URL_BASE;
const socket = io(URL);
const app = createApp(App);
const pinia = createPinia();

app.provide('socket', socket);
app.use(pinia).use(router).mount("#app");
