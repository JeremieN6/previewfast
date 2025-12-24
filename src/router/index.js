import { createRouter, createWebHistory } from 'vue-router'
import BuilderBackup from '../views/BuilderBackup.vue'
import NewBuilder from '../views/NewBuilder.vue'
import LandingPage from '../components/page/LandingPage.vue'
import PolitiqueConfidentialite from '../components/PolitiqueConfidentialite.vue'
import BlogPage from '../components/page/BlogPage.vue'
import BlogContentPage from '../components/page/BlogContentPage.vue'

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
    path: '/template-backup',
    name: 'Builder Backup',
    component: BuilderBackup,
    meta: {
      title: 'Builder Backup - PreviewFaster',
      description: 'Créez vos mockups mobiles avec le builder PreviewFaster'
    }
  },
  {
    path: '/atelier',
    name: 'New Builder',
    component: NewBuilder,
    meta: {
      title: 'Builder - PreviewFaster',
      description: 'Créez vos mockups mobiles avec le builder PreviewFaster'
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: BlogPage,
    meta: {
      title: 'Blog - PreviewFaster',
      description: 'Articles, astuces et tutoriels pour créer des mockups mobiles professionnels rapidement.'
    }
  },
  {
    path: '/blog/:slug',
    name: 'BlogContent',
    component: BlogContentPage,
    meta: {
      title: 'Article de Blog - PreviewFaster',
      description: 'Lisez nos articles, astuces et tutoriels pour créer des mockups mobiles professionnels rapidement.'
    }
  },
  {
    path: '/politique-confidentialite',
    name: 'Politique Confidentialite',
    component: PolitiqueConfidentialite,
    meta: {
      title: 'Politique de Confidentialité - PreviewFaster',
      description: 'Lisez la politique de confidentialité de PreviewFaster'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
