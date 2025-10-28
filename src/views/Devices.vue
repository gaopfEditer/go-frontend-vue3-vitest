<template>
  <div class="devices">
    <div class="header">
      <h2>{{ t('devices.title') }}</h2>
      <div class="header-buttons">
        <el-button type="primary" @click="showBatchUpdateDialog = true">
          {{ t('devices.batchUpdateButton') }}
        </el-button>
        <el-button type="success" @click="showBatchRegisterDialog = true">
          {{ t('devices.batchRegisterButton') }}
        </el-button>
        <el-button type="primary" @click="showAddDialog = true">
          {{ t('devices.addButton') }}
        </el-button>
      </div>
    </div>

    <div class="search-filter-container">
      <div class="search-bar">
        <el-input v-model="searchQuery" :placeholder="t('devices.searchPlaceholder')" prefix-icon="Search" clearable
          @clear="handleSearch" @input="handleSearch">
        </el-input>
        <el-select v-model="productFilter" :placeholder="t('devices.filterByProduct')" clearable @change="handleSearch">
          <el-option v-for="product in products" :key="product.id" :label="product.product_name" :value="product.id" />
        </el-select>
        <el-select v-model="licenseTypeFilter" :placeholder="t('devices.filterByLicenseType')" clearable
          @change="handleSearch">
          <el-option v-for="type in licenseTypes" :key="type.id" :label="type.type_name" :value="type.id" />
        </el-select>

        <el-button type="primary" @click="handleSearch">
          <el-icon>
            <Search />
          </el-icon> {{ t('auditLog.filter.search') }}
        </el-button>
      </div>

      <!-- 筛选条件标签 -->
      <div class="filter-tags" v-if="hasActiveFilters">
        <span class="filter-label">{{ t('devices.activeFilters') }}:</span>
        <el-tag v-if="searchQuery" closable @close="clearSearchQuery" type="info" effect="plain" class="filter-tag">
          {{ t('devices.searchFilter') }}: {{ searchQuery }}
        </el-tag>
        <el-tag v-if="productFilter" closable @close="clearProductFilter" type="success" effect="plain"
          class="filter-tag">
          {{ t('devices.filterByProduct') }}: {{ getProductName(productFilter) }}
        </el-tag>
        <el-tag v-if="licenseTypeFilter" closable @close="clearLicenseTypeFilter" type="warning" effect="plain"
          class="filter-tag">
          {{ t('devices.filterByLicenseType') }}: {{ getLicenseTypeName(licenseTypeFilter) }}
        </el-tag>
        <el-button type="text" @click="clearAllFilters" class="clear-all-btn">
          {{ t('devices.clearAllFilters') }}
        </el-button>
      </div>
    </div>

    <div class="device-list">
      <el-table v-loading="loading" :data="filteredDevices" style="width: 100%" :empty-text="t('devices.empty')" stripe
        border>
        <el-table-column type="expand">
          <template #default="props">
            <div class="expanded-content">
              <div class="info-item">
                <span class="label">{{ t('devices.table.createTime') }}:</span>
                <span class="value">{{ formatDateTime(props.row.created_at) }}</span>
              </div>
              <div class="info-item">
                <span class="label">{{ t('devices.table.updateTime') }}:</span>
                <span class="value">{{ formatDateTime(props.row.updated_at) }}</span>
              </div>
              <div class="info-item">
                <span class="label">{{ t('devices.table.createdBy') }}:</span>
                <span class="value">{{ props.row.created_by_email || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">{{ t('devices.table.updatedBy') }}:</span>
                <span class="value">{{ props.row.updated_by_email || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">{{ t('devices.table.licenseTypeCode') }}:</span>
                <span class="value">{{ props.row.license_type_code || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">{{ t('devices.table.productCode') }}:</span>
                <span class="value">{{ props.row.product_code || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">{{ t('devices.table.remark') }}:</span>
                <span class="value">{{ props.row.remark || '-' }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" :label="t('devices.table.index')" width="60" align="center" />
        <el-table-column prop="sn" :label="t('devices.table.serialNumber')" sortable min-width="150" />
        <el-table-column :label="t('devices.table.product')" sortable min-width="120">
          <template #default="{ row }">
            {{ row.product_name || '-' }}
          </template>
        </el-table-column>
        <el-table-column :label="t('devices.table.licenseType')" min-width="120">
          <template #default="{ row }">
            {{ row.license_type_name || '-' }}
          </template>
        </el-table-column>
        <el-table-column :label="t('devices.table.oemTag')" min-width="120">
          <template #default="{ row }">
            {{ row.oem_tag || '-' }}
          </template>
        </el-table-column>
        <el-table-column :label="t('devices.table.actions')" min-width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="success" size="small" @click="downloadActivationFile(row.product_id,row.sn)">
                {{ t('devices.downloadLicense') }}
              </el-button>
              <el-button type="primary" size="small" @click="editDevice(row)">
                {{ t('common.edit') }}
              </el-button>
              <el-button type="danger" size="small" @click="deleteDevice(row.id)">
                {{ t('common.delete') }}
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination :current-page="pagination.currentPage" :page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- 添加/编辑设备对话框 -->
    <el-dialog v-model="dialogVisible"
      :title="editingDevice ? t('devices.dialog.editTitle') : t('devices.dialog.addTitle')" width="40%"
      custom-class="device-dialog">
      <el-form :model="form" label-position="top" :rules="rules" ref="deviceForm" style="text-align: left;">
        <el-form-item :label="t('devices.dialog.serialNumber')" prop="sn">
          <el-input v-model="form.sn" :disabled="!!editingDevice" />
        </el-form-item>
        <el-form-item :label="t('devices.dialog.product')" prop="product_id">
          <el-select v-model="form.product_id" style="width: 100%">
            <el-option v-for="product in products" :key="product.id" :label="product.product_name"
              :value="product.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('devices.dialog.licenseType')" prop="license_type_id">
          <el-select v-model="form.license_type_id" style="width: 100%">
            <el-option v-for="type in formLicenseTypes" :key="type.id" :label="type.type_name" :value="type.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('devices.dialog.oemTag')" prop="oem_tag">
          <el-input v-model="form.oem_tag" />
        </el-form-item>
        <el-form-item :label="t('devices.dialog.remark')" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" />
        </el-form-item>
        <div class="dialog-buttons">
          <el-button @click="closeDialog">{{ t('devices.dialog.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm">
            {{ t('devices.dialog.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 批量注册设备对话框 -->
    <el-dialog v-model="batchRegisterDialogVisible" :title="t('devices.batchDialog.title')" width="50%"
      custom-class="batch-register-dialog">
      <el-form :model="batchFormData" label-position="top" :rules="batchRules" ref="batchForm"
        style="text-align: left;">
        <el-form-item :label="t('devices.batchDialog.product')" prop="product_id">
          <el-select v-model="batchFormData.product_id" style="width: 100%">
            <el-option v-for="product in products" :key="product.id" :label="product.product_name"
              :value="product.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('devices.batchDialog.serialNumbers')" prop="sns">
          <el-input v-model="batchFormData.sns" type="textarea" :rows="5"
            :placeholder="t('devices.batchDialog.serialNumbersPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('devices.dialog.licenseType')" prop="license_type_id">
          <el-select v-model="batchFormData.license_type_id" style="width: 100%">
            <el-option v-for="type in batchLicenseTypes" :key="type.id" :label="type.type_name" :value="type.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('devices.dialog.oemTag')" prop="oem_tag">
          <el-input v-model="batchFormData.oem_tag" />
        </el-form-item>
        <el-form-item :label="t('devices.dialog.remark')" prop="remark">
          <el-input v-model="batchFormData.remark" type="textarea" :rows="3" />
        </el-form-item>
        <div class="dialog-buttons">
          <el-button @click="closeBatchDialog">{{ t('devices.batchDialog.cancel') }}</el-button>
          <el-button type="primary" @click="submitBatchForm">
            {{ t('devices.batchDialog.confirm') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 批量更新许可证对话框 -->
    <el-dialog v-model="showBatchUpdateDialog" :title="t('devices.batchUpdate.title')" width="70%"
      custom-class="batch-update-dialog" :close-on-click-modal="false">

      <!-- 步骤1: 选择产品 -->
      <div v-if="batchUpdateDialogStep === 1" class="step-content">
        <el-form :model="batchUpdateFormData" label-position="top" :rules="batchUpdateRules" ref="batchUpdateForm"
          style="text-align: left; max-width: 500px; margin: 0 auto;">
          <el-form-item :label="t('devices.dialog.product')" prop="product_id">
            <el-select v-model="batchUpdateFormData.product_id" style="width: 100%" filterable>
              <el-option v-for="product in products" :key="product.id" :label="product.product_name"
                :value="product.id" />
            </el-select>
          </el-form-item>
          <div class="dialog-buttons">
            <el-button @click="closeBatchUpdateDialog">{{ t('devices.dialog.cancel') }}</el-button>
            <el-button type="primary" @click="selectProduct" :disabled="!batchUpdateFormData.product_id">
              {{ t('devices.batchUpdate.next') }}
            </el-button>
          </div>
        </el-form>
      </div>

      <!-- 步骤2: 选择设备和更新许可证 -->
      <div v-if="batchUpdateDialogStep === 2" class="step-content" style="text-align: left;">
        <div class="device-selection">

          <!-- 搜索栏 -->
          <div class="search-actions">
            <div class="search-container">
              <h3 style="padding-left:10px">{{ t('devices.searchFilter') }}</h3>
              <div class="search-row">
                <el-input v-model="batchUpdateSearchSN" :placeholder="t('devices.batchUpdate.searchSNPlaceholder')"
                  style="width: 300px;" clearable>
                </el-input>
                <el-button type="primary" @click="searchDevicesBySN" class="search-button">
                  {{ t('devices.batchUpdate.searchSN') }}
                </el-button>
              </div>
              <div class="search-row">
                <el-input v-model="batchUpdateSearchOEM" :placeholder="t('devices.batchUpdate.searchOEMPlaceholder')"
                  style="width: 300px;" clearable>
                </el-input>
                <el-button type="primary" @click="searchDevicesByOEM" class="search-button">
                  {{ t('devices.batchUpdate.searchOEM') }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 搜索结果对话框 -->
          <el-dialog v-model="showSearchResultsDialog" :title="t('devices.batchUpdate.searchResults')" append-to-body
            width="70%" destroy-on-close>
            <p v-if="searchResults.length === 0" class="no-results">{{ t('devices.batchUpdate.noResults') }}</p>
            <div v-else class="search-results-container">
              <el-table :data="searchResults" style="width: 100%" border
                @selection-change="val => selectedSearchResults = val" max-height="400px">
                <el-table-column type="selection" width="55" :selectable="row => !isDeviceSelected(row)" />
                <el-table-column prop="sn" :label="t('devices.table.serialNumber')" min-width="180" />
                <el-table-column :label="t('devices.table.product')" min-width="150">
                  <template #default="{ row }">
                    {{ row.product_name || '-' }}
                  </template>
                </el-table-column>
                <el-table-column :label="t('devices.table.licenseType')" min-width="150">
                  <template #default="{ row }">
                    {{ row.license_type_name || '-' }}
                  </template>
                </el-table-column>
                <el-table-column :label="t('devices.table.oemTag')" min-width="120">
                  <template #default="{ row }">
                    {{ row.oem_tag || '-' }}
                  </template>
                </el-table-column>
              </el-table>
              <div class="dialog-buttons mt-4">
                <el-button @click="showSearchResultsDialog = false">{{ t('devices.dialog.cancel') }}</el-button>
                <el-button type="primary" @click="addSelectedDevicesToList">
                  {{ t('devices.batchUpdate.addSelected') }}
                </el-button>
              </div>
            </div>
          </el-dialog>

          <!-- 许可证类型选择 -->
          <div class="license-selection section-card">
            <h3 class="section-title">{{ t('devices.batchUpdate.targetLicenseType') }}</h3>
            <el-select v-model="batchUpdateFormData.new_license_type_id" class="license-select"
              :placeholder="t('devices.batchUpdate.selectTargetLicense')" style="width: 100%;">
              <el-option v-for="type in batchUpdateLicenseTypes" :key="type.id" :label="type.type_name"
                :value="type.id" />
            </el-select>
          </div>

          <!-- 设备列表 -->
          <div class="selected-devices section-card">
            <h3 class="section-title">{{ t('devices.batchUpdate.selectedDevices') }} ({{ selectedDevices.length }})</h3>
            <div class="empty-list" v-if="selectedDevices.length === 0">
              {{ t('devices.batchUpdate.noDevicesSelected') }}
            </div>
            <el-table v-else :data="selectedDevices" style="width: 100%" border max-height="400px">
              <el-table-column prop="sn" :label="t('devices.table.serialNumber')" min-width="180" />
              <el-table-column :label="t('devices.table.product')" min-width="150">
                <template #default="{ row }">
                  {{ row.product_name || '-' }}
                </template>
              </el-table-column>
              <el-table-column :label="t('devices.batchUpdate.currentLicense')" min-width="150">
                <template #default="{ row }">
                  {{ row.license_type_name || '-' }}
                </template>
              </el-table-column>
              <el-table-column :label="t('devices.batchUpdate.newLicense')" min-width="150">
                <!-- <template>
                  <span v-if="batchUpdateFormData.new_license_type_id">
                    {{ getLicenseTypeName(batchUpdateFormData.new_license_type_id) }}
                  </span>
                  <span v-else>-</span>
                </template> -->
                {{ getLicenseTypeName(batchUpdateFormData.new_license_type_id) }}
              </el-table-column>
              <el-table-column :label="t('devices.table.oemTag')" min-width="120">
                <template #default="{ row }">
                  {{ row.oem_tag || '-' }}
                </template>
              </el-table-column>
              <el-table-column :label="t('devices.table.status')" min-width="120">
                <template #default="{ row }">
                  <el-tag :type="isLicenseChanged(row) ? 'success' : 'info'" effect="dark">
                    {{ isLicenseChanged(row) ? t('devices.batchUpdate.willChange') : t('devices.batchUpdate.noChange')
                    }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column :label="t('devices.table.actions')" width="100" fixed="right">
                <template #default="{ $index }">
                  <el-button type="danger" size="small" @click="removeDeviceFromList($index)">
                    {{ t('devices.batchUpdate.remove') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 备注 -->
          <div class="remarks-section section-card">
            <h3 class="section-title">{{ t('devices.dialog.remark') }}</h3>
            <el-input v-model="batchUpdateFormData.remark" type="textarea" :rows="3"
              :placeholder="t('devices.batchUpdate.remarkPlaceholder')" />
          </div>
        </div>

        <div class="dialog-buttons mt-4">
          <el-button @click="goToPreviousStep">{{ t('devices.batchUpdate.previousStep') }}</el-button>
          <el-button type="primary" @click="confirmBatchUpdate"
            :disabled="selectedDevices.length === 0 || !batchUpdateFormData.new_license_type_id || !hasChangedDevices">
            {{ t('devices.batchUpdate.submit') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useStore } from '../utils/stores'
import { device, product, licenseType } from '../utils/api'
import { useI18n } from 'vue-i18n'
import { message } from '../utils/message'
import { Search, Delete } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const { t } = useI18n()
const store = useStore()
const showAddDialog = ref(false)
const editingDevice = ref(null)
const loading = ref(false)
const searchQuery = ref('')
const productFilter = ref('')
const licenseTypeFilter = ref('')
const products = ref([])
const licenseTypes = ref([])
const formLicenseTypes = ref([])
const batchLicenseTypes = ref([])
const devices = ref([])
const deviceForm = ref(null)
const batchForm = ref(null)
const showBatchRegisterDialog = ref(false)
const showBatchUpdateDialog = ref(false)
const batchUpdateForm = ref(null)
const batchDevicesSelection = ref([])
const batchUpdateDialogStep = ref(1) // 1: 输入筛选条件, 2: 选择设备, 3: 修改许可证

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 表单数据
const form = reactive({
  sn: '',
  product_id: '',
  license_type_id: '',
  oem_tag: '',
  remark: ''
})

// 批量注册表单数据
const batchFormData = reactive({
  product_id: '',
  sns: '',
  license_type_id: '',
  oem_tag: '',
  remark: ''
})

// 批量更新许可证表单数据
const batchUpdateFormData = reactive({
  product_id: '',
  original_license_type_id: '',
  new_license_type_id: '',
  remark: ''
})

// 批量更新搜索相关变量
const batchUpdateSearchSN = ref('')
const batchUpdateSearchOEM = ref('')
const searchResults = ref([])
const selectedDevices = ref([])
const selectedSearchResults = ref([])
const showSearchResultsDialog = ref(false)
const batchUpdateLicenseTypes = ref([])

// 批量更新许可证设备列表分页
const batchUpdateDevices = ref([])
const batchUpdateDevicesPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 表单验证规则
const rules = {
  sn: [
    { required: true, message: t('devices.validation.serialNumberRequired'), trigger: 'blur' },
    { min: 3, max: 50, message: t('devices.validation.serialNumberLength'), trigger: 'blur' }
  ],
  product_id: [
    { required: true, message: t('devices.validation.productRequired'), trigger: 'change' }
  ],
  license_type_id: [
    { required: true, message: t('devices.validation.licenseTypeRequired'), trigger: 'change' }
  ]
}

// 批量注册表单验证规则
const batchRules = {
  product_id: [
    { required: true, message: t('devices.validation.productRequired'), trigger: 'change' }
  ],
  sns: [
    { required: true, message: t('devices.validation.serialNumbersRequired'), trigger: 'blur' }
  ],
  license_type_id: [
    { required: true, message: t('devices.validation.licenseTypeRequired'), trigger: 'change' }
  ]
}

// 批量更新许可证表单验证规则
const batchUpdateRules = {
  product_id: [
    { required: true, message: t('devices.validation.productRequired'), trigger: 'change' }
  ],
  new_license_type_id: [
    { required: true, message: t('devices.validation.licenseTypeRequired'), trigger: 'change' }
  ]
}

const dialogVisible = computed({
  get: () => showAddDialog.value || !!editingDevice.value,
  set: (val) => {
    if (!val) {
      closeDialog()
    }
  }
})

const batchRegisterDialogVisible = computed({
  get: () => showBatchRegisterDialog.value,
  set: (val) => {
    if (!val) {
      closeBatchDialog()
    }
  }
})

const filteredDevices = computed(() => {
  return devices.value
})

// 注意：设备数据结构已调整为扁平结构，不再使用edges嵌套对象
// 产品名称和许可证类型等信息直接在device对象上，如：
// device.product_name, device.license_type_name 等

// 格式化日期时间
const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 加载设备列表
const loadDevices = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      page_size: pagination.pageSize
    }

    // 添加搜索参数
    if (searchQuery.value) {
      params.sn = searchQuery.value
    }

    // 添加产品筛选
    if (productFilter.value) {
      params.product_id = productFilter.value
    }

    // 添加许可证类型筛选
    if (licenseTypeFilter.value) {
      params.license_type_id = licenseTypeFilter.value
    }

    const response = await device.list(params)
    devices.value = response.data.list || []
    pagination.total = response.data.total || 0
  } catch (error) {
    console.error('Failed to load devices:', error)
    message.error(error.message, 'server')
  } finally {
    loading.value = false
  }
}

// 加载许可证类型列表
const loadLicenseTypes = async (productId, targetRef) => {
  if (!productId) {
    targetRef.value = []
    return
  }

  try {
    const response = await licenseType.list(productId, { page_size: 100 })
    targetRef.value = response.data.list || []
  } catch (error) {
    console.error('Failed to load license types:', error)
    message.error(error.message, 'server')
  }
}

// 监听产品筛选变化，加载相应的许可证类型
watch(() => productFilter.value, (newProductId) => {
  licenseTypeFilter.value = '' // 清空许可证类型选择
  loadLicenseTypes(newProductId, licenseTypes)
})

// 监听产品选择变化，加载相应的许可证类型
watch(() => form.product_id, (newProductId) => {
  if (newProductId) {
    form.license_type_id = ''
    loadLicenseTypes(newProductId, formLicenseTypes)
  }
})

watch(() => batchFormData.product_id, (newProductId) => {
  if (newProductId) {
    batchFormData.license_type_id = ''
    loadLicenseTypes(newProductId, batchLicenseTypes)
  }
})

// 加载产品列表（用于下拉选择）
const loadProducts = async () => {
  try {
    const response = await product.list({ page_size: 100 })
    products.value = response.data.list || []
  } catch (error) {
    console.error('Failed to load products:', error)
    message.error(error.message, 'server')
  }
}

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  loadDevices()
}

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadDevices()
}

// 处理搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadDevices()
}

// 关闭对话框
const closeDialog = () => {
  showAddDialog.value = false
  editingDevice.value = null
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
}

// 关闭批量注册对话框
const closeBatchDialog = () => {
  showBatchRegisterDialog.value = false
  Object.keys(batchFormData).forEach(key => {
    batchFormData[key] = ''
  })
}

// 编辑设备
const editDevice = async (device) => {
  editingDevice.value = device
  form.sn = device.sn || ''
  form.product_id = device.product_id || ''
  form.oem_tag = device.oem_tag || ''
  form.remark = device.remark || ''

  // 加载许可证类型
  if (device.product_id) {
    await loadLicenseTypes(device.product_id, formLicenseTypes)
  }

  // 在许可证类型列表加载完成后设置license_type_id
  form.license_type_id = device.license_type_id || ''
}

// 删除设备
const deleteDevice = async (id) => {
  try {
    await ElMessageBox.confirm(
      t('devices.confirmDelete'),
      t('common.warning'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    await device.remove(id)
    message.success(t('devices.deleteSuccess'))
    loadDevices()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete device:', error)
      message.error(error.message, 'server')
    }
  }
}

// 提交表单
const submitForm = async () => {
  if (!deviceForm.value) return

  try {
    await deviceForm.value.validate()

    if (editingDevice.value) {
      await device.modify({
        id: editingDevice.value.id,
        license_type_id: form.license_type_id,
        oem_tag: form.oem_tag,
        remark: form.remark
      })
      message.success(t('devices.updateSuccess'))
    } else {
      await device.create({
        sn: form.sn,
        product_id: form.product_id,
        license_type_id: form.license_type_id,
        oem_tag: form.oem_tag,
        remark: form.remark
      })
      message.success(t('devices.createSuccess'))
    }

    closeDialog()
    loadDevices()
  } catch (error) {
    console.error('Form validation or submission failed:', error)
    if (error.message) {
      message.error(error.message, 'server')
    }
  }
}

// 提交批量注册表单
const submitBatchForm = async () => {
  if (!batchForm.value) return

  try {
    await batchForm.value.validate()

    const serialNumbers = batchFormData.sns
      .split('\n')
      .map(sn => sn.trim())
      .filter(sn => sn)

    await device.batchCreate({
      product_id: batchFormData.product_id,
      sns: serialNumbers,
      license_type_id: batchFormData.license_type_id,
      oem_tag: batchFormData.oem_tag,
      remark: batchFormData.remark
    })

    message.success(t('devices.batchCreateSuccess'))
    closeBatchDialog()
    loadDevices()
  } catch (error) {
    console.error('Batch form validation or submission failed:', error)
    if (error.message) {
      message.error(error.message, 'server')
    }
  }
}

// 计算是否有活跃的筛选条件
const hasActiveFilters = computed(() => {
  return searchQuery.value || productFilter.value || licenseTypeFilter.value
})

// 获取产品名称
const getProductName = (productId) => {
  const product = products.value.find(p => p.id === productId)
  return product ? product.product_name : productId
}

// 获取许可证类型名称
const getLicenseTypeName = (licenseTypeId) => {
  const type = batchUpdateLicenseTypes.value.find(t => t.id === licenseTypeId)
  return type ? type.type_name : licenseTypeId
}

// 清除搜索条件
const clearSearchQuery = () => {
  searchQuery.value = ''
  handleSearch()
}

// 清除产品筛选
const clearProductFilter = () => {
  productFilter.value = ''
  handleSearch()
}

// 清除许可证类型筛选
const clearLicenseTypeFilter = () => {
  licenseTypeFilter.value = ''
  handleSearch()
}

// 清除所有筛选
const clearAllFilters = () => {
  searchQuery.value = ''
  productFilter.value = ''
  licenseTypeFilter.value = ''
  handleSearch()
}

// 查询符合条件的设备
const queryDevicesForBatchUpdate = async () => {
  if (!batchUpdateForm.value) return

  try {
    await batchUpdateForm.value.validate(['oem_tag'])
    batchUpdateDialogStep.value = 2
    batchDevicesSelection.value = []
    await loadBatchUpdateDevices()
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

// 加载批量更新设备列表
const loadBatchUpdateDevices = async () => {
  loading.value = true
  try {
    const params = {
      page: batchUpdateDevicesPagination.currentPage,
      page_size: batchUpdateDevicesPagination.pageSize,
      oem_tag: batchUpdateFormData.oem_tag
    }

    // 添加原始许可证类型筛选
    if (batchUpdateFormData.original_license_type_id) {
      params.license_type_id = batchUpdateFormData.original_license_type_id
    }

    const response = await device.list(params)
    batchUpdateDevices.value = response.data.list || []
    batchUpdateDevicesPagination.total = response.data.total || 0
  } catch (error) {
    console.error('Failed to load devices:', error)
    message.error(error.message, 'server')
  } finally {
    loading.value = false
  }
}

// 关闭批量更新对话框
const closeBatchUpdateDialog = () => {
  showBatchUpdateDialog.value = false
  batchUpdateDialogStep.value = 1
  Object.keys(batchUpdateFormData).forEach(key => {
    batchUpdateFormData[key] = ''
  })
  selectedDevices.value = []
  searchResults.value = []
  batchUpdateSearchSN.value = ''
  batchUpdateSearchOEM.value = ''
  showSearchResultsDialog.value = false
}

// 返回到上一步
const goToPreviousStep = () => {
  batchUpdateDialogStep.value -= 1
}

// 选择产品后进入下一步
const selectProduct = async () => {
  if (!batchUpdateFormData.product_id) return

  // 加载该产品下的许可证类型
  await loadLicenseTypes(batchUpdateFormData.product_id, batchUpdateLicenseTypes)

  // 进入下一步
  batchUpdateDialogStep.value = 2
  selectedDevices.value = []
}

// 搜索设备（按序列号）
const searchDevicesBySN = async () => {
  if (!batchUpdateSearchSN.value) return

  loading.value = true
  try {
    const params = {
      page: 1,
      page_size: 100, // 不分页，显示更多结果
      product_id: batchUpdateFormData.product_id,
      sn: batchUpdateSearchSN.value
    }

    const response = await device.list(params)
    searchResults.value = response.data.list || []
    selectedSearchResults.value = []
    showSearchResultsDialog.value = true
  } catch (error) {
    console.error('Failed to search devices by SN:', error)
    message.error(error.message, 'server')
  } finally {
    loading.value = false
  }
}

// 搜索设备（按OEM标签）
const searchDevicesByOEM = async () => {
  if (!batchUpdateSearchOEM.value) return

  loading.value = true
  try {
    const params = {
      page: 1,
      page_size: 100, // 不分页，显示更多结果
      product_id: batchUpdateFormData.product_id,
      oem_tag: batchUpdateSearchOEM.value
    }

    const response = await device.list(params)
    searchResults.value = response.data.list || []
    selectedSearchResults.value = []
    showSearchResultsDialog.value = true
  } catch (error) {
    console.error('Failed to search devices by OEM:', error)
    message.error(error.message, 'server')
  } finally {
    loading.value = false
  }
}

// 检查设备是否已被选择
const isDeviceSelected = (device) => {
  return selectedDevices.value.some(d => d.id === device.id)
}

// 将选中的设备添加到列表
const addSelectedDevicesToList = () => {
  if (!selectedSearchResults.value || selectedSearchResults.value.length === 0) {
    message.warning(t('devices.batchUpdate.nothingSelected'))
    return
  }

  for (const device of selectedSearchResults.value) {
    if (!isDeviceSelected(device)) {
      selectedDevices.value.push(device)
    }
  }

  showSearchResultsDialog.value = false
  batchUpdateSearchSN.value = ''
  batchUpdateSearchOEM.value = ''
}

// 从列表中移除设备
const removeDeviceFromList = (index) => {
  selectedDevices.value.splice(index, 1)
}

// 判断设备的许可证是否发生变更
const isLicenseChanged = (device) => {
  return device.license_type_id !== batchUpdateFormData.new_license_type_id
}

// 计算是否有变更的设备
const hasChangedDevices = computed(() => {
  return selectedDevices.value.some(device => isLicenseChanged(device))
})

// 确认批量更新
const confirmBatchUpdate = async () => {
  // 只更新有变更的设备
  const devicesToUpdate = selectedDevices.value.filter(device => isLicenseChanged(device))

  if (devicesToUpdate.length === 0) {
    message.error(t('devices.batchUpdate.noDevicesToUpdate'))
    return
  }

  const licenseTypeName = getLicenseTypeName(batchUpdateFormData.new_license_type_id)

  try {
    await ElMessageBox.confirm(
      t('devices.batchUpdate.confirmPrompt', {
        count: `<el-tag type="warning">${devicesToUpdate.length}</el-tag>`,
        type: `<el-tag type="success">${licenseTypeName}</el-tag>`
      }),
      t('common.warning'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
        dangerouslyUseHTMLString: true
      }
    )

    await device.batchUpdateLicenseType({
      device_ids: devicesToUpdate.map(d => d.id),
      license_type_id: batchUpdateFormData.new_license_type_id,
      remark: batchUpdateFormData.remark
    })

    message.success(t('devices.batchUpdateSuccess'))
    closeBatchUpdateDialog()
    loadDevices()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to update devices:', error)
      message.error(error.message, 'server')
    }
  }
}

const downloadActivationFile = async (productID,sn) => {
  try {
    const response = await fetch(`/activate/device/activation-file/${sn}`);
    
    if (!response.ok) {
      throw new Error('下载失败');
    }

    // 获取文件内容
    const blob = await response.blob();
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sn}.lic`;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    message.success(t('devices.downloadSuccess'));
  } catch (error) {
    console.error('下载失败:', error);
    message.error(t('devices.downloadFailed'));
  }
};

onMounted(async () => {
  await loadDevices()
  await loadProducts()
})
</script>

<style scoped>
.devices {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.search-filter-container {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  align-items: center;
  max-width: 100%;
}

.search-bar .el-input {
  width: 300px;
}

.search-bar .el-select {
  width: 250px;
}

/* 修改搜索栏样式，确保大小一致 */
.devices .search-bar :deep(.el-input),
.devices .search-bar :deep(.el-select) {
  width: 220px !important;
}

.devices .search-bar :deep(.el-input__wrapper),
.devices .search-bar :deep(.el-select__wrapper) {
  height: 36px !important;
  line-height: 36px !important;
}

.devices .search-bar :deep(.el-input__inner),
.devices .search-bar :deep(.el-select__inner) {
  height: 36px !important;
  line-height: 36px !important;
}

.devices .search-bar .el-button {
  height: 36px !important;
}

.device-list {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.expanded-content {
  padding: 10px 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.info-item {
  display: flex;
  margin-bottom: 5px;
}

.info-item .label {
  font-weight: bold;
  margin-right: 10px;
  min-width: 120px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.device-dialog .el-form-item,
.batch-register-dialog .el-form-item {
  margin-bottom: 15px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-top: 10px;
}

.filter-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.filter-tag {
  margin-right: 4px;
}

.clear-all-btn {
  margin-left: 8px;
  font-size: 0.9rem;
  color: var(--primary-color);
}

.clear-all-btn:hover {
  text-decoration: underline;
}

.el-select__wrapper {
  min-height: 42px important;
}

.batch-update-dialog .device-selection {
  margin-bottom: 20px;
}

.batch-update-dialog .selection-info {
  margin-bottom: 15px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.batch-update-dialog .selected-devices-info {
  margin-bottom: 20px;
  padding: 10px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.batch-update-dialog .devices-count {
  font-weight: bold;
  margin-bottom: 10px;
}

.batch-update-dialog .selected-sns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.batch-update-dialog .device-tag {
  margin-right: 0;
}

.batch-update-dialog .search-actions {
  display: flex;
  margin-bottom: 20px;
  gap: 20px;
  flex-wrap: wrap;
  background-color: var(--el-fill-color-light);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.batch-update-dialog .search-sn-container,
.batch-update-dialog .search-oem-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.batch-update-dialog .license-selection {
  margin: 20px 0;
  background-color: var(--el-fill-color-light);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.batch-update-dialog .license-selection h3,
.batch-update-dialog .selected-devices h3,
.batch-update-dialog .remarks-section h3 {
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.batch-update-dialog .license-select {
  width: 300px;
}

.batch-update-dialog .selected-devices {
  margin: 20px 0;
}

.batch-update-dialog .empty-list {
  padding: 30px;
  text-align: center;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.batch-update-dialog .remarks-section {
  margin: 20px 0;
  background-color: var(--el-fill-color-light);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.batch-update-dialog .no-results {
  text-align: center;
  padding: 30px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.step-content {
  padding: 10px;
}

.search-row {
  display: flex;
  gap: 20px;
  padding: 10px;
}

.section-card {
  padding: 10px;
  border-radius: 8px;
}
</style>