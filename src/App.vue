<script setup>
import { onMounted, ref, watch } from 'vue'
import { useStore } from './utils/stores'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { useI18n } from 'vue-i18n'

const { t, locale: i18nLocale } = useI18n()
const store = useStore()
// 安全地获取 locale，避免在构建时出错
const getInitialLocale = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('locale') || 'zh-hans'
  }
  return 'zh-hans'
}
const locale = ref(getInitialLocale())
const elementLocale = ref(locale.value === 'zh-hans' ? zhCn : en)

// 更新HTML的lang属性
const updateHtmlLang = (newLocale) => {
  document.documentElement.lang = newLocale === 'zh-hans' ? 'zh-CN' : 'en'
}

// 更新页面标题
const updateTitle = () => {
  document.title = t('system.name')
}

// 初始设置语言
updateHtmlLang(locale.value)
// 初始设置标题
updateTitle()

// 监听语言变化
watch(locale, (newLocale) => {
  updateHtmlLang(newLocale)
})

watch(i18nLocale, () => {
  updateTitle()
})

onMounted(() => {
  // 初始化用户信息
  store.initUserInfo()
  
  // 监听storage事件，在语言变化时更新
  window.addEventListener('storage', (event) => {
    if (event.key === 'locale') {
      locale.value = event.newValue || 'zh-hans'
      elementLocale.value = locale.value === 'zh-hans' ? zhCn : en
      updateHtmlLang(locale.value)
      // 更新标题（不需要在这里调用，因为语言变化会触发watch）
    }
  })
})
</script>

<template>
  <el-config-provider :locale="elementLocale">
    <router-view></router-view>
  </el-config-provider>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
}
</style>
