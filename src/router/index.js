import { createRouter, createWebHashHistory } from 'vue-router';
import home from '../views/home.vue';
import workspace from '../views/workspace.vue';
import boardDetails from '../views/board-details.vue';
import taskDetails from '../views/task-details.vue';
import loginSignup from '../views/login-signup.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
    },
    {
      path: '/board',
      name: 'board',
      component: workspace,
    },
    {
      path: '/board/:boardId',
      name: 'board-details',
      component: boardDetails,
    },
    {
      path: '/board/:boardId/:groupId/:taskId',
      name: 'task-details',
      component: taskDetails,
      // children: [
      //   {
      //     path: ':taskId',
      //     component: taskDetails,
      //   }
      // ],
    },
    {
      path: '/login',
      name: 'login-signup',
      component: loginSignup,
      alias: '/signup'
    }
  ],
});

export default router;
