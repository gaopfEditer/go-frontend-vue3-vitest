import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import './styles/style.css'  // 先加载全局变量
import 'element-plus/dist/index.css'  // 然后是 Element Plus 默认样式
import './styles/element-plus-theme.scss'  // 主题覆盖
import './styles/global.css'  // 最后加载全局样式，确保能覆盖其他样式
import App from './App.vue'
import router from './router'
import i18n from './utils/i18n'

// 配置Element Plus
const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
