import { createRouter, createWebHistory } from 'vue-router'
import Builder from '../views/Builder.vue'

const routes = [
  {
    path: '/',
    name: 'Builder',
    component: Builder
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
