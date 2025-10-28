<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">{{ t('firmwareVersions.title') }}</h2>
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
              <el-button type="primary" size="small" @click="manageFirmwareVersions(row)">
                {{ t('firmwareVersions.manage') }}
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 产品列表分页组件 -->
      <div class="pagination-container">
        <el-pagination
          :current-page="productsPagination.currentPage"
          :page-size="productsPagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="productsPagination.total"
          @size-change="handleProductsSizeChange"
          @current-change="handleProductsCurrentChange"
        />
      </div>
    </div>

    <!-- 韧件版本管理对话框 -->
    <el-dialog v-model="firmwareDialogVisible" :title="t('firmwareVersions.dialog.title')" width="70%">
      <div v-if="currentProduct" class="versions-container">
        <div class="product-info">
          <span class="label">{{ t('products.permissionDialog.productName') }}:</span>
          <span class="value">{{ currentProduct.product_name }}</span>
        </div>

        <div class="table-container">
          <el-table :data="firmwareVersions" style="width: 100%" border :max-height="500"
            :empty-text="t('firmwareVersions.empty')">
            <el-table-column type="index" :label="t('products.table.index')" width="60" align="center" />
            <el-table-column prop="version" :label="t('firmwareVersions.dialog.version')" min-width="150" />
            <el-table-column prop="release_date" :label="t('firmwareVersions.dialog.releaseDate')" width="120" />
            <el-table-column prop="remark" :label="t('firmwareVersions.dialog.remark')" min-width="200" />
            <el-table-column prop="created_by_email" :label="t('firmwareVersions.dialog.createdBy')" width="180" />
            <el-table-column prop="created_at" :label="t('firmwareVersions.dialog.createdAt')" width="180" />
            <el-table-column :label="t('products.table.actions')" width="200" align="center" fixed="right">
              <template #default="{ row }">
                <el-button-group v-if="canEditVersions">
                  <el-button type="primary" :icon="Edit" size="small"
                    @click="editVersion(row)"></el-button>
                  <el-button type="danger" :icon="Delete" size="small"
                    @click="deleteVersion(row)"></el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页组件 -->
          <div class="pagination-container">
            <el-pagination
              :current-page="pagination.currentPage"
              :page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="canEditVersions" type="primary" @click="showAddVersionDialog = true">
            {{ t('firmwareVersions.dialog.addVersion') }}
          </el-button>
          <el-button @click="firmwareDialogVisible = false">
            {{ t('common.cancel') }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加韧件版本对话框 -->
    <el-dialog v-model="showAddVersionDialog" width="50%">
      <template #header>
        <div class="dialog-title">
          <span style="font-size: 18px; font-weight: bold;">{{ t('firmwareVersions.dialog.addVersion') }}</span>
          <el-tooltip
            v-if="lastVersion"
            :content="t('firmwareVersions.dialog.lastVersionHover')"
            placement="top"
          >
            <span class="last-version-text">{{ t('firmwareVersions.dialog.lastVersion', { version: lastVersion }) }}</span>
          </el-tooltip>
        </div>
      </template>
      <el-form class="dialog-form" label-position="top" label-width="200px">
        <el-form-item :label="t('firmwareVersions.dialog.version')" required>
          <el-input v-model="newVersion.version" :placeholder="t('firmwareVersions.dialog.versionPlaceholder')"
            clearable />
        </el-form-item>

        <el-form-item :label="t('firmwareVersions.dialog.releaseDate')" required>
          <el-date-picker v-model="newVersion.release_date" type="datetime"
            :placeholder="t('firmwareVersions.dialog.releaseDatePlaceholder')" value-format="YYYY-MM-DD HH:mm"
            :disabled-date="(date) => date > new Date()" style="width: 100%">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="t('firmwareVersions.dialog.remark')">
          <el-input v-model="newVersion.remark" :placeholder="t('firmwareVersions.dialog.remarkPlaceholder')"
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

    <!-- 编辑韧件版本对话框 -->
    <el-dialog v-model="showEditVersionDialog" width="50%">
      <template #header>
        <div class="dialog-title">
          <span style="font-size: 18px; font-weight: bold;">{{ t('firmwareVersions.dialog.editVersion') }}</span>
        </div>
      </template>
      <el-form class="dialog-form" label-position="top" label-width="200px">
        <el-form-item :label="t('firmwareVersions.dialog.version')" required>
          <el-input v-model="editingVersion.version" :placeholder="t('firmwareVersions.dialog.versionPlaceholder')"
            clearable />
        </el-form-item>

        <el-form-item :label="t('firmwareVersions.dialog.releaseDate')" required>
          <el-date-picker v-model="editingVersion.release_date" type="datetime"
            :placeholder="t('firmwareVersions.dialog.releaseDatePlaceholder')" value-format="YYYY-MM-DD HH:mm"
            :disabled-date="(date) => date > new Date()" style="width: 100%">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="t('firmwareVersions.dialog.remark')">
          <el-input v-model="editingVersion.remark" :placeholder="t('firmwareVersions.dialog.remarkPlaceholder')"
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
import { product, firmwareVersion } from '../utils/api'
import { useI18n } from 'vue-i18n'
import { message } from '../utils/message'
import { Delete, Edit } from '@element-plus/icons-vue'

const { t } = useI18n()
const store = useStore()
const loading = ref(false)
const products = ref([])
const currentProduct = ref(null)
const firmwareVersions = ref([])
const firmwareDialogVisible = ref(false)
const showAddVersionDialog = ref(false)
const showEditVersionDialog = ref(false)
const searchQuery = ref('')
const editingVersion = ref({
  id: null,
  version: '',
  release_date: '',
  remark: ''
})

// 新版本表单
const newVersion = ref({
  version: '',
  release_date: '',
  remark: ''
})

// 获取最新版本号
const lastVersion = computed(() => {
  if (!firmwareVersions.value || firmwareVersions.value.length === 0) {
    return null
  }
  
  // 按发布日期排序
  const sortedVersions = [...firmwareVersions.value].sort((a, b) => {
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

// 管理韧件版本
const manageFirmwareVersions = async (product) => {
  currentProduct.value = product
  firmwareDialogVisible.value = true
  pagination.currentPage = 1
  await loadFirmwareVersions()
}

// 加载韧件版本列表
const loadFirmwareVersions = async () => {
  if (!currentProduct.value) return
  
  try {
    const params = {
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      sort: 'release_date',
      order: 'desc'
    }
    
    const response = await firmwareVersion.list(currentProduct.value.id, params)
    
    firmwareVersions.value = response.data.list || []
    pagination.total = response.data.total || 0
  } catch (error) {
    console.error('Failed to load firmware versions:', error)
    message.error(error.message,'server')
  }
}

// 添加韧件版本
const addVersion = async () => {
  if (!newVersion.value.version) {
    message.error(t('firmwareVersions.validation.versionRequired','validation'))
    return
  }
  
  if (!newVersion.value.release_date) {
    message.error(t('firmwareVersions.validation.releaseDateRequired','validation'))
    return
  }

  try {
    await firmwareVersion.add({
      product_id: currentProduct.value.id,
      version: newVersion.value.version,
      release_date: newVersion.value.release_date,
      remark: newVersion.value.remark
    })
    
    message.success(t('message.success.create'))
    showAddVersionDialog.value = false
    newVersion.value = { version: '', release_date: '', remark: '' }
    await loadFirmwareVersions()
  } catch (error) {
    console.error('Failed to add firmware version:', error)
    message.error(error.message,'server')
  }
}

// 编辑韧件版本
const editVersion = (version) => {
  editingVersion.value = { ...version }
  showEditVersionDialog.value = true
}

// 更新韧件版本
const updateVersion = async () => {
  if (!editingVersion.value.version) {
    message.error(t('firmwareVersions.validation.versionRequired','validation'))
    return
  }
  
  if (!editingVersion.value.release_date) {
    message.error(t('firmwareVersions.validation.releaseDateRequired','validation'))
    return
  }

  try {
    await firmwareVersion.update({
      id: editingVersion.value.id,
      version: editingVersion.value.version,
      release_date: editingVersion.value.release_date,
      remark: editingVersion.value.remark
    })
    
    message.success(t('message.success.update'))
    showEditVersionDialog.value = false
    await loadFirmwareVersions()
  } catch (error) {
    console.error('Failed to update firmware version:', error)
    message.error(error.message,'server')
  }
}

// 删除韧件版本
const deleteVersion = async (version) => {
  try {
    await message.confirm('delete')
    await firmwareVersion.delete(version.id)
    message.success(t('message.success.delete'))
    await loadFirmwareVersions()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete firmware version:', error)
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
  loadFirmwareVersions()
}

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadFirmwareVersions()
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

// 监听对话框显示状态
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
    newVersion.value = { version: '', release_date: '', remark: '' };
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Add version dialog style */
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

.dialog-form .el-form-item {
  text-align: left;
}
</style> 