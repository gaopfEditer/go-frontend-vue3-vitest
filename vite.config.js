import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'; // 引入 fs 模块

// ES 模块中获取 __dirname 的替代方法
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 读取 style.css 文件内容（在配置加载时执行）
let styleCssContent = ''
try {
  const styleCssPath = path.resolve(__dirname, 'src/styles/style.css')
  if (fs.existsSync(styleCssPath)) {
    styleCssContent = fs.readFileSync(styleCssPath, 'utf-8')
  }
} catch (error) {
  // 静默失败，使用空字符串
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  optimizeDeps: {
    include: ['element-plus']
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 将 style.css 的内容注入到每个 scss 文件
        additionalData: styleCssContent
      },
      less: {
        // Less 配置
        additionalData: styleCssContent,
        modifyVars: {
          // 可以在这里定义 Less 变量
        }
      }
    },
  },
  server: {
    force: true, // 强制重新构建优化的依赖
    proxy: {
      '/activate': {
        target: 'https://localhost:17080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.js',
        '**/router/**',
        '**/main.js'
      ],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      }
    },
    
    // 测试超时
    testTimeout: 10000
  }
})