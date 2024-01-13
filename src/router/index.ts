import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ConversationView from '@/views/ConversationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/see/:conversationId',
      name: 'seeConversation',
      component: ConversationView,
      props: true
    }
  ]
})

/**
 * On regarde dans le sessionStorage si on a déjà définit la clé jwt; si c'est le cas l'utilisateur est connecté
 * 
 * @returns l'état de connexion de l'utilisateur
 */
export function isAuthenticated() {
  return !!sessionStorage.getItem('jwt')
}

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

export default router
