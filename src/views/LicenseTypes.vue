<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">{{ t('licenseTypes.title') }}</h2>
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
              <el-button type="primary" size="small" @click="manageLicenseTypes(row)">
                {{ t('licenseTypes.manageTypes') }}
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

    <!-- 许可证类型管理对话框 -->
    <el-dialog v-model="licenseTypesDialogVisible" :title="t('licenseTypes.dialog.title')" width="50%">
      <div v-if="currentProduct" class="types-container">
        <div class="product-info">
          <span class="label">{{ t('products.permissionDialog.productName') }}:</span>
          <span class="value">{{ currentProduct.product_name }}</span>
        </div>

        <div class="table-container">
          <el-table :data="licenseTypes" style="width: 100%" border height="400" :max-height="400">
            <el-table-column type="index" :label="t('products.table.index')" width="60" align="center" />
            <el-table-column prop="type_name" :label="t('licenseTypes.dialog.typeName')" />
            <el-table-column prop="license_type" :label="t('licenseTypes.dialog.typeCode')" />
            <el-table-column :label="t('licenseTypes.dialog.features')" min-width="200">
              <template #default="{ row }">
                <el-tag 
                  v-for="feature in row.edges?.features" 
                  :key="feature.id"
                  class="feature-tag"
                  size="small">
                  {{ feature.feature_name }}
                </el-tag>
                <span v-if="!row.edges?.features?.length" class="no-features">
                  {{ t('licenseTypes.dialog.noFeatures') }}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="t('products.table.actions')" width="200" align="center" fixed="right">
              <template #default="{ row }">
                <el-button-group v-if="canEditTypes">
                  <el-button type="primary" :icon="Edit" size="small"
                    @click="editFeatures(row)"></el-button>
                  <el-button type="danger" :icon="Delete" size="small"
                    @click="deleteType(row)"></el-button>
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
          <el-button v-if="canEditTypes" type="primary" @click="showAddTypeDialog = true">
            {{ t('licenseTypes.dialog.title') }}
          </el-button>
          <el-button @click="licenseTypesDialogVisible = false">
            {{ t('products.permissionDialog.close') }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加许可证类型对话框 -->
    <el-dialog v-model="showAddTypeDialog" :title="t('licenseTypes.dialog.title')" width="30%">
      <el-form class="dialog-form" label-position="left" label-width="100px">
        <el-form-item :label="t('licenseTypes.dialog.typeName')">
          <el-input v-model="newTypeName" 
            :placeholder="t('licenseTypes.dialog.typeNamePlaceholder')"
            clearable />
        </el-form-item>
        <el-form-item :label="t('licenseTypes.dialog.typeCode')">
          <el-input v-model="newLicenseType" 
            :placeholder="t('licenseTypes.dialog.typeCodePlaceholder')"
            @input="validateLicenseType"
            clearable />
          <div v-if="licenseTypeError" class="error-message">
            {{ licenseTypeError }}
          </div>
        </el-form-item>
        <el-form-item :label="t('licenseTypes.dialog.features')">
          <el-select v-model="selectedFeatures" 
            :placeholder="t('licenseTypes.dialog.featuresPlaceholder')"
            multiple
            clearable
            style="width: 100%;">
            <el-option 
              v-for="feature in productFeatures" 
              :key="feature.id" 
              :label="feature.feature_name" 
              :value="feature.id" />
            <el-empty v-if="!productFeatures.length" :description="t('licenseTypes.dialog.noFeatures')" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="dialog-footer" style="display: flex; width: 100%;">
            <el-button @click="showAddTypeDialog = false">
              {{ t('products.permissionDialog.close') }}
            </el-button>
            <el-button type="primary" @click="addType" :disabled="!!licenseTypeError">
              {{ t('products.permissionDialog.add') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 编辑功能列表对话框 -->
    <el-dialog v-model="showEditFeaturesDialog" :title="t('licenseTypes.dialog.editFeatures')" width="30%">
      <el-form class="dialog-form" label-position="left" label-width="100px">
        <el-form-item :label="t('licenseTypes.dialog.features')">
          <el-select v-model="editingFeatures" 
            :placeholder="t('licenseTypes.dialog.featuresPlaceholder')"
            multiple
            clearable
            style="width: 100%;">
            <el-option 
              v-for="feature in productFeatures" 
              :key="feature.id" 
              :label="feature.feature_name" 
              :value="feature.id" />
            <el-empty v-if="!productFeatures.length" :description="t('licenseTypes.dialog.noFeatures')" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="dialog-footer" style="display: flex; width: 100%;">
            <el-button @click="showEditFeaturesDialog = false">
              {{ t('products.permissionDialog.close') }}
            </el-button>
            <el-button type="primary" @click="updateFeatures">
              {{ t('common.confirm') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useStore } from '../utils/stores'
import { product, licenseType, productFeature } from '../utils/api'
import { useI18n } from 'vue-i18n'
import { message } from '../utils/message'
import { Delete, Edit } from '@element-plus/icons-vue'

const { t } = useI18n()
const store = useStore()
const loading = ref(false)
const products = ref([])
const currentProduct = ref(null)
const licenseTypes = ref([])
const licenseTypesDialogVisible = ref(false)
const showAddTypeDialog = ref(false)
const newTypeName = ref('')
const newLicenseType = ref('')
const searchQuery = ref('')
const licenseTypeError = ref('')
const selectedFeatures = ref([])
const productFeatures = ref([])
const showEditFeaturesDialog = ref(false)
const editingFeatures = ref([])
const editingType = ref(null)

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
      m.role === 'main' && m.edges?.user?.id === Number(store.userInfo.UserID)
    )
  )
})

// 判断是否可以编辑类型
const canEditTypes = computed(() => {
  if (!currentProduct.value || !store.userInfo) return false

  // 检查当前用户是否是该产品的主管理员或超级管理员
  const manager = currentProduct.value.edges?.managers?.find(m => 
    m.edges?.user?.id === Number(store.userInfo.UserID)
  )
  
  return store.userInfo.UserID === '1' || 
         (manager && manager.permissions === 'full')
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

// 管理许可证类型
const manageLicenseTypes = async (product) => {
  currentProduct.value = product
  licenseTypesDialogVisible.value = true
  await loadLicenseTypes(product.id)
}

// 加载许可证类型列表
const loadLicenseTypes = async (productId) => {
  try {
    const params = {
      page: pagination.currentPage,
      page_size: pagination.pageSize
    }
    const response = await licenseType.list(productId, params)
    if (response.data) {
      licenseTypes.value = response.data.list || []
      pagination.total = response.data.total || 0
    }
  } catch (error) {
    message.error(error.message,'server')
  }
}

// 验证许可证编码
const validateLicenseType = () => {
  const pattern = /^[a-zA-Z0-9_-]+$/
  if (newLicenseType.value && !pattern.test(newLicenseType.value)) {
    licenseTypeError.value = '许可证编码只能包含英文、数字、下划线和连字符'
  } else {
    licenseTypeError.value = ''
  }
}

// 获取产品功能列表
const fetchProductFeatures = async () => {
  if (!currentProduct.value) return
  try {
    const response = await productFeature.list(currentProduct.value.id)
    if (response.data?.list) {
      productFeatures.value = response.data.list
    }
  } catch (error) {
    message.error('server')
  }
}

// 监听选中产品变化
watch(currentProduct, async (newVal) => {
  if (newVal) {
    await fetchProductFeatures()
  } else {
    productFeatures.value = []
  }
})

// 添加许可证类型
const addType = async () => {
  if (!newTypeName.value) {
    message.error(t('licenseTypes.dialog.typeNameRequired','validation'))
    return
  }
  if (!newLicenseType.value) {
    message.error(t('licenseTypes.dialog.typeCodeRequired','validation'))
    return
  }

  try {
    await licenseType.add({
      product_id: currentProduct.value.id,
      type_name: newTypeName.value,
      license_type: newLicenseType.value.toUpperCase(),
      feature_ids: selectedFeatures.value
    })
    message.success(t('message.success.create'))
    showAddTypeDialog.value = false
    newTypeName.value = ''
    newLicenseType.value = ''
    selectedFeatures.value = []
    await loadLicenseTypes(currentProduct.value.id)
  } catch (error) {
    if (error != "") {
      // message.error(t('message.error.licenseTypeExists','validation'))
      debugger 
      message.error(error.message,'server')
    } else {
      message.error('server')
    }
  }
}

// 删除许可证类型
const deleteType = async (type) => {
  try {
    await message.confirm('delete')
    await licenseType.delete(type.id)
    message.success(t('message.success.delete'))
    await loadLicenseTypes(currentProduct.value.id)
  } catch (error) {
    if (error !== 'cancel') {
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
  // 重置页码并调用后端搜索
  productsPagination.currentPage = 1
  loadProducts()
}

// 编辑功能列表
const editFeatures = (type) => {
  editingType.value = type
  editingFeatures.value = type.edges?.features?.map(f => f.id) || []
  showEditFeaturesDialog.value = true
}

// 更新功能列表
const updateFeatures = async () => {
  if (!editingType.value) return
  
  try {
    await licenseType.updateFeatures({
      type_id: editingType.value.id,
      feature_ids: editingFeatures.value
    })
    message.success(t('message.success.update'))
    showEditFeaturesDialog.value = false
    await loadLicenseTypes(currentProduct.value.id)
  } catch (error) {
    message.error('server')
  }
}

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  if (currentProduct.value) {
    loadLicenseTypes(currentProduct.value.id)
  }
}

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  if (currentProduct.value) {
    loadLicenseTypes(currentProduct.value.id)
  }
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

onMounted(loadProducts)
</script>

<style scoped>
.product-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
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

.types-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-message {
  color: var(--danger-color);
  font-size: 0.85rem;
  margin-top: 4px;
}

.feature-tag {
  margin: 2px 4px;
}

.feature-tag:first-child {
  margin-left: 0;
}

.no-features {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-style: italic;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 