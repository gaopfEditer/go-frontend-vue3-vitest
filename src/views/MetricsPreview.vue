<template>
  <div class="metrics-preview">
    <div class="toolbar">
      <input v-model="filterPages" placeholder="按页面过滤，逗号分隔，如 /,/login,/products" />
      <select v-model="rangeHours">
        <option :value="1">近1小时</option>
        <option :value="6">近6小时</option>
        <option :value="24">近24小时</option>
        <option :value="72">近72小时</option>
      </select>
      <button @click="reload">刷新</button>
      <button @click="triggerResources">触发资源加载</button>
      <button @click="markStable">上报 page-stable</button>
    </div>

    <div class="grid">
      <div v-for="card in cards" :key="card.page" class="card">
        <div class="card-header">
          <div class="page">{{ card.page }}</div>
          <div class="meta">最近更新时间：{{ card.updatedAt || '-' }}</div>
        </div>
        <div class="metrics">
          <div class="item">
            <span class="label">LCP</span>
            <span :class="statusClass(card.status.lcp)">{{ formatMs(card.values.lcp, 's') }}</span>
          </div>
          <div class="item">
            <span class="label">FCP</span>
            <span :class="statusClass(card.status.fcp)">{{ formatMs(card.values.fcp, 's') }}</span>
          </div>
          <div class="item">
            <span class="label">CLS</span>
            <span :class="statusClass(card.status.cls)">{{ formatNum(card.values.cls) }}</span>
          </div>
          <div class="item">
            <span class="label">INP</span>
            <span :class="statusClass(card.status.inp)">{{ formatMs(card.values.inp) }}</span>
          </div>
          <div class="item">
            <span class="label">TTFB</span>
            <span :class="statusClass(card.status.ttfb)">{{ formatMs(card.values.ttfb) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tips">
      <p>提示：可在控制台设置 <code>localStorage.setItem('metrics:sample','1')</code> 强制全量采样。</p>
    </div>

    <div class="assets" ref="assetsRef" style="display:none;"></div>

    <div v-if="debug" class="debug">
      <div class="debug-bar">
        <button @click="sendDebugPing">发送 debugPing</button>
        <button @click="clearDebug">清空调试输出</button>
      </div>
      <pre class="log" v-for="(d,i) in debugLogs" :key="i">{{ d }}</pre>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { markPageStable } from '../utils/metrics'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { getRequest } from '../utils/api/request'

const assetsRef = ref(null)
const route = useRoute()

const cards = ref([])
const rangeHours = ref(6)
const filterPages = ref('')

onMounted(() => {
  reload()
  if (debug.value) {
    window.addEventListener('metrics:emit', onMetricsEmit)
  }
})

onBeforeUnmount(() => {
  if (debug.value) {
    window.removeEventListener('metrics:emit', onMetricsEmit)
  }
})

function statusOf(metricName, value) {
  if (value == null) return 'na'
  switch (metricName) {
    case 'lcp':
      return value <= 2500 ? 'good' : value <= 4000 ? 'ni' : 'poor'
    case 'fcp':
      return value <= 1800 ? 'good' : value <= 3000 ? 'ni' : 'poor'
    case 'cls':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'ni' : 'poor'
    case 'inp':
      return value <= 200 ? 'good' : value <= 500 ? 'ni' : 'poor'
    case 'ttfb':
      return value <= 800 ? 'good' : value <= 1800 ? 'ni' : 'poor'
    default:
      return 'na'
  }
}

function formatMs(v, unit = 'ms') {
  if (v == null) return '-'
  if (unit === 's') return (v / 1000).toFixed(2) + 's'
  return Math.round(v) + 'ms'
}

function formatNum(v) { return v == null ? '-' : v.toFixed(3) }

function statusClass(s) {
  return {
    tag: true,
    good: s === 'good',
    ni: s === 'ni',
    poor: s === 'poor',
    na: s === 'na'
  }
}

async function reload() {
  const endTs = Date.now()
  const startTs = endTs - rangeHours.value * 3600 * 1000
  const pages = filterPages.value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  // 拉取 web-vitals 数据
  const listParams = {
    page: 1,
    page_size: 500,
    type: 'web-vitals',
    startTs,
    endTs
  }
  try {
    const res = await getRequest('/activate/metrics/list', listParams)
    // 期望 res.data 如 { list: [...], total: N }，根据你后端返回调整
    const items = (res.data && res.data.list) || res.list || []
    const grouped = new Map()
    for (const it of items) {
      const page = it.page || it.route || '-'
      if (pages.length && !pages.includes(page)) continue
      let payloadObj = null
      try { payloadObj = JSON.parse(it.payload || '{}') } catch {}
      const m = payloadObj && payloadObj.Metric
      if (!m || !m.name) continue
      const key = page
      if (!grouped.has(key)) {
        grouped.set(key, {
          page,
          values: { lcp: null, fcp: null, cls: null, inp: null, ttfb: null },
          updatedAt: null
        })
      }
      const g = grouped.get(key)
      const ts = it.ts || Date.now()
      if (!g.updatedAt || ts > g._updatedTs) {
        g._updatedTs = ts
        g.updatedAt = dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
      }
      const name = (m.name || m.Name || '').toUpperCase()
      const val = m.value != null ? m.value : m.Value
      if (name === 'LCP') g.values.lcp = Math.max(val * (val < 10 ? 1000 : 1), g.values.lcp ?? 0)
      if (name === 'FCP') g.values.fcp = Math.max(val * (val < 10 ? 1000 : 1), g.values.fcp ?? 0)
      if (name === 'CLS') g.values.cls = Math.max(val, g.values.cls ?? 0)
      if (name === 'INP') g.values.inp = Math.max(val, g.values.inp ?? 0)
      if (name === 'TTFB') g.values.ttfb = Math.max(val, g.values.ttfb ?? 0)
    }
    const result = []
    grouped.forEach((g) => {
      const status = {
        lcp: statusOf('lcp', g.values.lcp),
        fcp: statusOf('fcp', g.values.fcp),
        cls: statusOf('cls', g.values.cls),
        inp: statusOf('inp', g.values.inp),
        ttfb: statusOf('ttfb', g.values.ttfb)
      }
      result.push({ page: g.page, values: g.values, status, updatedAt: g.updatedAt })
    })
    // 简单按 lcp 降序排序
    result.sort((a, b) => (b.values.lcp || 0) - (a.values.lcp || 0))
    cards.value = result
  } catch (e) {
    console.error('加载 metrics 列表失败', e)
    cards.value = []
  }
}

function triggerResources() {
  try {
    const container = assetsRef.value
    if (!container) return
    for (let i = 0; i < 3; i++) {
      const img = new Image()
      img.src = `https://via.placeholder.com/${300 + i * 50}`
      container.appendChild(img)
    }
    const s = document.createElement('script')
    s.src = 'data:text/javascript;charset=utf-8,' + encodeURIComponent('console.log("metrics preview script loaded")')
    document.body.appendChild(s)
  } catch {}
}

function markStable() {
  const ctx = { page: route.fullPath, pageId: `${route.fullPath}#preview` }
  markPageStable(ctx, { manual: true })
}

// Debug 面板
const debug = ref(localStorage.getItem('metrics:debug') === '1')
const debugLogs = ref([])
function onMetricsEmit(e) {
  try {
    debugLogs.value.unshift(JSON.stringify(e.detail))
    if (debugLogs.value.length > 50) debugLogs.value.length = 50
  } catch {}
}
async function sendDebugPing() {
  try {
    const m = await import('../utils/metrics')
    m.debugPing({ from: 'MetricsPreview' })
  } catch {}
}
function clearDebug() { debugLogs.value = [] }
</script>

<style scoped>
.metrics-preview { padding: 16px; }
.toolbar { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
.toolbar input { width: 360px; padding: 6px 8px; }
.toolbar select, .toolbar button { padding: 6px 8px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
.card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: #fff; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.card-header .page { font-weight: 600; }
.metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.item { display: flex; justify-content: space-between; align-items: center; }
.label { color: #666; }
.tag { padding: 2px 8px; border-radius: 999px; font-size: 12px; }
.good { background: #e8faf0; color: #0f9d58; }
.ni { background: #fff7e6; color: #fa8c16; }
.poor { background: #fdecea; color: #d93025; }
.na { background: #f4f4f5; color: #666; }
.tips { color: #666; font-size: 13px; margin-top: 12px; }
button { cursor: pointer; }
.debug { margin-top: 16px; border-top: 1px dashed #ddd; padding-top: 12px; }
.debug-bar { display: flex; gap: 8px; margin-bottom: 8px; }
.log { background: #0b1020; color: #cde6ff; padding: 8px; border-radius: 6px; overflow: auto; }
</style>


