import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import App from '../src/App.vue'

// Mock Store
const mockStore = {
  initUserInfo: vi.fn()
}

vi.mock('../src/utils/stores', () => ({
  useStore: () => mockStore
}))

// 创建简化的 i18n 实例
const createTestI18n = () => {
  return createI18n({
    legacy: false,
    locale: 'zh-hans',
    messages: {
      'zh-hans': {
        system: {
          name: 'Test System',
          description: 'Test Description'
        }
      },
      'en': {
        system: {
          name: 'Test System',
          description: 'Test Description'
        }
      }
    }
  })
}

// 创建简化的路由
const createTestRouter = () => {
  return createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        component: { template: '<div>Home</div>' }
      }
    ]
  })
}

describe('App.vue', () => {
  let pinia
  let router
  let i18n
  let wrapper

  beforeEach(() => {
    // 重置 Mock
    vi.clearAllMocks()
    localStorage.getItem = vi.fn(() => null)
    
    pinia = createPinia()
    setActivePinia(pinia)
    router = createTestRouter()
    i18n = createTestI18n()
  })

  it('应该正常渲染', async () => {
    wrapper = mount(App, {
      global: {
        plugins: [pinia, router, i18n, ElementPlus],
        stubs: {
          'router-view': true,
          'el-config-provider': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toBeTruthy()
  })

  it('应该包含路由视图', async () => {
    wrapper = mount(App, {
      global: {
        plugins: [pinia, router, i18n, ElementPlus],
        stubs: {
          'router-view': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    
    // 检查 router-view-stub 是否存在
    expect(wrapper.html()).toContain('router-view-stub')
  })

  it('应该设置 HTML lang 属性', async () => {
    wrapper = mount(App, {
      global: {
        plugins: [pinia, router, i18n, ElementPlus],
        stubs: {
          'router-view': true,
          'el-config-provider': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    
    expect(document.documentElement.lang).toBe('zh-CN')
  })

  it('应该初始化用户信息', async () => {
    wrapper = mount(App, {
      global: {
        plugins: [pinia, router, i18n, ElementPlus],
        stubs: {
          'router-view': true,
          'el-config-provider': true
        }
      }
    })

    await wrapper.vm.$nextTick()
    
    expect(wrapper.exists()).toBe(true)
    expect(mockStore.initUserInfo).toHaveBeenCalled()
  })
})

