<template>
  <div class="products">
    <div class="header">
      <h2>{{ t('post.title') }}</h2>
      <el-button type="primary" @click="showAddDialog = true">
        {{ t('post.addButton') }}
      </el-button>
    </div>

    <div class="search-bar">
      <el-input v-model="searchQuery" :placeholder="t('post.searchPlaceholder')" prefix-icon="Search" clearable
        @clear="handleSearch" @input="handleSearch">
      </el-input>
    </div>

    <div class="product-list">
      <el-table v-loading="loading" :data="filteredProducts" style="width: 100%" :empty-text="t('post.empty')"
        stripe border>
        <el-table-column type="expand">
          <template #default="props">
            <div class="expanded-content">
              <div class="info-item">
                <span class="label">{{ t('post.table.createTime') }}:</span>
                <span class="value">{{ formatDateTime(props.row.created_at) }}</span>
              </div>
              <div class="info-item">
                <span class="label">{{ t('post.table.updateTime') }}:</span>
                <span class="value">{{ formatDateTime(props.row.updated_at) }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" :label="t('post.table.index')" width="60" align="center" />
        <el-table-column prop="code" :label="t('post.table.code')" sortable min-width="120" />
        <el-table-column prop="title" :label="t('post.table.name')" sortable min-width="120" />
        <el-table-column prop="slug" :label="t('post.table.type')" sortable min-width="100" />
        <el-table-column :label="t('post.table.mainManager')" sortable min-width="140"
          :sort-method="sortByMainManager">
          <template #default="{ row }">
            {{row.edges?.managers?.find(m => m.role === 'main')?.edges?.user?.email || '-'}}
          </template>
        </el-table-column>
        <el-table-column :label="t('post.table.actions')" width="300" fixed="right" align="center">
          <template #default="{ row }">
            <el-button-group v-if="canShowManageButtons">
              <el-button type="success" size="small" @click="managePermissions(row)">
                {{ t('common.permissions') }}
              </el-button>
              <el-button type="primary" size="small" @click="editProduct(row)">
                {{ t('common.edit') }}
              </el-button>
              <el-button type="danger" size="small" @click="deleteProduct(row.id)">
                {{ t('common.delete') }}
              </el-button>
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

    <el-dialog v-model="dialogVisible"
      :title="editingProduct ? t('post.dialog.editTitle') : t('post.dialog.addTitle')" width="30%"
      custom-class="product-dialog">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>{{ t('post.dialog.code') }}</label>
          <el-input v-model="form.code" required :disabled="!!editingProduct" />
        </div>
        <div class="form-group">
          <label>{{ t('post.dialog.name') }}</label>
          <el-input v-model="form.title" required />
        </div>
        <div class="form-group">
          <label>{{ t('post.dialog.type') }}</label>
          <el-input v-model="form.slug" required />
        </div>
        <div class="dialog-buttons">
          <el-button @click="closeDialog">{{ t('post.dialog.cancel') }}</el-button>
          <el-button type="primary" native-type="submit">
            {{ t('post.dialog.confirm') }}
          </el-button>
        </div>
      </form>
    </el-dialog>

    <!-- 新增权限管理对话框 -->
    <el-dialog v-model="permissionsDialogVisible" :title="t('post.permissionDialog.title')" width="50%"
      custom-class="permissions-dialog">
      <div v-if="currentProduct" class="permissions-container">
        <div class="product-title">
          <span class="title-label">{{ t('post.permissionDialog.productName') }}:</span>
          <span class="title-value">{{ currentProduct.title }}</span>
        </div>
        <!-- 管理员列表 -->
        <div class="managers-list">
          <el-table :data="managers" style="width: 100%" border height="400" :max-height="400">
            <el-table-column prop="edges.user.email" :label="t('post.permissionDialog.email')" fixed />
            <el-table-column :label="t('post.permissionDialog.role')" width="150">
              <template #default="{ row }">
                <el-tag type="danger" v-if="row.role === 'main'">
                  {{ t('post.permissionDialog.mainManager') }}
                </el-tag>
                <el-tag v-else class="clickable-tag" @click="handleRoleClick(row)" style="cursor: pointer;">
                  {{ t('post.permissionDialog.manager') }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="t('post.permissionDialog.permissions')" width="180">
              <template #default="{ row }">
                <el-select v-model="row.permissions" :disabled="!canEditPermissions || row.role === 'main'"
                  @change="updateManagerPermission(row)">
                  <el-option value="full" :label="t('post.permissionDialog.permFull')" />
                  <el-option value="read" :label="t('post.permissionDialog.permRead')" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="remark" :label="t('post.permissionDialog.remark')" width="200">
              <template #default="{ row }">
                <el-input v-model="row.remark" size="small" :disabled="!canEditPermissions || row.role === 'main'"
                  @blur="updateManagerRemark(row)"
                  :placeholder="t('post.permissionDialog.remarkPlaceholder')"></el-input>
              </template>
            </el-table-column>
            <el-table-column :label="t('post.permissionDialog.actions')" width="100" align="center" fixed="right">
              <template #default="{ row }">
                <el-button v-if="row.role !== 'main' && canEditPermissions" type="danger" :icon="Delete" size="small"
                  @click="removeManager(row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          

        </div>
                  <!-- 管理员分页组件 -->
          <div class="pagination-container">
            <el-pagination
              :current-page="managersPagination.currentPage"
              :page-size="managersPagination.pageSize"
              :page-sizes="[5, 10, 20, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="managersPagination.total"
              @size-change="handleManagersSizeChange"
              @current-change="handleManagersCurrentChange"
            />
          </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="canEditPermissions" type="primary" @click="showAddManagerDialog = true">
            {{ t('post.permissionDialog.addManager') }}
          </el-button>
          <el-button @click="permissionsDialogVisible = false">
            {{ t('post.permissionDialog.close') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加管理员对话框 -->
    <el-dialog v-model="showAddManagerDialog" :title="t('post.permissionDialog.addManager')" width="30%">
      <el-form label-position="left" label-width="100px" style="max-width: 400px; margin: 0 auto;">
        <el-form-item :label="t('post.permissionDialog.email')">
          <el-input v-model="newManagerEmail" 
            :placeholder="t('post.permissionDialog.enterEmail')"
            clearable />
        </el-form-item>
        <el-form-item :label="t('post.permissionDialog.remark')">
          <el-input v-model="newManagerRemark" 
            :placeholder="t('post.permissionDialog.remarkPlaceholder')"
            clearable />
        </el-form-item>
        <el-form-item :label="t('post.permissionDialog.permissions')">
          <el-select v-model="newManagerPermission" 
            :placeholder="t('post.permissionDialog.selectPerm')"
            clearable
            style="width: 100%;">
            <el-option value="full" :label="t('post.permissionDialog.permFull')" />
            <el-option value="read" :label="t('post.permissionDialog.permRead')" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="dialog-footer" style="display: flex; width: 100%;">
            <el-button @click="showAddManagerDialog = false">
              {{ t('post.permissionDialog.close') }}
            </el-button>
            <el-button type="primary" @click="addManager">
              {{ t('post.permissionDialog.add') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useStore } from '../utils/stores'
import { post as product } from '../utils/api'
import { useI18n } from 'vue-i18n'
import { message } from '../utils/message'
import { Search, Delete } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const { t } = useI18n()
const store = useStore()
const showAddDialog = ref(false)
const editingProduct = ref(null)
const loading = ref(false)
const searchQuery = ref('')

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const form = reactive({
  code: '',
  title: '',
  slug: ''
})

const dialogVisible = computed({
  get: () => showAddDialog.value || !!editingProduct.value,
  set: (val) => {
    if (!val) {
      closeDialog()
    }
  }
})

const filteredProducts = computed(() => {
  return store.products
})

// 新增devicesCountMap用于存储设备数量
const devicesCountMap = ref({})

// 获取产品的设备数量
const getDeviceCount = (product) => {
  return devicesCountMap.value[product.id] || 0
}

// 按设备数量排序
const sortByDeviceCount = (a, b) => {
  const countA = getDeviceCount(a) || 0
  const countB = getDeviceCount(b) || 0
  return countA - countB
}

const loadProducts = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      page_size: pagination.pageSize
    }
    
    // 添加搜索参数
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    const response = await product.list(params)
    store.products = response.data.list || []
    pagination.total = response.data.total || 0
    
    // 处理Extra字段中的设备数量信息
    if (response.data.extra && response.data.extra.device_count) {
      const deviceCountData = response.data.extra.device_count
      deviceCountData.forEach(item => {
        devicesCountMap.value[item.product_id] = item.count
      })
    }
  } catch (error) {
    console.error('Failed to load products:', error)
    message.error(error.message,'server')
  } finally {
    loading.value = false
  }
}

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  loadProducts()
}

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadProducts()
}

// 处理搜索
const handleSearch = () => {
  // 重置页码并调用后端搜索
  pagination.currentPage = 1
  loadProducts()
}

const handleSubmit = async () => {
  try {
    if (editingProduct.value) {
      await product.modify({
        id: editingProduct.value.id,
        ...form,
        manager_main: Number(store.userInfo.UserID)
      })
      message.success(t('message.success.update'))
    } else {
      await product.add(form)
      message.success(t('message.success.create'))
    }
    await loadProducts()
    closeDialog()
  } catch (err) {
    message.error(err.message,'server')
  }
}

const editProduct = (prod) => {
  editingProduct.value = prod
  Object.assign(form, prod)
}

const deleteProduct = async (id) => {
  try {
    await message.confirm('delete')
    await product.delete(id)
    message.success(t('message.success.delete'))
    await loadProducts()
  } catch (err) {
    if (err !== 'cancel') {
      // 检查是否是产品存在关联的错误
      message.error(err.message,'server')
    }
  }
}

const closeDialog = () => {
  showAddDialog.value = false
  editingProduct.value = null
  Object.assign(form, {
    code: '',
    title: '',
    slug: ''
  })
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date)
}

const sortByMainManager = (a, b) => {
  const emailA = a.edges?.managers?.find(m => m.role === 'main')?.edges?.user?.email || ''
  const emailB = b.edges?.managers?.find(m => m.role === 'main')?.edges?.user?.email || ''
  return emailA.localeCompare(emailB)
}

// 权限管理相关
const permissionsDialogVisible = ref(false)
const currentProduct = ref(null)
const managers = ref([])
const newManagerEmail = ref('')
const newManagerPermission = ref('read')
const newManagerRemark = ref('')
const showAddManagerDialog = ref(false)

// 管理员列表分页参数
const managersPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 判断当前用户是否有权限编辑
const canEditPermissions = computed(() => {
  if (!currentProduct.value || !store.userInfo) return false

  // 检查当前用户是否是该产品的主管理员或超级管理员
  const mainManager = managers.value.find(m => m.role === 'main')
  if (!mainManager) return false
  return mainManager.edges?.user?.id === Number(store.userInfo.UserID) || store.userInfo.UserID === '1'
})

// 判断是否可以显示编辑和权限管理按钮
const canShowManageButtons = computed(() => {
  if (!store.userInfo) return false
  return store.userInfo.UserID === '1' || store.products.some(p =>
    p.edges?.managers?.some(m =>
      m.role === 'main' && m.edges?.user?.id === Number(store.userInfo.UserID)
    )
  )
})

// 打开权限管理对话框
const managePermissions = (product) => {
  currentProduct.value = product
  permissionsDialogVisible.value = true
  
  // 重置管理员分页
  managersPagination.currentPage = 1
  
  // 加载管理员数据
  loadManagersList()
}

// 加载管理员列表
const loadManagersList = async () => {
  if (!currentProduct.value) return
  
  try {
    // 在实际项目中，这里应该调用API加载管理员列表数据，并支持分页
    // 由于当前API不支持，这里先使用本地分页模拟
    const allManagers = currentProduct.value.edges?.managers || []
    
    // 计算分页
    const start = (managersPagination.currentPage - 1) * managersPagination.pageSize
    const end = start + managersPagination.pageSize
    
    // 更新分页信息
    managersPagination.total = allManagers.length
    
    // 设置当前页数据
    managers.value = allManagers.slice(start, end)
  } catch (error) {
    console.error('Failed to load managers:', error)
    message.error(error.message,'server')
  }
}

// 处理管理员分页页码变化
const handleManagersCurrentChange = (page) => {
  managersPagination.currentPage = page
  loadManagersList()
}

// 处理管理员分页每页显示数量变化
const handleManagersSizeChange = (size) => {
  managersPagination.pageSize = size
  managersPagination.currentPage = 1
  loadManagersList()
}

// 处理角色点击事件 - 转让主管理员权限
const handleRoleClick = async (manager) => {
  try {
    await ElMessageBox.confirm(
      t('post.permissionDialog.setMainConfirm'),
      t('post.permissionDialog.setMainTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )

    // 使用modifyProduct接口设置主管理员
    await product.modify({
      id: currentProduct.value.id,
      manager_main: manager.user_id
    })

    message.success(t('message.success.update'))

    // 重新加载产品列表以获取最新数据
    await loadProducts()

    // 更新当前显示的管理员列表
    const updatedProduct = store.products.find(p => p.id === currentProduct.value.id)
    if (updatedProduct) {
      currentProduct.value = updatedProduct
      loadManagersList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      message.error(error.message,'server')
    }
  }
}

// 更新管理员权限 - 使用 modifyProduct 接口
const updateManagerPermission = async (manager) => {
  try {
    // 使用modifyProduct接口更新权限
    const managerAssistant = [{
      user_id: manager.user_id,
      permission: manager.permissions
    }]

    await product.modify({
      id: currentProduct.value.id,
      manager_assistant: managerAssistant
    })

    message.success(t('message.success.update'))

    // 更新本地数据
    await loadProducts()

    // 更新当前显示的管理员列表
    const updatedProduct = store.products.find(p => p.id === currentProduct.value.id)
    if (updatedProduct) {
      currentProduct.value = updatedProduct
      loadManagersList()
    }
  } catch (error) {
    message.error(error.message,'server')
  }
}

// 更新管理员备注
const updateManagerRemark = async (manager) => {
  try {
    // 使用 modifyProduct 接口更新备注
    await product.modify({
      id: currentProduct.value.id,
      manager_assistant: [{
        user_id: manager.user_id,
        permission: manager.permissions,
        remark: manager.remark
      }]
    })

    message.success(t('message.success.update'))

    // 更新本地数据
    await loadProducts()

    // 更新当前显示的管理员列表
    const updatedProduct = store.products.find(p => p.id === currentProduct.value.id)
    if (updatedProduct) {
      currentProduct.value = updatedProduct
      loadManagersList()
    }
  } catch (error) {
    message.error(error.message,'server')
  }
}

// 移除管理员
const removeManager = async (manager) => {
  try {
    await message.confirm('delete')
    await product.removeManager(manager.id)
    message.success(t('message.success.delete'))

    // 重新加载产品列表以获取最新数据
    await loadProducts()

    // 更新当前显示的管理员列表
    const updatedProduct = store.products.find(p => p.id === currentProduct.value.id)
    if (updatedProduct) {
      currentProduct.value = updatedProduct
      loadManagersList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      message.error(error.message,'server')
    }
  }
}

// 添加管理员
const addManager = async () => {
  if (!newManagerEmail.value) {
    message.error(t('post.permissionDialog.emailRequired','form'))
    return
  }

  try {
    await product.addManager({
      product_id: Number(currentProduct.value.id),
      email: newManagerEmail.value,
      permissions: newManagerPermission.value,
      remark: newManagerRemark.value
    })

    message.success(t('message.success.create'))
    newManagerEmail.value = ''
    newManagerPermission.value = 'read'
    newManagerRemark.value = ''

    // 重新加载产品列表以获取最新数据
    await loadProducts()

    // 更新当前显示的管理员列表
    const updatedProduct = store.products.find(p => p.id === currentProduct.value.id)
    if (updatedProduct) {
      currentProduct.value = updatedProduct
      loadManagersList()
    }
  } catch (error) {
    message.error(error.message,'server')
  }
}

onMounted(loadProducts)
</script>

<style scoped>
.products {
  padding: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.search-bar {
  margin-bottom: 1.5rem;
  max-width: 300px;
}

.form-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 500;
  text-align: left;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.clickable-tag:hover {
  cursor: pointer;
  opacity: 0.8;
}

.expanded-content {
  padding: 20px 50px;
  background-color: #f8fafc;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .label {
  color: var(--text-secondary);
  width: 100px;
  flex-shrink: 0;
}

.info-item .value {
  color: var(--text-primary);
}

:deep(.product-dialog) .el-dialog__header {
  padding: 20px 24px;
  margin: 0;
  border-bottom: 1px solid var(--border-color);
}

:deep(.product-dialog) .el-dialog__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: left;
}

:deep(.product-dialog) .el-dialog__body {
  padding: 24px;
}

:deep(.product-dialog) .el-dialog__headerbtn {
  top: 20px;
  right: 20px;
}

/* 权限管理对话框样式 */
.permissions-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.permissions-container h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.permissions-container h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.managers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.managers-list {
  margin-bottom: 1.5rem;
  /* 设置最大高度，超出后显示滚动条 */
  max-height: 400px;
  overflow: auto;
}

.managers-list :deep(.el-table__header-wrapper) {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #fff;
}

.managers-list :deep(.el-table__fixed-header-wrapper) {
  z-index: 2;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

:deep(.el-form-item__label) {
  text-align: left;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

.product-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-title .title-label {
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: 500;
}

.product-title .title-value {
  font-size: 1.1rem;
  color: var(--primary-color);
  font-weight: 600;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
