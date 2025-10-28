<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-left">
        <div class="company-info">
          <h1>{{ t('system.name') }}</h1>
          <p>{{ t('system.description') }}</p>
        </div>
      </div>
      <div class="login-right">
        <div class="login-box">
          <div class="login-header">
            <h2>{{ t(isLogin ? 'login.title' : 'register.title') }}</h2>
            <div class="lang-switch">
              <button 
                @click="switchLang('zh-hans')" 
                :class="{ active: currentLang === 'zh-hans' }"
              >
                中文
              </button>
              <button 
                @click="switchLang('en')" 
                :class="{ active: currentLang === 'en' }"
              >
                English
              </button>
            </div>
          </div>
          <form @submit.prevent="handleSubmit" class="login-form">
            <div class="form-group">
              <label for="email">{{ t('login.email') }}</label>
              <div class="input-wrapper">
                <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
                  <path d="M896 192H128c-35.2 0-64 28.8-64 64v512c0 35.2 28.8 64 64 64h768c35.2 0 64-28.8 64-64V256c0-35.2-28.8-64-64-64zm0 64v64L512 576 128 320v-64h768zM128 704v-300.8l384 256 384-256V704H128z" fill="currentColor"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  :placeholder="t('login.emailPlaceholder')"
                  required
                />
              </div>
            </div>
            <div class="form-group">
              <label for="password">{{ t('login.password') }}</label>
              <div class="input-wrapper">
                <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
                  <path d="M832 464h-68v-128c0-132.8-108.8-240-240-240s-240 107.2-240 240v128h-68c-35.2 0-64 28.8-64 64v384c0 35.2 28.8 64 64 64h616c35.2 0 64-28.8 64-64V528c0-35.2-28.8-64-64-64zM352 336c0-94.4 76.8-172 172-172s172 77.6 172 172v128H352V336zm476 576H196V528h632v384z" fill="currentColor"/>
                </svg>
                <input
                  type="password"
                  id="password"
                  v-model="form.password"
                  :placeholder="t('login.passwordPlaceholder')"
                  required
                  minlength="6"
                />
              </div>
            </div>
            <div v-if="!isLogin" class="form-group">
              <label>{{ t('register.confirmPassword') }}</label>
              <div class="input-wrapper">
                <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
                  <path d="M832 464h-68v-128c0-132.8-108.8-240-240-240s-240 107.2-240 240v128h-68c-35.2 0-64 28.8-64 64v384c0 35.2 28.8 64 64 64h616c35.2 0 64-28.8 64-64V528c0-35.2-28.8-64-64-64zM352 336c0-94.4 76.8-172 172-172s172 77.6 172 172v128H352V336zm476 576H196V528h632v384z" fill="currentColor"/>
                </svg>
                <input
                  type="password"
                  v-model="form.confirmPassword"
                  :placeholder="t('register.confirmPasswordPlaceholder')"
                  required
                />
              </div>
            </div>
            <div class="form-group">
              <button type="submit" :disabled="loading" class="login-button">
                {{ loading ? t('login.loading') : t(isLogin ? 'login.button' : 'register.button') }}
              </button>
            </div>
            <div class="switch-mode">
              <a href="#" @click.prevent="toggleMode">
                {{ t(isLogin ? 'login.toRegister' : 'login.toLogin') }}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useStore } from '../utils/stores'
import { useI18n } from 'vue-i18n'
import { auth } from '../utils/api'
import { message } from '../utils/message'

const { t, locale } = useI18n()
const store = useStore()
const loading = ref(false)
const currentLang = ref(locale.value)
const isLogin = ref(true)

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const switchLang = (lang) => {
  locale.value = lang
  currentLang.value = lang
  localStorage.setItem('locale', lang)
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  Object.assign(form, {
    email: '',
    password: '',
    confirmPassword: ''
  })
}

const handleSubmit = async () => {
  if (!isLogin.value && form.password !== form.confirmPassword) {
    message.error(t('register.passwordMismatch','validation'))
    return
  }

  loading.value = true
  try {
    if (isLogin.value) {
      await store.login(form)
    } else {
      await auth.register(form)
      message.success(t('message.success.register'))
      isLogin.value = true
      form.password = ''
    }
  } catch (err) {
    debugger
    // 统一处理登录错误
    message.error(err.message, 'server')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
  padding: 24px;
}

.login-wrapper {
  display: flex;
  width: 100%;
  max-width: 1600px;
  min-height: 800px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.login-left {
  flex: 1.2;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 80px;
}

.company-info {
  text-align: center;
  max-width: 600px;
}

.company-info h1 {
  font-size: 3.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
}

.company-info p {
  font-size: 1.5rem;
  opacity: 0.9;
  letter-spacing: 1px;
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
}

.login-box {
  width: 100%;
  max-width: 480px;
}

.login-header {
  margin-bottom: 3rem;
}

.login-header h2 {
  font-size: 2.25rem;
  color: #1976d2;
  font-weight: 500;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}

.form-group label {
  color: #333;
  font-size: 1.125rem;
  font-weight: 500;
  text-align: left;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.icon {
  position: absolute;
  left: 16px;
  color: #999;
  width: 20px;
  height: 20px;
}

input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  height: 48px;
}

input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

input::placeholder {
  color: #999;
}

.login-button {
  width: 100%;
  height: 48px;
  margin-top: 0;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: #1976d2;
  color: white;
  font-size: 1.125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.login-button:hover:not(:disabled) {
  background: #1565c0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.login-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 1400px) {
  .login-wrapper {
    min-height: 700px;
  }

  .login-left, .login-right {
    padding: 60px;
  }
}

@media (max-width: 992px) {
  .login-container {
    padding: 0;
  }

  .login-wrapper {
    flex-direction: column;
    border-radius: 0;
    min-height: 100vh;
  }

  .login-left {
    flex: none;
    padding: 48px 24px;
  }

  .login-right {
    flex: none;
    padding: 48px 24px;
    background: #f8f9fa;
  }

  .company-info h1 {
    font-size: 2.5rem;
  }

  .login-box {
    padding: 32px;
  }
}

@media (max-width: 480px) {
  .login-left {
    border-radius: 0;
    margin: 0;
    padding: 40px 20px;
  }

  .login-box {
    padding: 24px;
  }

  .company-info h1 {
    font-size: 2rem;
  }

  .company-info p {
    font-size: 1rem;
  }

  .login-header h2 {
    font-size: 1.75rem;
  }

  input, .login-button {
    font-size: 1rem;
  }
}

.lang-switch {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  gap: 8px;
}

.lang-switch button {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-switch button.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.lang-switch button:hover:not(.active) {
  border-color: #1976d2;
  color: #1976d2;
}

.switch-mode {
  margin-top: 1rem;
  text-align: center;
}

.switch-mode a {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
}

.switch-mode a:hover {
  text-decoration: underline;
}
</style>