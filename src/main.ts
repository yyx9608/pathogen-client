import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import myGlobal from './global/Global.vue';
import 'element-plus/dist/index.css';

const app = createApp(App).use(router).use(store).use(ElementPlus);
app.config.globalProperties.myGlobal = myGlobal;
app.mount('#app');
