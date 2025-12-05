<template>
  <div class="layout">
    <header class="header">
      <div class="logo-container">
        <button v-if="isMobileScreen" class="menu-toggle" @click="toggleSidebar">
          <el-icon><Menu /></el-icon>
        </button>
        <div class="logo">
          {{ t('system.name') }}
        </div>
      </div>
      <div class="header-right">
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
        <div class="user-info">
          <span class="username ellipsis" :title="store.userInfo?.Email || 'User'">{{ store.userInfo?.Email || 'User' }}</span>
          <button class="logout-btn" @click="handleLogout">
            {{ t('common.logout') }}
          </button>
        </div>
      </div>
    </header>
    <div class="main-container">
      <!-- 遮罩层 - 只在移动端显示折叠菜单时显示 -->
      <div 
        v-if="isMobileScreen && sidebarVisible" 
        class="sidebar-overlay"
        @click="closeSidebar"
      ></div>
      
      <aside class="sidebar" :class="{ 'sidebar-visible': isMobileScreen && sidebarVisible }">
        <nav class="nav-menu">
          <router-link to="/audit-logs" class="nav-item" :class="{ active: $route.path === '/audit-logs' }" @click="isMobileScreen && closeSidebar()">
            <el-icon><Document /></el-icon>
            <span>{{ t('auditLog.title') }}</span>
          </router-link>
          <router-link to="/post" class="nav-item" :class="{ active: $route.path === '/post' }" @click="isMobileScreen && closeSidebar()">
            <el-icon><Box /></el-icon>
            <span>文章管理</span>
          </router-link>
          <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }" @click="isMobileScreen && closeSidebar()">
            <el-icon><Box /></el-icon>
            <span>{{ t('products.title') }}</span>
          </router-link>
          <router-link to="/product-features" class="nav-item" :class="{ active: $route.path === '/product-features' }" @click="isMobileScreen && closeSidebar()">
            <el-icon><Setting /></el-icon>
            <span>{{ t('productFeatures.title') }}</span>
          </router-link>
          <router-link to="/license-types" class="nav-item" :class="{ active: $route.path === '/license-types' }" @click="isMobileScreen && closeSidebar()">
            <el-icon><List /></el-icon>
            <span>{{ t('licenseTypes.title') }}</span>
          </router-link>
          <router-link to="/firmware-versions" class="nav-item" :class="{ active: $route.path === '/firmware-versions' }" @click="isMobileScreen && closeSidebar()">
            <el-icon><Upload /></el-icon>
            <span>{{ t('firmwareVersions.title') }}</span>
          </router-link>
          <router-link to="/software-versions" class="nav-item" :class="{ active: $route.path === '/software-versions' }" @click="isMobileScreen && closeSidebar()">
            <el-icon><Monitor /></el-icon>
            <span>{{ t('softwareVersions.title') }}</span>
          </router-link>
          <router-link to="/devices" class="nav-item" :class="{ active: $route.path === '/devices' }" @click="isMobileScreen && closeSidebar()">
            <el-icon><Connection /></el-icon>
            <span>{{ t('devices.title') }}</span>
          </router-link>
        </nav>
      </aside>
      <main class="content">
        <div class="content-wrapper">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useStore } from '../utils/stores'
import { useI18n } from 'vue-i18n'
import { message } from '../utils/message'
import { useRouter } from 'vue-router'
import { Box, List, Setting, Menu, Document, Upload, Monitor, Connection } from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { ElConfigProvider } from 'element-plus'

const { t, locale, i18n } = useI18n()
const store = useStore()
const router = useRouter()
const currentLang = ref(locale.value)
const elementLocale = ref(locale.value === 'zh-hans' ? zhCn : en)

// 边栏折叠相关状态
const screenWidth = ref(window.innerWidth)
const sidebarVisible = ref(false)

// 判断是否为移动屏幕
const isMobileScreen = computed(() => {
  return screenWidth.value <= 768
})

// 监听窗口大小变化
const handleResize = () => {
  screenWidth.value = window.innerWidth
  if (screenWidth.value > 768) {
    // 大屏幕下默认显示边栏
    sidebarVisible.value = true
  } else {
    // 小屏幕下默认隐藏边栏
    sidebarVisible.value = false
  }
}

// 切换边栏显示/隐藏
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

// 关闭边栏
const closeSidebar = () => {
  sidebarVisible.value = false
}

const switchLang = (lang) => {
  localStorage.setItem('locale', lang)
  locale.value = lang
  currentLang.value = lang
  i18n.global.locale.value = lang  // 更新i18n locale
  // 更新ElementPlus的locale
  elementLocale.value = lang === 'zh-hans' ? zhCn : en
  
  // 更新HTML lang属性
  document.documentElement.lang = lang === 'zh-hans' ? 'zh-CN' : 'en'
  
  // 更新页面标题
  document.title = t('system.name')
  
  // 刷新页面以应用新的语言设置
  window.location.reload()
}

onMounted(() => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) {
    locale.value = savedLocale
    currentLang.value = savedLocale
    elementLocale.value = savedLocale === 'zh-hans' ? zhCn : en
    // 更新HTML lang属性
    document.documentElement.lang = savedLocale === 'zh-hans' ? 'zh-CN' : 'en'
    // 更新页面标题
    document.title = t('system.name')
  }
  
  // 初始化时检查屏幕大小
  handleResize()
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  // 组件销毁前移除事件监听
  window.removeEventListener('resize', handleResize)
})

const handleLogout = async () => {
  try {
    await message.confirm('logout')
    store.logout()
    router.push('/login')
  } catch (err) {
    if (err === 'cancel') {
      return
    }
    message.error(err.message,'server')
  }
}
</script>

<style scoped>
.layout {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  overflow: auto; /* 允许滚动条显示 */
}

.header {
  height: 60px;
  background: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-toggle {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: var(--text-primary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  letter-spacing: -0.025em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 32px;
}

.lang-switch {
  display: flex;
  gap: 8px;
}

.lang-switch button {
  padding: 6px 14px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-base);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.lang-switch button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.lang-switch button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}




.username {
  color: var(--text-primary);
  font-weight: 500;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-btn {
  padding: 6px 16px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-base);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.logout-btn:hover {
  color: var(--danger-color);
  border-color: var(--danger-color);
  background: var(--danger-bg);
}

.main-container {
  display: flex;
  margin-top: 60px;
  flex: 1;
  position: relative;
  overflow: auto; /* 允许滚动条显示 */
}

.sidebar-overlay {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 990;
}

.sidebar {
  width: 280px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 20px 0;
  flex-shrink: 0; /* 不收缩 */
  transition: transform 0.3s ease;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
}

.nav-item {
  padding: 10px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item:hover {
  background: var(--secondary-bg);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--primary-bg);
  color: var(--primary-color);
}

.nav-item .el-icon {
  font-size: 1.1em;
}

.content {
  flex: 1;
  background: #f8fafc;
  height: calc(100vh - 60px);
  min-width: 1200px; /* 最小宽度 */
  overflow: auto;
  flex-shrink: 0; /* 不收缩，强制应用 min-width */
}

.content-wrapper {
  padding: 24px 32px;
  height: 100%;
  min-width: 1200px; /* 确保内容宽度至少 1200px */
  overflow: auto;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 60px;
    bottom: 0;
    z-index: 995;
    transform: translateX(-100%);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  }
  
  .sidebar-visible {
    transform: translateX(0);
  }
  
  .content {
    margin-left: 0;
    padding: 16px;
    height: calc(100vh - 60px);
    overflow: auto;
    min-width: 1200px; /* 移动端也保持最小宽度 */
  }
  
  .header {
    padding: 0 16px;
  }
  
  .header-right {
    gap: 16px;
  }
  
  .username {
    display: none;
  }
  
  .lang-switch button {
    padding: 4px 10px;
    font-size: 0.75rem;
  }
}
</style>