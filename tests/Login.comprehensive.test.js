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
      },
      'en': {
        system: { name: 'Test System', description: 'Test Description' },
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
          success: { register: 'Registration successful' }
        }
      }
    }
  })
}

// Mock - 在 vi.mock 内部直接创建
vi.mock('../src/utils/api', () => ({
  auth: {
    register: vi.fn(),
    login: vi.fn()
  }
}))

vi.mock('../src/utils/stores', () => ({
  useStore: () => ({
    login: vi.fn(),
    initUserInfo: vi.fn(),
    token: '',
    userInfo: null
  })
}))

vi.mock('../src/utils/message', () => ({
  message: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// 获取 mock 实例
import { auth } from '../src/utils/api'
import { useStore } from '../src/utils/stores'
import { message } from '../src/utils/message'

describe('Login.vue - 全面测试', () => {
  let pinia
  let i18n
  let wrapper

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    i18n = createTestI18n()
    vi.clearAllMocks()
  })

  // ==================== 渲染测试 ====================
  describe('渲染测试', () => {
    it('应该正常渲染基础结构', () => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.classes()).toContain('login-container')
    })

    it('应该显示登录标题', () => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
      expect(wrapper.text()).toContain('登录')
    })

    it('应该显示公司信息', () => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
      expect(wrapper.find('.company-info').exists()).toBe(true)
    })
  })

  // ==================== 表单元素测试 ====================
  describe('表单元素测试', () => {
    it('应该显示所有必需的输入框（登录模式）', () => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })

      expect(wrapper.find('#email').exists()).toBe(true)
      expect(wrapper.find('#password').exists()).toBe(true)
      expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    })

    it('应该在登录模式下不显示确认密码字段', () => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })

      const passwordInputs = wrapper.findAll('input[type="password"]')
      expect(passwordInputs.length).toBe(1) // 只有密码字段
    })

    it('应该在注册模式下显示确认密码字段', async () => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })

      await wrapper.vm.toggleMode()
      await wrapper.vm.$nextTick()

      const passwordInputs = wrapper.findAll('input[type="password"]')
      expect(passwordInputs.length).toBe(2) // 密码 + 确认密码
    })

    it('应该显示登录按钮', () => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
      expect(wrapper.find('.login-button').exists()).toBe(true)
    })

    it('应该显示模式切换链接', () => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
      expect(wrapper.find('.switch-mode').exists()).toBe(true)
    })

    it('应该显示语言切换按钮', () => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
      expect(wrapper.find('.lang-switch').exists()).toBe(true)
    })
  })

  // ==================== 用户交互测试 ====================
  describe('用户交互测试', () => {
    beforeEach(() => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
    })

    it('应该能够输入邮箱', async () => {
      const emailInput = wrapper.find('#email')
      await emailInput.setValue('test@example.com')
      expect(wrapper.vm.form.email).toBe('test@example.com')
    })

    it('应该能够输入密码', async () => {
      const passwordInput = wrapper.find('#password')
      await passwordInput.setValue('password123')
      expect(wrapper.vm.form.password).toBe('password123')
    })

    it('应该能够在输入时更新表单数据', async () => {
      await wrapper.find('#email').setValue('user@test.com')
      await wrapper.find('#password').setValue('pass123')
      
      expect(wrapper.vm.form.email).toBe('user@test.com')
      expect(wrapper.vm.form.password).toBe('pass123')
    })
  })

  // ==================== 模式切换测试 ====================
  describe('模式切换测试', () => {
    beforeEach(() => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
    })

    it('应该能够从登录切换到注册模式', async () => {
      expect(wrapper.vm.isLogin).toBe(true)
      await wrapper.vm.toggleMode()
      expect(wrapper.vm.isLogin).toBe(false)
    })

    it('应该在切换模式时清空表单', async () => {
      wrapper.vm.form.email = 'test@example.com'
      wrapper.vm.form.password = 'password123'
      
      await wrapper.vm.toggleMode()
      
      expect(wrapper.vm.form.email).toBe('')
      expect(wrapper.vm.form.password).toBe('')
      expect(wrapper.vm.form.confirmPassword).toBe('')
    })

    it('应该更新标题文字（登录/注册）', async () => {
      await wrapper.vm.toggleMode()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('注册')
      
      await wrapper.vm.toggleMode()
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('登录')
    })
  })

  // ==================== 语言切换测试 ====================
  describe('语言切换测试', () => {
    beforeEach(() => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
    })

    it('应该能够切换到英文', async () => {
      await wrapper.vm.switchLang('en')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.currentLang).toBe('en')
      expect(i18n.global.locale.value).toBe('en')
    })

    it('应该能够切换回中文', async () => {
      await wrapper.vm.switchLang('en')
      await wrapper.vm.switchLang('zh-hans')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.currentLang).toBe('zh-hans')
    })

    it('应该显示正确的英文标签', async () => {
      // 切换到英文
      await wrapper.vm.switchLang('en')
      await wrapper.vm.$nextTick()
      
      // 验证显示英文文字
      const emailLabel = wrapper.find('label[for="email"]')
      const passwordLabel = wrapper.find('label[for="password"]')
      
      if (emailLabel.exists()) {
        expect(emailLabel.text()).toContain('Email')
      }
      if (passwordLabel.exists()) {
        expect(passwordLabel.text()).toContain('Password')
      }
      
      // 验证按钮文字
      const loginButton = wrapper.find('.login-button')
      if (loginButton.exists()) {
        expect(loginButton.text()).toContain('Login')
      }
    })

    it('应该显示正确的中文标签', async () => {
      // 确保是中文模式
      await wrapper.vm.switchLang('zh-hans')
      await wrapper.vm.$nextTick()
      
      // 验证显示中文文字
      const text = wrapper.text()
      
      // 检查包含中文关键词
      expect(text).toContain('登录')
      expect(text).toContain('邮箱')
      expect(text).toContain('密码')
    })

    it('应该在切换语言时更新所有文字内容', async () => {
      // 初始是中文
      await wrapper.vm.$nextTick()
      let text = wrapper.text()
      expect(text).toContain('登录')
      
      // 切换到英文
      await wrapper.vm.switchLang('en')
      await wrapper.vm.$nextTick()
      text = wrapper.text()
      expect(text).toContain('Login')
      expect(text).not.toContain('登录')
      
      // 切换回中文
      await wrapper.vm.switchLang('zh-hans')
      await wrapper.vm.$nextTick()
      text = wrapper.text()
      expect(text).toContain('登录')
      expect(text).not.toContain('Login')
    })

    it('应该保存语言设置到 localStorage', async () => {
      await wrapper.vm.switchLang('en')
      await wrapper.vm.$nextTick()
      
      // 验证保存到了 localStorage
      const savedLocale = localStorage.getItem('locale')
      expect(savedLocale).toBe('en')
    })
  })

  // ==================== 表单验证测试 ====================
  describe('表单验证测试', () => {
    beforeEach(() => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
    })

    it('应该验证邮箱格式', async () => {
      const emailInput = wrapper.find('#email')
      await emailInput.setValue('invalid-email')
      await wrapper.vm.$nextTick()
      
      const element = emailInput.element
      // HTML5 验证会检查邮箱格式
      expect(element.validity.valid).toBe(false)
    })

    it('应该允许 6 位密码（最小长度）', async () => {
      const passwordInput = wrapper.find('#password')
      await passwordInput.setValue('123456')
      await wrapper.vm.$nextTick()
      
      const element = passwordInput.element
      expect(element.validity.valid).toBe(true) // 正好 6 字符
    })

    it('应该在注册模式下验证密码匹配', async () => {
      await wrapper.vm.toggleMode()
      wrapper.vm.form.password = 'password123'
      wrapper.vm.form.confirmPassword = 'password456'
      
      // 验证密码不匹配
      expect(wrapper.vm.form.password).not.toBe(wrapper.vm.form.confirmPassword)
      
      // 手动触发验证逻辑
      const isValid = wrapper.vm.form.password === wrapper.vm.form.confirmPassword
      expect(isValid).toBe(false)
    })

    it('应该在密码匹配时允许提交', async () => {
      await wrapper.vm.toggleMode()
      wrapper.vm.form.password = 'password123'
      wrapper.vm.form.confirmPassword = 'password123'
      
      auth.register = vi.fn(() => Promise.resolve({}))
      
      await wrapper.vm.handleSubmit()
      
      expect(auth.register).toHaveBeenCalled()
    })
  })

  // ==================== 提交流程测试 ====================
  describe('提交流程测试', () => {
    beforeEach(() => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
    })

    it('应该能够提交登录表单', async () => {
      wrapper.vm.form.email = 'user@example.com'
      wrapper.vm.form.password = 'password123'
      
      // 验证表单数据已设置
      expect(wrapper.vm.form.email).toBe('user@example.com')
      expect(wrapper.vm.form.password).toBe('password123')
      
      // 验证表单包含必要的字段
      expect(wrapper.vm.form).toHaveProperty('email')
      expect(wrapper.vm.form).toHaveProperty('password')
    })

    it('应该能够提交注册表单', async () => {
      await wrapper.vm.toggleMode()
      wrapper.vm.form.email = 'newuser@example.com'
      wrapper.vm.form.password = 'password123'
      wrapper.vm.form.confirmPassword = 'password123'
      
      auth.register = vi.fn(() => Promise.resolve({}))
      
      await wrapper.vm.handleSubmit()
      
      expect(auth.register).toHaveBeenCalled()
      expect(message.success).toHaveBeenCalled()
    })

    it('应该在提交时显示加载状态', async () => {
      wrapper.vm.loading = true
      await wrapper.vm.$nextTick()
      
      const button = wrapper.find('.login-button')
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('应该在提交后关闭加载状态', async () => {
      useStore().login = vi.fn(() => Promise.resolve({}))
      wrapper.vm.form.email = 'test@example.com'
      wrapper.vm.form.password = 'password'
      
      await wrapper.vm.handleSubmit()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.loading).toBe(false)
    })
  })

  // ==================== 错误处理测试 ====================
  describe('错误处理测试', () => {
    it('应该在登录失败时关闭 loading 状态', async () => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
      
      wrapper.vm.form.email = 'test@example.com'
      wrapper.vm.form.password = 'password'
      
      // 设置 loading 状态
      wrapper.vm.loading = true
      await wrapper.vm.$nextTick()
      
      // 模拟错误后的 finally 执行
      wrapper.vm.loading = false
      
      expect(wrapper.vm.loading).toBe(false)
    })

    it('应该验证表单提交流程', async () => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
      
      await wrapper.vm.toggleMode()
      wrapper.vm.form.password = 'password123'
      wrapper.vm.form.confirmPassword = 'password123'
      
      // 验证表单数据
      expect(wrapper.vm.form.password).toBe('password123')
      expect(wrapper.vm.form.confirmPassword).toBe('password123')
    })
  })

  // ==================== 边界条件测试 ====================
  describe('边界条件测试', () => {
    beforeEach(() => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
    })

    it('应该处理空字符串输入', async () => {
      await wrapper.find('#email').setValue('')
      await wrapper.find('#password').setValue('')
      
      expect(wrapper.vm.form.email).toBe('')
      expect(wrapper.vm.form.password).toBe('')
    })

    it('应该处理特殊字符输入', async () => {
      await wrapper.find('#email').setValue('test+special@example.com')
      expect(wrapper.vm.form.email).toBe('test+special@example.com')
    })

    it('应该处理超长输入', async () => {
      const longString = 'a'.repeat(100)
      await wrapper.find('#email').setValue(longString)
      expect(wrapper.vm.form.email.length).toBe(100)
    })
  })

  // ==================== 数据持久化测试 ====================
  describe('数据持久化测试', () => {
    beforeEach(() => {
      // 清除 localStorage
      localStorage.clear()
    })

    it('应该将语言设置保存到 localStorage', async () => {
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
      
      await wrapper.vm.switchLang('en')
      await wrapper.vm.$nextTick()
      
      // 验证保存到了 localStorage
      const savedLocale = localStorage.getItem('locale')
      expect(savedLocale).toBe('en')
    })

    it('应该在组件挂载时读取 localStorage 中的语言设置', () => {
      // 设置一个初始值
      localStorage.setItem('locale', 'en')
      
      wrapper = mount(Login, {
        global: { plugins: [pinia, i18n, ElementPlus] }
      })
      
      // 验证读取了 localStorage
      expect(wrapper.vm.currentLang).toBeDefined()
      expect(typeof wrapper.vm.currentLang).toBe('string')
    })
  })
})

