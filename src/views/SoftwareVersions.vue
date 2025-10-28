<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">{{ t('softwareVersions.title') }}</h2>
    </div>

    <div class="search-bar">
      <el-input v-model="searchQuery" :placeholder="t('products.searchPlaceholder')" prefix-icon="Search" clearable
        @clear="handleSearch" @input="handleSearch">
      </el-input>
    </div>

    <div class="table-container">
      <el-table v-loading="loading" :data="filteredProducts" style="width: 100%" :empty-text="t('products.empty')"
        stripe border>
        <el-table-column type="index" :label="t('products.table.index')" width="60" align="center" />
        <el-table-column prop="code" :label="t('products.table.code')" sortable min-width="120" />
        <el-table-column prop="product_name" :label="t('products.table.name')" sortable min-width="120" />
        <el-table-column :label="t('products.table.actions')" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button-group v-if="canShowManageButtons">
              <el-button type="primary" size="small" @click="manageSoftwareVersions(row)">
                {{ t('softwareVersions.manage') }}
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination :current-page="productsPagination.currentPage" :page-size="productsPagination.pageSize"
          :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
          :total="productsPagination.total" @size-change="handleProductsSizeChange"
          @current-change="handleProductsCurrentChange" />
      </div>
    </div>

    <el-dialog v-model="softwareDialogVisible" :title="t('softwareVersions.dialog.title')" width="80%">
      <div v-if="currentProduct" class="versions-container">
        <div class="product-info">
          <span class="label">{{ t('products.permissionDialog.productName') }}:</span>
          <span class="value">{{ currentProduct.product_name }}</span>
        </div>

        <div class="table-container">
          <el-table :data="softwareVersions" style="width: 100%" border :max-height="500"
            :empty-text="t('softwareVersions.empty')">
            <el-table-column type="expand">
              <template #default="{ row }">
                <div class="expanded-content">
                  <div class="info-row">
                    <span class="info-label">{{ t('softwareVersions.dialog.createdBy') }}:</span>
                    <span class="info-value">{{ row.created_by_email || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">{{ t('softwareVersions.dialog.createdAt') }}:</span>
                    <span class="info-value">{{ row.created_at || '-' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">{{ t('softwareVersions.dialog.remark') }}:</span>
                    <span class="info-value">{{ row.remark || '-' }}</span>
                  </div>
                  <div v-if="row.update_log" class="info-row">
                    <span class="info-label">{{ t('softwareVersions.dialog.updateLog') }}:</span>
                    <p class="info-value update-log">{{ row.update_log }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index" :label="t('products.table.index')" width="60" align="center" />
            <el-table-column prop="version" :label="t('softwareVersions.dialog.version')" min-width="120" />
            <el-table-column prop="release_date" :label="t('softwareVersions.dialog.releaseDate')" width="120" />
            <el-table-column :label="t('softwareVersions.dialog.features')" min-width="180">
              <template #default="{ row }">
                <el-tag v-for="feature in row.features" :key="feature.id" class="feature-tag" size="small">
                  {{ feature.feature_name }}
                </el-tag>
                <span v-if="!row.features?.length" class="no-features">
                  {{ t('softwareVersions.dialog.noFeatures') }}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="t('softwareVersions.dialog.firmwares')" min-width="180">
              <template #default="{ row }">
                <el-tag v-for="firmware in row.firmwares" :key="firmware.id" class="firmware-tag" type="success"
                  size="small">
                  {{ firmware.version }}
                </el-tag>
                <span v-if="!row.firmwares?.length" class="no-firmwares">
                  {{ t('softwareVersions.dialog.noFirmwares') }}
                </span>
              </template>
            </el-table-column>
            
            <el-table-column :label="t('products.table.actions')" width="200" align="center" fixed="right">
              <template #default="{ row }">
                <el-button-group v-if="canEditVersions">
                  <el-button type="primary" :icon="Edit" size="small" @click="editVersion(row)"></el-button>
                  <el-button type="danger" :icon="Delete" size="small" @click="deleteVersion(row)"></el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination :current-page="pagination.currentPage" :page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
              @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="canEditVersions" type="primary" @click="showAddVersionDialog = true">
            {{ t('softwareVersions.dialog.addVersion') }}
          </el-button>
          <el-button @click="softwareDialogVisible = false">
            {{ t('common.cancel') }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="showAddVersionDialog" width="50%">
      <template #header>
        <div class="dialog-title">
          <span style="font-size: 18px; font-weight: bold;">{{ t('softwareVersions.dialog.addVersion') }}</span>
          <el-tooltip
            v-if="lastVersion"
            :content="t('softwareVersions.dialog.lastVersionHover')"
            placement="top"
          >
            <span class="last-version-text">{{ t('softwareVersions.dialog.lastVersion', { version: lastVersion }) }}</span>
          </el-tooltip>
        </div>
      </template>
      <el-form class="dialog-form" label-position="top" label-width="200px">
        <el-form-item :label="t('softwareVersions.dialog.version')" required>
          <el-input v-model="newVersion.version" :placeholder="t('softwareVersions.dialog.versionPlaceholder')"
            clearable />
        </el-form-item>

        <el-form-item :label="t('softwareVersions.dialog.releaseDate')" required>
          <el-date-picker v-model="newVersion.release_date" type="datetime"
            :placeholder="t('softwareVersions.dialog.releaseDatePlaceholder')" value-format="YYYY-MM-DD HH:mm"
            :disabled-date="(date) => date > new Date()" style="width: 100%">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="t('softwareVersions.dialog.features')">
          <div class="select-with-button">
            <el-select v-model="newVersion.feature_ids" :placeholder="t('softwareVersions.dialog.featuresPlaceholder')"
              multiple clearable style="width: 100%;">
              <el-option v-for="feature in productFeatures" :key="feature.id" :label="feature.feature_name"
                :value="feature.id" />
              <el-empty v-if="!productFeatures.length"
                :description="t('softwareVersions.dialog.noFeaturesAvailable')" />
            </el-select>
            <el-button type="primary" plain size="small" @click="reuseLastVersionFeatures" style="margin-left: 10px;">
              {{ t('softwareVersions.dialog.reuseLastVersion') }}
            </el-button>
          </div>
        </el-form-item>


        <el-form-item :label="t('softwareVersions.dialog.firmwares')">
          <div class="select-with-button">
            <el-select v-model="newVersion.firmware_ids"
              :placeholder="t('softwareVersions.dialog.firmwaresPlaceholder')" multiple clearable style="width: 100%;">
              <el-option v-for="firmware in productFirmwares" :key="firmware.id" :label="firmware.version"
                :value="firmware.id" />
              <el-empty v-if="!productFirmwares.length"
                :description="t('softwareVersions.dialog.noFirmwaresAvailable')" />
            </el-select>
            <el-button type="primary" plain size="small" @click="reuseLastVersionFirmwares" style="margin-left: 10px;">
              {{ t('softwareVersions.dialog.reuseLastVersion') }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item :label="t('softwareVersions.dialog.updateLog')">
          <el-input v-model="newVersion.update_log" :placeholder="t('softwareVersions.dialog.updateLogPlaceholder')"
            type="textarea" :rows="4" clearable />
        </el-form-item>

        <el-form-item :label="t('softwareVersions.dialog.remark')">
          <el-input v-model="newVersion.remark" :placeholder="t('softwareVersions.dialog.remarkPlaceholder')"
            type="textarea" :rows="2" clearable />
        </el-form-item>

        <el-form-item>
          <div class="dialog-footer" style="display: flex; width: 100%; justify-content: flex-end;">
            <el-button @click="showAddVersionDialog = false">
              {{ t('common.cancel') }}
            </el-button>
            <el-button type="primary" @click="addVersion">
              {{ t('common.confirm') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-model="showEditVersionDialog" width="50%">
      <template #header>
        <div class="dialog-title">
          <span style="font-size: 18px; font-weight: bold;">{{ t('softwareVersions.dialog.editVersion') }}</span>
        </div>
      </template>
      <el-form class="dialog-form" label-position="top" label-width="200px">
        <el-form-item :label="t('softwareVersions.dialog.version')" required>
          <el-input v-model="editingVersion.version" :placeholder="t('softwareVersions.dialog.versionPlaceholder')"
            clearable />
        </el-form-item>

        <el-form-item :label="t('softwareVersions.dialog.releaseDate')" required>
          <el-date-picker v-model="editingVersion.release_date" type="datetime"
            :placeholder="t('softwareVersions.dialog.releaseDatePlaceholder')" value-format="YYYY-MM-DD HH:mm"
            :disabled-date="(date) => date > new Date()" style="width: 100%">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="t('softwareVersions.dialog.features')">
          <el-select v-model="editingVersion.feature_ids"
            :placeholder="t('softwareVersions.dialog.featuresPlaceholder')" multiple clearable style="width: 100%;">
            <el-option v-for="feature in productFeatures" :key="feature.id" :label="feature.feature_name"
              :value="feature.id" />
            <el-empty v-if="!productFeatures.length" :description="t('softwareVersions.dialog.noFeaturesAvailable')" />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('softwareVersions.dialog.firmwares')">
          <el-select v-model="editingVersion.firmware_ids"
            :placeholder="t('softwareVersions.dialog.firmwaresPlaceholder')" multiple clearable style="width: 100%;">
            <el-option v-for="firmware in productFirmwares" :key="firmware.id" :label="firmware.version"
              :value="firmware.id" />
            <el-empty v-if="!productFirmwares.length"
              :description="t('softwareVersions.dialog.noFirmwaresAvailable')" />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('softwareVersions.dialog.updateLog')">
          <el-input v-model="editingVersion.update_log" :placeholder="t('softwareVersions.dialog.updateLogPlaceholder')"
            type="textarea" :rows="4" clearable />
        </el-form-item>

        <el-form-item :label="t('softwareVersions.dialog.remark')">
          <el-input v-model="editingVersion.remark" :placeholder="t('softwareVersions.dialog.remarkPlaceholder')"
            type="textarea" :rows="2" clearable />
        </el-form-item>

        <el-form-item>
          <div class="dialog-footer" style="display: flex; width: 100%; justify-content: flex-end;">
            <el-button @click="showEditVersionDialog = false">
              {{ t('common.cancel') }}
            </el-button>
            <el-button type="primary" @click="updateVersion">
              {{ t('common.confirm') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useStore } from '../utils/stores'
import { product, softwareVersion, firmwareVersion, productFeature } from '../utils/api'
import { useI18n } from 'vue-i18n'
import { message } from '../utils/message'
import { Delete, Edit } from '@element-plus/icons-vue'

const { t } = useI18n()
const store = useStore()
const loading = ref(false)
const products = ref([])
const currentProduct = ref(null)
const softwareVersions = ref([])
const productFeatures = ref([])
const productFirmwares = ref([])
const softwareDialogVisible = ref(false)
const showAddVersionDialog = ref(false)
const showEditVersionDialog = ref(false)
const searchQuery = ref('')

// 新版本表单
const newVersion = ref({
  version: '',
  release_date: '',
  feature_ids: [],
  firmware_ids: [],
  update_log: '',
  remark: ''
})

// 编辑版本表单
const editingVersion = ref({
  id: null,
  version: '',
  release_date: '',
  feature_ids: [],
  firmware_ids: [],
  update_log: '',
  remark: ''
})

// 获取最新版本号
const lastVersion = computed(() => {
  if (!softwareVersions.value || softwareVersions.value.length === 0) {
    return null
  }
  
  // 按发布日期排序
  const sortedVersions = [...softwareVersions.value].sort((a, b) => {
    if (!a.release_date) return 1
    if (!b.release_date) return -1
    return new Date(b.release_date) - new Date(a.release_date)
  })
  
  return sortedVersions[0].version
})

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 产品列表分页参数
const productsPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 判断是否可以显示管理按钮
const canShowManageButtons = computed(() => {
  if (!store.userInfo) return false

  // 确保store.products是数组
  const productsList = Array.isArray(store.products) ? store.products : []

  return store.userInfo.UserID === '1' || productsList.some(p =>
    p.edges?.managers?.some(m =>
      m.edges?.user?.id === Number(store.userInfo.UserID)
    )
  )
})

// 判断是否可以编辑版本
const canEditVersions = computed(() => {
  if (!currentProduct.value || !store.userInfo) return false

  // 超级管理员有所有权限
  if (store.userInfo.UserID === '1') return true

  // 检查当前用户是否是该产品的管理员
  const manager = currentProduct.value.edges?.managers?.find(m =>
    m.edges?.user?.id === Number(store.userInfo.UserID)
  )

  return manager && manager.permissions === 'full'
})

// 加载产品列表
const loadProducts = async () => {
  loading.value = true
  try {
    const params = {
      page: productsPagination.currentPage,
      page_size: productsPagination.pageSize
    }

    // 添加搜索参数
    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    const response = await product.list(params)
    // 更新产品列表和分页信息
    products.value = response.data.list || []
    productsPagination.total = response.data.total || 0
  } catch (error) {
    console.error('Failed to load products:', error)
    message.error(error.message,'server')
  } finally {
    loading.value = false
  }
}

// 管理软件版本
const manageSoftwareVersions = async (product) => {
  currentProduct.value = product
  softwareDialogVisible.value = true
  pagination.currentPage = 1

  // 加载软件版本列表
  await loadSoftwareVersions()

  // 加载产品功能和韧件版本
  await loadProductFeatures()
  await loadProductFirmwares()
}

// 加载产品功能列表
const loadProductFeatures = async () => {
  if (!currentProduct.value) return

  try {
    const response = await productFeature.list(currentProduct.value.id)
    productFeatures.value = response.data?.list || []
    console.log('Product features:', productFeatures.value)
  } catch (error) {
    console.error('Failed to load product features:', error)
    message.error(error.message,'server')
  }
}

// 加载产品韧件版本列表
const loadProductFirmwares = async () => {
  if (!currentProduct.value) return

  try {
    const response = await firmwareVersion.listAll(currentProduct.value.id)
    console.log('Firmware version response:', response)

    // 对韧件版本按照发布日期倒序排序
    let firmwareVersions = response.data || []
    firmwareVersions.sort((a, b) => {
      // 如果发布日期为空，则排在最后
      if (!a.release_date) return 1
      if (!b.release_date) return -1
      return new Date(b.release_date) - new Date(a.release_date)
    })

    productFirmwares.value = firmwareVersions
  } catch (error) {
    console.error('Failed to load product firmware versions:', error)
    message.error(error.message,'server')
  }
}

// 加载软件版本列表
const loadSoftwareVersions = async () => {
  if (!currentProduct.value) return

  try {
    const params = {
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      sort: 'release_date',
      order: 'desc'
    }

    const response = await softwareVersion.list(currentProduct.value.id, params)

    const versionsList = response.data.list || []

    // 处理每个软件版本的兼容韧件，按发布日期倒序排序
    versionsList.forEach(version => {
      if (version.firmwares && version.firmwares.length > 0) {
        version.firmwares.sort((a, b) => {
          if (!a.release_date) return 1
          if (!b.release_date) return -1
          return new Date(b.release_date) - new Date(a.release_date)
        })
      }
    })

    softwareVersions.value = versionsList
    pagination.total = response.data.total || 0
  } catch (error) {
    console.error('Failed to load software versions:', error)
    message.error(error.message,'server')
  }
}

// 添加软件版本
const addVersion = async () => {
  if (!newVersion.value.version) {
    message.error(t('softwareVersions.validation.versionRequired','validation'))
    return
  }

  if (!newVersion.value.release_date) {
    message.error(t('softwareVersions.validation.releaseDateRequired','validation'))
    return
  }

  try {
    await softwareVersion.add({
      product_id: currentProduct.value.id,
      version: newVersion.value.version,
      release_date: newVersion.value.release_date,
      feature_ids: newVersion.value.feature_ids,
      firmware_ids: newVersion.value.firmware_ids,
      update_log: newVersion.value.update_log,
      remark: newVersion.value.remark
    })

    message.success(t('message.success.create'))
    showAddVersionDialog.value = false
    // 重置表单
    newVersion.value = {
      version: '',
      release_date: '',
      feature_ids: [],
      firmware_ids: [],
      update_log: '',
      remark: ''
    }
    // 重新加载版本列表
    await loadSoftwareVersions()
  } catch (error) {
    console.error('Failed to add software version:', error)
    message.error(error.message,'server')
  }
}

// 编辑软件版本
const editVersion = (version) => {
  // 准备编辑数据，获取已选择的功能和韧件版本ID
  const featureIds = version.features ? version.features.map(f => f.id) : []
  const firmwareIds = version.firmwares ? version.firmwares.map(f => f.id) : []

  editingVersion.value = {
    id: version.id,
    version: version.version,
    release_date: version.release_date,
    feature_ids: featureIds,
    firmware_ids: firmwareIds,
    update_log: version.update_log,
    remark: version.remark
  }

  showEditVersionDialog.value = true
}

// 更新软件版本
const updateVersion = async () => {
  if (!editingVersion.value.version) {
    message.error(t('softwareVersions.validation.versionRequired','validation'))
    return
  }

  if (!editingVersion.value.release_date) {
    message.error(t('softwareVersions.validation.releaseDateRequired','validation'))
    return
  }

  try {
    await softwareVersion.update({
      id: editingVersion.value.id,
      version: editingVersion.value.version,
      release_date: editingVersion.value.release_date,
      feature_ids: editingVersion.value.feature_ids,
      firmware_ids: editingVersion.value.firmware_ids,
      update_log: editingVersion.value.update_log,
      remark: editingVersion.value.remark
    })

    message.success(t('message.success.update'))
    showEditVersionDialog.value = false
    await loadSoftwareVersions()
  } catch (error) {
    console.error('Failed to update software version:', error)
    message.error(error.message,'server')
  }
}

// 删除软件版本
const deleteVersion = async (version) => {
  try {
    await message.confirm('delete')
    await softwareVersion.delete(version.id)
    message.success(t('message.success.delete'))
    await loadSoftwareVersions()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete software version:', error)
      message.error(error.message,'server')
    }
  }
}

// 过滤产品列表
const filteredProducts = computed(() => {
  return products.value
})

// 处理搜索
const handleSearch = () => {
  // 重置页码并调用搜索
  productsPagination.currentPage = 1
  loadProducts()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  loadSoftwareVersions()
}

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadSoftwareVersions()
}

// 处理产品分页页码变化
const handleProductsCurrentChange = (page) => {
  productsPagination.currentPage = page
  loadProducts()
}

// 处理产品分页每页显示数量变化
const handleProductsSizeChange = (size) => {
  productsPagination.pageSize = size
  productsPagination.currentPage = 1
  loadProducts()
}

// 复用最近发布的软件版本的功能列表
const reuseLastVersionFeatures = () => {
  // 查找最近发布的软件版本
  if (softwareVersions.value.length === 0) {
    message.info(t('message.info.noVersionsToReuse'))
    return
  }

  // 按发布日期排序（确保最新的在前面）
  const sortedVersions = [...softwareVersions.value].sort((a, b) => {
    if (!a.release_date) return 1
    if (!b.release_date) return -1
    return new Date(b.release_date) - new Date(a.release_date)
  })

  // 获取最新版本的功能ID
  const latestVersion = sortedVersions[0]
  if (latestVersion.features && latestVersion.features.length > 0) {
    newVersion.value.feature_ids = latestVersion.features.map(f => f.id)
    message.success(t('message.success.reuseSuccess'))
  } else {
    message.info(t('message.info.noFeaturesInLastVersion'))
  }
}

// 复用最近发布的软件版本的兼容韧件列表
const reuseLastVersionFirmwares = () => {
  // 查找最近发布的软件版本
  if (softwareVersions.value.length === 0) {
    message.info(t('message.info.noVersionsToReuse'))
    return
  }

  // 按发布日期排序（确保最新的在前面）
  const sortedVersions = [...softwareVersions.value].sort((a, b) => {
    if (!a.release_date) return 1
    if (!b.release_date) return -1
    return new Date(b.release_date) - new Date(a.release_date)
  })

  // 获取最新版本的韧件ID
  const latestVersion = sortedVersions[0]
  if (latestVersion.firmwares && latestVersion.firmwares.length > 0) {
    newVersion.value.firmware_ids = latestVersion.firmwares.map(f => f.id)
    message.success(t('message.success.reuseSuccess'))
  } else {
    message.info(t('message.info.noFirmwaresInLastVersion'))
  }
}

// 监听对话框关闭
watch(showAddVersionDialog, (val) => {
  if (val) {
    // 打开对话框时，设置默认发布时间为当前时间
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    newVersion.value.release_date = `${year}-${month}-${day} ${hours}:${minutes}`;
  } else {
    // 关闭对话框时重置表单
    newVersion.value = {
      version: '',
      release_date: '',
      feature_ids: [],
      firmware_ids: [],
      update_log: '',
      remark: ''
    }
  }
})

onMounted(loadProducts)
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.product-info .label {
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: 500;
}

.product-info .value {
  font-size: 1.1rem;
  color: var(--primary-color);
  font-weight: 600;
}

.versions-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.table-container {
  margin-top: 1rem;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.search-bar {
  margin-bottom: 20px;
  width: 300px;
}

.dialog-form {
  margin-top: 20px;
}

.dialog-form .el-form-item {
  text-align: left;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.feature-tag,
.firmware-tag {
  margin: 2px 4px 2px 0;
}

.no-features,
.no-firmwares {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-style: italic;
}

/* Add version dialog style */
.select-with-button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  /* Ensure container takes full width */
}

.select-with-button .el-select {
  flex: 1;
  /* 让 el-select 占据剩余空间 */
}

.select-with-button .el-button {
  margin-left: auto;
  /* 将按钮推到右侧 */
}

.dialog-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.last-version-text {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: normal;
}

.expanded-content {
  padding: 10px;
  background-color: var(--background-secondary, #f5f7fa);
  border-radius: 4px;
}

.info-row {
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
}

.info-label {
  font-size: 0.9rem;
  color: var(--text-secondary, #606266);
  font-weight: 500;
  min-width: 80px;
  margin-right: 10px;
}

.info-value {
  font-size: 0.9rem;
  color: var(--text-primary, #303133);
  word-break: break-word;
}

.update-log {
  margin-top: 5px;
  white-space: pre-wrap;
  line-height: 1.5;
  width: 100%;
}
</style>