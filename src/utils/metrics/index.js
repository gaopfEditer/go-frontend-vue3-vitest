import { onLCP, onFCP, onCLS, onINP, onTTFB } from 'web-vitals'

// 简单配置：可通过环境变量或 localStorage 配置
// 与后端接口保持一致：新增接口路径
const DEFAULT_ENDPOINT = '/activate/metrics/add'
const DEFAULT_SAMPLE_RATE = 0.1

function getConfig() {
  const endpoint = (import.meta && import.meta.env && import.meta.env.VITE_METRICS_ENDPOINT) ||
    localStorage.getItem('metrics:endpoint') ||
    DEFAULT_ENDPOINT
  const sample = Number(
    (import.meta && import.meta.env && import.meta.env.VITE_METRICS_SAMPLE) ||
    localStorage.getItem('metrics:sample') ||
    DEFAULT_SAMPLE_RATE
  )
  const debug = localStorage.getItem('metrics:debug') === '1'
  return { endpoint, sample: Number.isFinite(sample) ? sample : DEFAULT_SAMPLE_RATE, debug }
}

// 会话级固定采样：一次决定，整个会话保持一致，避免来回跳变
function shouldSample(sampleRate) {
  try {
    // 强制开关或采样率为1/调试模式时，直接采样并写入会话缓存
    const debug = localStorage.getItem('metrics:debug') === '1'
    const force = localStorage.getItem('metrics:force') === '1'
    if (debug || force || sampleRate >= 1) {
      sessionStorage.setItem('metrics:sampled', '1')
      return true
    }
    const key = 'metrics:sampled'
    const cached = sessionStorage.getItem(key)
    if (cached === '1') return true
    if (cached === '0') return false
    const win = Math.random() < sampleRate
    sessionStorage.setItem(key, win ? '1' : '0')
    return win
  } catch {
    return Math.random() < sampleRate
  }
}

async function sendBody(endpoint, body) {
  // 强制使用 axios 封装，确保带上 Authorization/Language 等拦截器逻辑
  try {
    if (localStorage.getItem('metrics:debug') === '1') {
      // eslint-disable-next-line no-console
      console.info('[metrics][send]', endpoint, body)
    }
    const mod = await import('../api/request')
    await mod.postRequest(endpoint, JSON.parse(body))
  } catch (_) {
    // 静默失败，避免影响用户交互
  }
}

// 存储最近上报的指标，用于防重复（短时间内相同的指标不上报）
const recentMetrics = new Map()
const METRIC_DEDUP_TTL = 5000 // 5秒内相同的指标不上报

function postMetric(type, routeCtx, data) {
  const { endpoint } = getConfig()
  const ctx = baseContext(routeCtx)
  // 按后端要求使用 snake_case 字段名
  const record = {
    type,
    ts: Date.now(),
    page: ctx.page || '',
    page_id: ctx.pageId || '',
    referrer: ctx.referrer || '',
    user_agent: ctx.userAgent || ''
  }
  // 后端要求 payload 为字符串
  const payload = JSON.stringify({ ...data })
  
  // 对于 web-vitals 类型，添加去重逻辑（CLS 等指标会持续触发）
  if (type === 'web-vitals' && data && data.Metric) {
    const metricName = data.Metric.name || ''
    const metricValue = data.Metric.value
    const dedupKey = `${type}:${metricName}:${metricValue}`
    const now = Date.now()
    const lastTime = recentMetrics.get(dedupKey) || 0
    
    // 如果5秒内上报过相同值的指标，跳过（CLS 等会持续触发相同值）
    if (now - lastTime < METRIC_DEDUP_TTL) {
      const debug = localStorage.getItem('metrics:debug') === '1'
      if (debug) {
        // eslint-disable-next-line no-console
        console.info('[metrics][dedup]', dedupKey, 'skipped')
      }
      return
    }
    recentMetrics.set(dedupKey, now)
    
    // 清理过期的记录（避免内存泄漏）
    if (recentMetrics.size > 100) {
      const expireTime = now - METRIC_DEDUP_TTL
      for (const [key, time] of recentMetrics.entries()) {
        if (time < expireTime) {
          recentMetrics.delete(key)
        }
      }
    }
  }
  
  const body = JSON.stringify({ ...record, payload })
  // 调试事件：页面可通过 window 监听 metrics:emit 来展示
  try {
    if (localStorage.getItem('metrics:debug') === '1') {
      const detail = { ...record, payload: JSON.parse(payload) }
      window.dispatchEvent(new CustomEvent('metrics:emit', { detail }))
    }
  } catch {}
  sendBody(endpoint, bodyStr)
}

// 仅保留后端期望的 WebVital 字段
function sanitizeWebVital(metric) {
  const allowTop = ['name', 'value', 'rating', 'delta', 'entries', 'id', 'navigationType']
  const out = {}
  for (const k of allowTop) if (metric[k] !== undefined) out[k] = metric[k]
  if (Array.isArray(metric.entries)) {
    out.entries = metric.entries.map((e) => ({
      name: e.name,
      entryType: e.entryType,
      startTime: e.startTime,
      duration: e.duration,
      // LCP 专有字段按需保留
      size: e.size,
      renderTime: e.renderTime,
      loadTime: e.loadTime,
      id: e.id,
      url: e.url
    }))
  }
  return out
}

function baseContext(routeCtx) {
  return {
    page: routeCtx && routeCtx.page,
    pageId: routeCtx && routeCtx.pageId,
    referrer: document.referrer || '',
    userAgent: navigator.userAgent,
  }
}

// 存储 web-vitals 监听器的清理函数
let webVitalsCleanups = []
// 标记是否已经初始化
let webVitalsInitialized = false
// 当前路由上下文（用于动态更新）
let currentRouteCtx = {}

// 清理所有 web-vitals 监听器
function cleanupWebVitals() {
  webVitalsCleanups.forEach(cleanup => {
    try {
      if (typeof cleanup === 'function') cleanup()
    } catch {}
  })
  webVitalsCleanups = []
  webVitalsInitialized = false
}

export function initWebVitals(routeCtx = {}) {
  const { sample, debug } = getConfig()
  if (!shouldSample(sample)) return

  // 更新当前路由上下文
  currentRouteCtx = routeCtx

  // 如果已经初始化过，不再重复注册监听器
  // Web Vitals 监听器应该是全局的，避免重复注册导致重复上报
  if (webVitalsInitialized) {
    return
  }

  const report = (metric) => {
    // 清洗为白名单字段（仅保留指定结构）
    const cleaned = sanitizeWebVital(metric)
    // 使用当前最新的路由上下文
    const ctx = currentRouteCtx || routeCtx
    if (debug) {
      // eslint-disable-next-line no-console
      console.info('[metrics][web-vitals]', ctx, cleaned)
    }
    postMetric('web-vitals', ctx, { Metric: cleaned })
  }

  // 存储清理函数
  const fcpCleanup = onFCP(report)
  const lcpCleanup = onLCP(report)
  const clsCleanup = onCLS(report)
  const inpCleanup = onINP(report)
  const ttfbCleanup = onTTFB(report)

  // 如果返回的是清理函数，则存储它们
  if (fcpCleanup) webVitalsCleanups.push(fcpCleanup)
  if (lcpCleanup) webVitalsCleanups.push(lcpCleanup)
  if (clsCleanup) webVitalsCleanups.push(clsCleanup)
  if (inpCleanup) webVitalsCleanups.push(inpCleanup)
  if (ttfbCleanup) webVitalsCleanups.push(ttfbCleanup)

  webVitalsInitialized = true
}

// 存储 longtask observer 实例
let longtaskObserver = null

// 清理 longtask observer
function cleanupLongtaskObserver() {
  try {
    if (longtaskObserver) {
      longtaskObserver.disconnect()
      longtaskObserver = null
    }
  } catch {}
}

export function observeExtras(routeCtx = {}) {
  const { sample, debug } = getConfig()
  if (!shouldSample(sample)) return

  // 先清理旧的 longtask observer
  cleanupLongtaskObserver()

  // navigation timing（仅在硬刷新时存在一条）
  try {
    const nav = performance.getEntriesByType('navigation')[0]
    if (nav) {
      const detail = {
        startTime: nav.startTime,
        fetchStart: nav.fetchStart,
        requestStart: nav.requestStart,
        responseStart: nav.responseStart,
        responseEnd: nav.responseEnd,
        domContentLoadedEventEnd: nav.domContentLoadedEventEnd,
        loadEventEnd: nav.loadEventEnd,
        transferSize: nav.transferSize,
        encodedBodySize: nav.encodedBodySize,
        decodedBodySize: nav.decodedBodySize
      }
      if (debug) {
        // eslint-disable-next-line no-console
        console.info('[metrics][navigation]', routeCtx, detail)
      }
      postMetric('navigation-timing', routeCtx, { value: nav.responseEnd, detail })
    }
  } catch {}

  // longtask 监听
  try {
    longtaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      for (const e of entries) {
        if (debug) {
          // eslint-disable-next-line no-console
          console.info('[metrics][longtask]', routeCtx, e)
        }
        postMetric('longtask', routeCtx, { value: e.duration, name: e.name, startTime: e.startTime })
      }
    })
    longtaskObserver.observe({ entryTypes: ['longtask'] })
  } catch {}

  // resources（首屏阶段的关键资源，可按需裁剪）
  try {
    const res = performance.getEntriesByType('resource')
    const top = res
      .filter(r => r.initiatorType !== 'xmlhttprequest' && r.initiatorType !== 'fetch')
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10)
      .map(r => ({ name: r.name, initiatorType: r.initiatorType, duration: r.duration, transferSize: r.transferSize }))
    if (top.length) {
      if (debug) {
        // eslint-disable-next-line no-console
        console.info('[metrics][resource-top]', routeCtx, top)
      }
      postMetric('resource-top', routeCtx, { items: top })
    }
  } catch {}
}

// 可选：首屏稳定标记，业务可在主组件数据加载完后调用
export function markPageStable(routeCtx = {}, extra = {}) {
  const { endpoint, sample } = getConfig()
  if (!shouldSample(sample)) return
  postMetric('page-stable', routeCtx, { extra })
}

// 每次路由切换时发送一个轻量打点，便于确认“有调用到后端”
export function trackRouteView(routeCtx = {}, from = null, to = null) {
  const { debug } = getConfig()
  const now = Date.now()
  // 轻量但包含关键上下文
  let sinceLastRouteMs = undefined
  try {
    const last = Number(sessionStorage.getItem('metrics:lastRouteTs') || 0)
    if (last) sinceLastRouteMs = now - last
    sessionStorage.setItem('metrics:lastRouteTs', String(now))
  } catch {}

  const info = {
    from: from && from.fullPath ? from.fullPath : undefined,
    to: to && to.fullPath ? to.fullPath : undefined,
    toName: to && (to.name || undefined),
    toParams: to && to.params && Object.keys(to.params).length ? to.params : undefined,
    toQuery: to && to.query && Object.keys(to.query).length ? to.query : undefined,
    ts: now,
    sinceLastRouteMs
  }
  if (debug) {
    // eslint-disable-next-line no-console
    console.info('[metrics][route-view]', routeCtx, info)
  }
  postMetric('route-view', routeCtx, info)
}

// 路由级节流：同一路由在 ttlMs 内仅监听/上报一次（默认1小时）
export function shouldTrackRouteOnce(page, ttlMs = 3600000) {
  try {
    if (!page) return true
    if (localStorage.getItem('metrics:debug') === '1') return true
    const key = `metrics:route:last:${page}`
    const now = Date.now()
    const last = Number(localStorage.getItem(key) || 0)
    if (!last || now - last > ttlMs) {
      localStorage.setItem(key, String(now))
      return true
    }
    return false
  } catch {
    return true
  }
}

// 手动调试用：立即发送一个 debug-ping 事件
export function debugPing(extra = {}) {
  const page = location && location.pathname ? location.pathname : ''
  const routeCtx = { page, pageId: `${page}#debug` }
  postMetric('debug-ping', routeCtx, { extra, ts: Date.now() })
}

// ============ SPA 软导航 LCP 近似采集 ============
let softLcpObserver = null
let softLcpBest = null
let softLcpTimer = null

function resetSoftLcp() {
  try { if (softLcpObserver) softLcpObserver.disconnect() } catch {}
  softLcpObserver = null
  softLcpBest = null
  if (softLcpTimer) clearTimeout(softLcpTimer)
  softLcpTimer = null
}

// 在路由切换后启动一次 LCP 监听，2s 内没有更大元素则视为稳定，最多监听5s
export function startSoftLCP(routeCtx = {}) {
  try { resetSoftLcp() } catch {}
  try {
    softLcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      for (const e of entries) {
        if (!softLcpBest || e.startTime > softLcpBest.startTime) {
          softLcpBest = e
        }
      }
      if (softLcpTimer) clearTimeout(softLcpTimer)
      softLcpTimer = setTimeout(() => finishSoftLcp(routeCtx), 2000)
    })
    softLcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    // 最多5秒后强制结束
    softLcpTimer = setTimeout(() => finishSoftLcp(routeCtx), 5000)
  } catch {}
}

function finishSoftLcp(routeCtx) {
  const { debug } = getConfig()
  try { if (softLcpObserver) softLcpObserver.disconnect() } catch {}
  softLcpObserver = null
  if (!softLcpBest) return
  // 组装成与 web-vitals LCP 接近的结构
  const entry = softLcpBest
  const metric = sanitizeWebVital({
    name: 'LCP',
    value: entry.startTime,
    rating: entry.startTime <= 2500 ? 'good' : entry.startTime <= 4000 ? 'needs-improvement' : 'poor',
    delta: entry.startTime,
    id: `soft-${Date.now()}`,
    navigationType: 'spa-soft',
    entries: [{
      name: entry.element && entry.element.tagName ? entry.element.tagName.toLowerCase() : '',
      entryType: 'largest-contentful-paint',
      startTime: entry.startTime,
      duration: entry.duration,
      size: entry.size,
      renderTime: entry.renderTime,
      loadTime: entry.loadTime,
      id: entry.id,
      url: entry.url
    }]
  })
  if (debug) {
    // eslint-disable-next-line no-console
    console.info('[metrics][soft-lcp]', routeCtx, metric)
  }
  postMetric('web-vitals', routeCtx, { Metric: metric })
  softLcpBest = null
  if (softLcpTimer) clearTimeout(softLcpTimer)
  softLcpTimer = null
}


