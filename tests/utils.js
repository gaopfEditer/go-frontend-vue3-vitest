import { vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'

// 测试工具函数

/**
 * 创建测试用的 Pinia store
 */
export function createTestPinia() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}

/**
 * 创建测试用的 Router
 */
export function createTestRouter(routes = []) {
  const defaultRoutes = [
    {
      path: '/',
      component: { template: '<div>Home</div>' }
    },
    {
      path: '/login',
      component: { template: '<div>Login</div>' }
    },
    ...routes
  ]

  return createRouter({
    history: createWebHistory(),
    routes: defaultRoutes
  })
}

/**
 * 创建测试用的 I18n 实例
 */
export function createTestI18n(locale = 'zh-hans', messages = {}) {
  const defaultMessages = {
    'zh-hans': {
      system: {
        name: '测试系统',
        description: '系统描述'
      }
    },
    'en': {
      system: {
        name: 'Test System',
        description: 'Test Description'
      }
    },
    ...messages
  }

  return createI18n({
    legacy: false,
    locale,
    messages: defaultMessages
  })
}

/**
 * 模拟 API 响应
 */
export function mockApiResponse(data, status = 200) {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {}
  }
}

/**
 * 模拟 API 错误
 */
export function mockApiError(message = 'API Error', status = 500) {
  const error = new Error(message)
  error.response = {
    status,
    data: { message }
  }
  return error
}

/**
 * 等待所有异步操作完成
 */
export async function waitForAllPromises() {
  await new Promise(resolve => setTimeout(resolve, 0))
}

/**
 * 创建模拟的 localStorage
 */
export function createMockLocalStorage() {
  const storage = {}
  return {
    getItem: vi.fn((key) => storage[key] || null),
    setItem: vi.fn((key, value) => {
      storage[key] = value
    }),
    removeItem: vi.fn((key) => {
      delete storage[key]
    }),
    clear: vi.fn(() => {
      Object.keys(storage).forEach(key => delete storage[key])
    })
  }
}

