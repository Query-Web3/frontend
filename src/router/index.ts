import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import { useGlobalStore } from '@/stores/global'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/yield',
      name: 'yield',
      component: () => import('../pages/Yield.vue')
    },
    {
      path: '/not404',
      name: 'Not404',
      component: () => import('../pages/not404.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useGlobalStore()
  userStore.setPaths([
    { path: to.path, name: to.name, meta: to.meta }
  ])
  document.getElementById('loader')!.style.display = "flex";
  next()
})


router.afterEach((to, from, failure) => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
  setTimeout(() => {
    document.getElementById('loader')!.style.display = "none";
  }, 200);
})

export default router
