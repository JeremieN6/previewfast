import { createRouter, createWebHistory } from 'vue-router'
import Builder from '../views/Builder.vue'
import LandingPage from '../components/page/LandingPage.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: {
      title: 'PreviewFaster - Créez des mockups mobiles professionnels en 2 clics',
      description: 'Générez des mockups iOS et Android en HD pour vos App Stores et landing pages. Templates premium, édition en temps réel, export instantané.'
    }
  },
  {
    path: '/template',
    name: 'Builder',
    component: Builder,
    meta: {
      title: 'Builder - PreviewFaster',
      description: 'Créez vos mockups mobiles avec le builder PreviewFaster'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
