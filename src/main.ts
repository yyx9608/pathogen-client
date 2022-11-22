import {createApp, InjectionKey} from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import store, {key} from './store';
import ElementPlus, {vLoading} from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// @ts-ignore

const app = createApp(App).use(router).use(store, key).use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}
app.directive('load', vLoading)
app.mount('#app');
