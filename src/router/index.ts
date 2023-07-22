import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store from '@/store'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/auth/Login.vue'
import Clients from '@/views/clients/ClientList.vue'
import ClientDetail from '@/views/clients/ClientDetail.vue'
import Reports from '@/views/reports/ReportList.vue'
import Settings from '@/views/settings/Settings.vue'
import Profile from '@/views/profile/Profile.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients',
    name: 'Clients',
    component: Clients,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/:id',
    name: 'ClientDetail',
    component: ClientDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.meta.guest && isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router