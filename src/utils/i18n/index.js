import { createI18n } from 'vue-i18n'
import en from '../../locales/en-new'
import zhHans from '../../locales/zh-hans-new'

// 安全地获取 locale，避免在构建时出错
function getLocale() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('locale') || 'zh-hans'
  }
  return 'zh-hans'
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getLocale(),
  fallbackLocale: 'zh-hans',
  messages: {
    'en': en,
    'zh-hans': zhHans
  }
})

export default i18n 