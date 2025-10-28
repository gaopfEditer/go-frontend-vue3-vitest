import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '../utils/stores'
import Products from '../views/Products.vue'
import LicenseTypes from '../views/LicenseTypes.vue'
import ProductFeatures from '../views/ProductFeatures.vue'
import FirmwareVersions from '../views/FirmwareVersions.vue'
import SoftwareVersions from '../views/SoftwareVersions.vue'
import Devices from '../views/Devices.vue'

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