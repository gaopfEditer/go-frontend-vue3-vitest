import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '../utils/stores'
import { initWebVitals, observeExtras, trackRouteView, startSoftLCP } from '../utils/metrics'
import Products from '../views/Products.vue'
import LicenseTypes from '../views/LicenseTypes.vue'
import ProductFeatures from '../views/ProductFeatures.vue'
import FirmwareVersions from '../views/FirmwareVersions.vue'
import SoftwareVersions from '../views/SoftwareVersions.vue'
import Devices from '../views/Devices.vue'
import Post from '../views/Post.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Products',
        component: Products,
        meta: { exact: true }
      },
      {
        path: 'post',
        name: 'Post',
        component: Post,
        meta: { exact: true }
      },
      {
        path: 'metrics-preview',
        name: 'MetricsPreview',
        component: () => import('../views/MetricsPreview.vue'),
        meta: { exact: true }
      },
      {
        path: 'license-types',
        name: 'LicenseTypes',
        component: LicenseTypes,
        meta: { exact: true }
      },
      {
        path: 'product-features',
        name: 'ProductFeatures',
        component: ProductFeatures,
        meta: { exact: true }
      },
      {
        path: 'audit-logs',
        name: 'AuditLogs',
        component: () => import('../views/AuditLog.vue'),
        meta: { exact: true }
      },
      {
        path: '/firmware-versions',
        name: 'FirmwareVersions',
        component: FirmwareVersions,
        meta: { requiresAuth: true }
      },
      {
        path: '/software-versions',
        name: 'SoftwareVersions',
        component: SoftwareVersions,
        meta: { requiresAuth: true }
      },
      {
        path: '/devices',
        name: 'Devices',
        component: Devices,
        meta: { requiresAuth: true }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const store = useStore()

  if (to.meta.requiresAuth && !store.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && store.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router

router.afterEach((to, from) => {
  const pageId = `${to.fullPath}#${Date.now()}`
  const routeCtx = { page: to.fullPath, pageId }
  initWebVitals(routeCtx)
  observeExtras(routeCtx)
  trackRouteView(routeCtx, from, to)
  startSoftLCP(routeCtx)
})