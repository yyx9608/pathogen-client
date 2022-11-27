import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Main from '../views/Main.vue';
import Login from '../views/Login.vue';
import entry from '../views/Entry.vue';
import Search from '../views/Search.vue';
import UserConfig from '../views/UserConfig.vue';
import PathogenPanel from '../views/widgets/PathogenPanel.vue';
import TaskPanel from '../views/widgets/TaskPanel.vue';
import SamplePanel from '../views/widgets/SamplePanel.vue';
// 1. 定义路由组件.
// 也可以从其他文件导入

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'none',
    component: entry,
    redirect() {
      return { name: 'login' };
    },
    children: [
      { path: 'main', name: 'main', component: Main },
      { path: 'login', name: 'login', component: Login },
      { path: 'search', name: 'search', component: Search },
      { path: 'config', name: 'config', component: UserConfig },
      { path: 'pathogen', name: 'pathogen', component: PathogenPanel },
      { path: 'task', name: 'task', component: TaskPanel },
      { path: 'sample', name: 'sample', component: SamplePanel },
    ],
  },
];

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});

export default router;
