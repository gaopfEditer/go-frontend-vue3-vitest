import { vi, beforeEach } from 'vitest'

// 全局配置
beforeEach(() => {
  // 每次测试前清理 DOM
  document.body.innerHTML = ''
  
  // 清理 localStorage
  if (typeof Storage !== 'undefined') {
    localStorage.clear()
  }
})

// 模拟 window.matchMedia（某些组件需要）
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

// 确保 localStorage 存在
if (typeof Storage === 'undefined') {
  global.localStorage = {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0
  }
}

