import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/task-list',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'task-list',
        component: () => import('pages/TaskPage.vue')
      },
      {
        path: ':id',
        name: 'task-detail',
        component: () => import('pages/TaskDetailPage.vue'),
        props: true
      }
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
