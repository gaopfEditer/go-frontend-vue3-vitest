import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'; // 引入 fs 模块

const styleCssContent = fs.readFileSync(path.resolve(__dirname, 'src/styles/style.css'), 'utf-8'); // 读取 style.css 文件内容

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
        additionalData: `${styleCssContent}`
      },
      less: {
        // Less 配置
        additionalData: `${styleCssContent}`,
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
        target: 'http://localhost:17080',
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