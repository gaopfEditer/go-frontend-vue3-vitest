import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import Login from '../../src/views/Login.vue'

// 简化的 i18n 配置
const i18n = createI18n({
  legacy: false,
  locale: 'zh-hans',
  messages: {
    'zh-hans': {
      system: { name: '测试系统', description: '系统描述' },
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
        success: { register: '注册成功' }
      }
    }
  }
})

// Mock 模块
vi.mock('../../src/utils/api', () => ({
  auth: {
    register: vi.fn(() => Promise.resolve({}))
  }
}))

vi.mock('../../src/utils/stores', () => ({
  useStore: () => ({
    login: vi.fn(() => Promise.resolve({})),
    initUserInfo: vi.fn()
  })
}))

vi.mock('../../src/utils/message', () => ({
  message: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('Login Page - E2E 测试', () => {
  let pinia
  let wrapper

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('应该完成完整的登录流程', async () => {
    wrapper = mount(Login, {
      global: {
        plugins: [pinia, i18n, ElementPlus]
      }
    })

    // 1. 验证页面加载
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('登录')

    // 2. 查找输入框
    const emailInput = wrapper.find('#email')
    const passwordInput = wrapper.find('#password')

    expect(emailInput.exists()).toBe(true)
    expect(passwordInput.exists()).toBe(true)

    // 3. 填写表单
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    expect(wrapper.vm.form.email).toBe('test@example.com')
    expect(wrapper.vm.form.password).toBe('password123')
  })

  it('应该完成完整的注册流程', async () => {
    wrapper = mount(Login, {
      global: {
        plugins: [pinia, i18n, ElementPlus]
      }
    })

    // 切换到注册模式
    await wrapper.vm.toggleMode()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isLogin).toBe(false)
    expect(wrapper.text()).toContain('注册')

    // 填写注册表单
    const emailInput = wrapper.find('#email')
    const passwordInput = wrapper.find('#password')
    const confirmPasswordInput = wrapper.findAll('input[type="password"]')[1]

    await emailInput.setValue('newuser@example.com')
    await passwordInput.setValue('password123')
    await confirmPasswordInput.setValue('password123')

    expect(wrapper.vm.form.email).toBe('newuser@example.com')
    expect(wrapper.vm.form.password).toBe('password123')
    expect(wrapper.vm.form.confirmPassword).toBe('password123')
  })

  it('应该能够切换语言', async () => {
    wrapper = mount(Login, {
      global: {
        plugins: [pinia, i18n, ElementPlus]
      }
    })

    // 初始语言应该是中文
    expect(wrapper.vm.currentLang).toBe('zh-hans')
    expect(wrapper.text()).toContain('登录')

    // 切换到英文
    await wrapper.vm.switchLang('en')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.currentLang).toBe('en')
  })

  it('应该验证表单输入', async () => {
    wrapper = mount(Login, {
      global: {
        plugins: [pinia, i18n, ElementPlus]
      }
    })

    const emailInput = wrapper.find('#email')
    
    // 设置为无效邮箱
    await emailInput.setValue('invalid-email')
    await wrapper.vm.$nextTick()

    // 验证 HTML5 验证
    const element = emailInput.element
    expect(element.validity.valid).toBe(false)
  })
})

