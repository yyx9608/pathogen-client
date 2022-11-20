import {createApp, InjectionKey} from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import store, {key} from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App).use(router).use(store, key).use(ElementPlus);
app.mount('#app');
