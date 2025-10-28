import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import Login from '../src/views/Login.vue'

// 创建简化的 i18n 实例
const createTestI18n = () => {
  return createI18n({
    legacy: false,
    locale: 'zh-hans',
    messages: {
      'zh-hans': {
        system: {
          name: '测试系统',
          description: '系统描述'
        },
        login: {
          title: '登录',
          email: '邮箱',
          emailPlaceholder: '请输入邮箱',
          password: '密码',
          passwordPlaceholder: '请输入密码',
          button: '登录',
          loading: '登录中...',
          toRegister: '还没有账号？去注册',
          toLogin: '已有账号？去登录'
        },
        register: {
          title: '注册',
          button: '注册',
          confirmPassword: '确认密码',
          confirmPasswordPlaceholder: '请再次输入密码',
          passwordMismatch: '密码不匹配'
        },
        message: {
          success: {
            register: '注册成功'
          }
        }
      },
      'en': {
        system: {
          name: 'Test System',
          description: 'Test Description'
        },
        login: {
          title: 'Login',
          email: 'Email',
          emailPlaceholder: 'Enter email',
          password: 'Password',
          passwordPlaceholder: 'Enter password',
          button: 'Login',
          loading: 'Loading...',
          toRegister: 'No account? Register',
          toLogin: 'Have account? Login'
        },
        register: {
          title: 'Register',
          button: 'Register',
          confirmPassword: 'Confirm Password',
          confirmPasswordPlaceholder: 'Re-enter password',
          passwordMismatch: 'Password mismatch'
        },
        message: {
          success: {
            register: 'Registration successful'
          }
        }
      }
    }
  })
}

// Mock API 和 store
const mockAuth = {
  register: vi.fn(() => Promise.resolve({}))
}

const mockStore = {
  login: vi.fn(() => Promise.resolve({})),
  initUserInfo: vi.fn()
}

const mockMessage = {
  success: vi.fn(),
  error: vi.fn()
}

vi.mock('../src/utils/api', () => ({
  auth: mockAuth
}))

vi.mock('../src/utils/stores', () => ({
  useStore: () => mockStore
}))

vi.mock('../src/utils/message', () => ({
  message: mockMessage
}))

describe('Login.vue', () => {
  let pinia
  let i18n
  let wrapper

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    i18n = createTestI18n()
    
    vi.clearAllMocks()
  })

  it('应该正常渲染登录表单', () => {
    wrapper = mount(Login, {
      global: {
        plugins: [pinia, i18n, ElementPlus]
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('登录')
  })

  it('应该显示邮箱和密码输入框', () => {
    wrapper = mount(Login, {
      global: {
        plugins: [pinia, i18n, ElementPlus]
      }
    })

    const emailInput = wrapper.find('#email')
    const passwordInput = wrapper.find('#password')

    expect(emailInput.exists()).toBe(true)
    expect(passwordInput.exists()).toBe(true)
  })

  it('应该在登录模式时不显示确认密码字段', () => {
    wrapper = mount(Login, {
      global: {
        plugins: [pinia, i18n, ElementPlus]
      }
    })

    expect(wrapper.text()).not.toContain('确认密码')
  })

  it('应该在注册模式下显示确认密码字段', async () => {
    wrapper = mount(Login, {
      global: {
        plugins: [pinia, i18n, ElementPlus]
      }
    })

    // 切换 to 注册模式
    await wrapper.vm.toggleMode()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('确认密码')
  })

  it('应该能够切换语言', async () => {
    wrapper = mount(Login, {
      global: {
        plugins: [pinia, i18n, ElementPlus]
      }
    })

    // 获取当前语言
    const initialLang = i18n.global.locale.value

    // 切换语言
    await wrapper.vm.switchLang('en')
    await wrapper.vm.$nextTick()

    expect(i18n.global.locale.value).toBe('en')
  })

  it('应该验证密码匹配', async () => {
    wrapper = mount(Login, {
      global: {
        plugins: [pinia, i18n, ElementPlus]
      }
    })

    // 切换到注册模式
    await wrapper.vm.toggleMode()
    await wrapper.vm.$nextTick()

    // 设置不同的密码
    wrapper.vm.form.password = 'password123'
    wrapper.vm.form.confirmPassword = 'password456'

    // 提交表单
    await wrapper.vm.handleSubmit()

    // 应该显示错误消息
    expect(mockMessage.error).toHaveBeenCalled()
    expect(mockStore.login).not.toHaveBeenCalled()
  })
})

