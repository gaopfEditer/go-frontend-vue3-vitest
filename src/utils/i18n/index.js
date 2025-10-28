import { createI18n } from 'vue-i18n'
import en from '../../locales/en-new'
import zhHans from '../../locales/zh-hans-new'

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: localStorage.getItem('locale') || 'zh-hans',
  fallbackLocale: 'zh-hans',
  messages: {
    'en': en,
    'zh-hans': zhHans
  }
})

export default i18n 