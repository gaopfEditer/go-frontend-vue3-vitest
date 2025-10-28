<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">{{ t('auditLog.title') }}</h2>
    </div>

    <!-- 过滤器区域 -->
    <div class="filter-container">
      <el-form :inline="true" class="filter-form">
        <!-- 时间范围选择 -->
        <el-form-item :label="t('auditLog.filter.timeRange')" class="form-item-time">
          <el-date-picker v-model="filterForm.timeRange" type="datetimerange"
            :start-placeholder="t('auditLog.filter.startTime')" :end-placeholder="t('auditLog.filter.endTime')"
            :shortcuts="dateShortcuts" value-format="YYYY-MM-DDTHH:mm:ss.SSSZ" range-separator="至"
            @change="handleTimeRangeChange" style="width: 380px;" />
        </el-form-item>

        <!-- 模块选择 -->
        <el-form-item :label="t('auditLog.filter.module')" class="form-item">
          <el-select v-model="filterForm.module" clearable @change="handleSearch" style="width: 180px;"
            :placeholder="t('auditLog.filter.modulePlaceholder')">
            <el-option v-for="(option, index) in moduleOptions" :key="index" :label="option.label"
              :value="option.key" />
          </el-select>
        </el-form-item>

        <!-- 操作类型选择 -->
        <el-form-item :label="t('auditLog.filter.action')" class="form-item">
          <el-select v-model="filterForm.operation" clearable @change="handleSearch" style="width: 180px;"
            :placeholder="t('auditLog.filter.actionPlaceholder')">
            <el-option v-for="(option, index) in actionOptions" :key="index" :label="option.label"
              :value="option.key" />
          </el-select>
        </el-form-item>

        <!-- 搜索按钮 -->
        <el-form-item class="search-btn-item">
          <el-button type="primary" circle @click="handleSearch">
            <el-icon><Search /></el-icon>
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 活跃筛选条件 -->
      <div v-if="filterForm.productId" class="active-filters">
        <el-tag closable @close="clearProductFilter">
          {{ t('auditLog.filter.filteredByProduct') }}: {{ getProductName(filterForm.productId) }}
        </el-tag>
      </div>
    </div>

    <!-- 日志表格 -->
    <div class="table-container">
      <el-table v-loading="loading" :data="logs" style="width: 100%" border stripe
        :header-cell-style="{ background: '#f5f7fa' }">
        <!-- 操作时间 -->
        <el-table-column :label="t('auditLog.table.time')" prop="createdAt" width="200" :formatter="formatDateTime" />

        <!-- 操作者 -->
        <el-table-column :label="t('auditLog.table.operator')" min-width="180">
          <template #default="{ row }">
            <el-popover placement="right" :width="320" trigger="click">
              <template #reference>
                <el-button link type="primary">{{ row.userEmail }}</el-button>
              </template>
              <div class="user-card">
                <h3>{{ t('auditLog.userCard.title') }}</h3>
                <div class="user-info">
                  <p>
                    <span class="label">{{ t('auditLog.userCard.email') }}:</span>
                    <span class="operator-ellipsis" :title="row.userEmail">{{ row.userEmail }}</span>
                  </p>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <!-- 操作模块 -->
        <el-table-column :label="t('auditLog.table.module')" prop="module" min-width="150">
          <template #default="{ row }">
            {{moduleOptions.find(m => m.key === row.module)?.label || row.module}}
          </template>
        </el-table-column>

        <!-- 操作类型 -->
        <el-table-column :label="t('auditLog.table.action')" prop="operation" min-width="120">
          <template #default="{ row }">
            {{actionOptions.find(a => a.key === row.operation)?.label || row.operation}}
          </template>
        </el-table-column>

        <!-- 相关产品 -->
        <el-table-column :label="t('auditLog.table.product')" min-width="180">
          <template #default="{ row }">
            <template v-if="row.productId">
              <el-dropdown trigger="click">
                <el-button type="primary" link>
                  {{ row.productName }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="filterByProduct(row.productId)">
                      <el-icon><Filter /></el-icon> 
                      {{ t('auditLog.product.filter') }}
                    </el-dropdown-item>
                    <el-dropdown-item v-if="filterForm.productId" @click="clearProductFilter" divided>
                      <el-icon><Remove /></el-icon> 
                      {{ t('auditLog.product.clearFilter') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <!-- IP地址 -->
        <el-table-column :label="t('auditLog.table.ip')" prop="ipAddress" min-width="180" />

        <!-- 详情 -->
        <el-table-column :label="t('auditLog.table.details')" width="120" align="left">
          <template #default="{ row }">
            <el-button link type="primary" @click="showDetails(row.detail)">
              {{ t('auditLog.viewDetails') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 详情弹窗 -->
      <el-dialog v-model="detailsDialogVisible" :title="t('auditLog.detailsDialog.title')" width="60%">
        <div class="details-dialog-content">
          <pre><code class="hljs json" v-html="formattedDetails"></code></pre>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="copyDetails">
              {{ t('auditLog.detailsDialog.copy') }}
            </el-button>
            <el-button @click="detailsDialogVisible = false">
              {{ t('common.cancel') }}
            </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination :current-page="pagination.currentPage" :page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { auditLog, product } from '../utils/api'
import { message } from '../utils/message'
import dayjs from 'dayjs'
import { debounce } from 'lodash-es'
import { Search, Filter, ArrowDown, Remove } from '@element-plus/icons-vue'

const { t } = useI18n()
const router = useRouter()

// 定义模块选项
const moduleOptions = [
  { key: 'user', label: t('auditLog.modules.user') },
  { key: 'auth', label: t('auditLog.modules.auth') },
  { key: 'product', label: t('auditLog.modules.product') },
  { key: 'feature', label: t('auditLog.modules.feature') },
  { key: 'license_type', label: t('auditLog.modules.license_type') },
  { key: 'firmware_version', label: t('auditLog.modules.firmware_version') },
  { key: 'software_version', label: t('auditLog.modules.software_version') },
  { key: 'device', label: t('auditLog.modules.device') }
]

// 定义操作类型选项
const actionOptions = [
  { key: 'create', label: t('auditLog.actions.create') },
  { key: 'update', label: t('auditLog.actions.update') },
  { key: 'delete', label: t('auditLog.actions.delete') },
  { key: 'login', label: t('auditLog.actions.login') },
  { key: 'register', label: t('auditLog.actions.register') }
]

// 加载状态
const loading = ref(false)
const productsLoading = ref(false)

// 日志数据
const logs = ref([])
const products = ref([])

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 过滤表单
const filterForm = reactive({
  timeRange: [],
  module: '',
  operation: '',
  productId: null
})

// 详情弹窗
const detailsDialogVisible = ref(false)
const currentDetails = ref('')
const formattedDetails = ref('')

// 日期快捷选项
const dateShortcuts = [
  {
    text: t('auditLog.filter.shortcuts.lastWeek'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: t('auditLog.filter.shortcuts.lastMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: t('auditLog.filter.shortcuts.lastThreeMonths'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  }
]

// 格式化日期时间
const formatDateTime = (row, column, cellValue) => {
  if (!cellValue) return ''
  return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
}

// 处理时间范围变化
const handleTimeRangeChange = () => {
  handleSearch()
}

// 加载日志数据
const loadLogs = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      module: filterForm.module,
      operation: filterForm.operation,
      product_id: filterForm.productId
    }

    // 添加时间范围
    if (filterForm.timeRange?.length === 2) {
      params.start_time = dayjs(filterForm.timeRange[0]).format()
      params.end_time = dayjs(filterForm.timeRange[1]).format()
    }

    const response = await auditLog.list(params)
    
    // 将API返回的下划线命名转换为驼峰命名
    logs.value = (response.data.list || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      userEmail: item.user_email,
      module: item.module,
      operation: item.operation,
      productId: item.product_id,
      productName: item.product_name,
      detail: item.detail,
      ipAddress: item.ip_address,
      createdAt: item.created_at
    }))
    
    pagination.total = response.data.total || 0
  } catch (error) {
    message.error(error.message || '加载数据失败','server')
  } finally {
    loading.value = false
  }
}

// 处理产品搜索
const handleProductSearch = debounce(async (query) => {
  if (query.length < 2) return
  
  productsLoading.value = true
  try {
    const response = await product.search({ keyword: query })
    products.value = response.data.list || []
  } catch (error) {
    message.error(error.message,'server')
  } finally {
    productsLoading.value = false
  }
}, 300)

// 显示详情
const showDetails = (details) => {
  try {
    let parsed = details;
    
    // 如果是字符串，尝试解析为JSON
    if (typeof details === 'string') {
      parsed = JSON.parse(details);
    }
    
    currentDetails.value = parsed;
    
    // 格式化JSON显示
    formattedDetails.value = JSON.stringify(parsed, null, 2)
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        match => {
          let cls = 'json-value'
          if (/^"/.test(match)) {
            cls = /:$/.test(match) ? 'json-key' : 'json-string'
          } else if (/true|false|null/.test(match)) {
            cls = 'json-literal'
          } else if (/^-?\d+/.test(match)) {
            cls = 'json-number'
          }
          return `<span class="${cls}">${match}</span>`
        });
    
    detailsDialogVisible.value = true;
  } catch (error) {
    console.error('解析JSON失败:', error);
    message.error(t('auditLog.error.invalidJson','server'));
  }
}

// 复制详情
const copyDetails = async () => {
  try {
    await navigator.clipboard.writeText(
      typeof currentDetails.value === 'string' 
        ? currentDetails.value 
        : JSON.stringify(currentDetails.value, null, 2)
    )
    message.success(t('common.copySuccess'))
  } catch (error) {
    message.error(t('common.copyFailed'),'server')
  }
}

// 按产品ID筛选
const filterByProduct = (productId) => {
  filterForm.productId = productId
  handleSearch()
}

// 清除产品筛选
const clearProductFilter = () => {
  filterForm.productId = null
  handleSearch()
}

// 获取产品名称
const getProductName = (productId) => {
  const product = logs.value.find(log => log.productId === productId)
  return product ? product.productName : productId
}

// 处理搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadLogs()
}

// 处理每页数量变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadLogs()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  loadLogs()
}

onMounted(() => {
  loadLogs()
})
</script>

<style>
.operator-ellipsis{
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<style scoped>
.filter-container {
  margin-bottom: 24px;
  padding: 24px;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.filter-form {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

.form-item {
  margin-right: 10px;
  margin-bottom: 0;
}

.form-item-time {
  margin-right: 10px;
  margin-bottom: 0;
  flex-shrink: 0;
}

.search-btn-item {
  margin-left: auto;
  margin-bottom: 0;
}

.table-container {
  padding: 24px;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.user-card {
  padding: 16px;
  width: auto;
}

.user-card h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-info p {
  margin: 0;
  display: flex;
  gap: 8px;
}

.user-info .label {
  flex-shrink: 0;
  min-width: 80px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.details-dialog-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
  text-align: left;
  /* 确保左对齐 */
}

pre code.hljs {
  display: block;
  padding: 1em;
  border-radius: 4px;
  line-height: 1.6;
  background: #f8f9fa !important;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
}

/* 语法高亮颜色 */
.json-key {
  color: #d73a49;
}

.json-string {
  color: #22863a;
}

.json-number {
  color: #005cc5;
}

.json-literal {
  color: #d73a49;
}

.json-value {
  color: #6f42c1;
}

.active-filters {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.active-filters .el-tag {
  display: flex;
  align-items: center;
}
</style>
