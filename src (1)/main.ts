import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './index.css';
import { useEsgStore } from './stores/esgStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize observers and listeners
const esgStore = useEsgStore();
esgStore.setupAuthObserver();
esgStore.setupRealtimeSync();

// Apply initial body classes for dark mode if active
if (esgStore.darkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

app.mount('#root');
