<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">{{ t('productFeatures.title') }}</h2>
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
              <el-button type="primary" size="small" @click="manageFeatures(row)">
                {{ t('productFeatures.manageFeatures') }}
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

    <!-- 产品功能管理对话框 -->
    <el-dialog v-model="featuresDialogVisible" :title="t('productFeatures.dialog.title')" width="50%">
      <div v-if="currentProduct" class="features-container">
        <div class="product-info">
          <span class="label">{{ t('products.permissionDialog.productName') }}:</span>
          <span class="value">{{ currentProduct.product_name }}</span>
        </div>

        <div class="table-container">
          <el-table :data="features" style="width: 100%" border height="400" :max-height="400">
            <el-table-column type="index" :label="t('products.table.index')" width="60" align="center" />
            <el-table-column prop="feature_name" :label="t('productFeatures.dialog.featureName')" />
            <el-table-column prop="feature_code" :label="t('productFeatures.dialog.featureCode')" />
            <el-table-column :label="t('products.table.actions')" width="100" align="center" fixed="right">
              <template #default="{ row }">
                <el-button v-if="canEditFeatures" type="danger" :icon="Delete" size="small"
                  @click="deleteFeature(row)"></el-button>
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
          <el-button v-if="canEditFeatures" type="primary" @click="showAddFeatureDialog = true">
            {{ t('productFeatures.dialog.addFeature') }}
          </el-button>
          <el-button @click="featuresDialogVisible = false">
            {{ t('products.permissionDialog.close') }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加产品功能对话框 -->
    <el-dialog v-model="showAddFeatureDialog" :title="t('productFeatures.dialog.addFeature')" width="30%">
      <el-form class="dialog-form" label-position="left" label-width="100px">
        <el-form-item :label="t('productFeatures.dialog.featureName')">
          <el-input v-model="newFeatureName" 
            :placeholder="t('productFeatures.dialog.featureNamePlaceholder')"
            clearable />
        </el-form-item>
        <el-form-item :label="t('productFeatures.dialog.featureCode')">
          <el-input v-model="newFeatureCode" 
            :placeholder="t('productFeatures.dialog.featureCodePlaceholder')"
            @input="validateFeatureCode"
            clearable />
          <div v-if="featureCodeError" class="error-message">
            {{ featureCodeError }}
          </div>
        </el-form-item>
        <el-form-item>
          <div class="dialog-footer" style="display: flex; width: 100%;">
            <el-button @click="showAddFeatureDialog = false">
              {{ t('products.permissionDialog.close') }}
            </el-button>
            <el-button type="primary" @click="addFeature" :disabled="!!featureCodeError">
              {{ t('products.permissionDialog.add') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useStore } from '../utils/stores'
import { product, productFeature } from '../utils/api'
import { useI18n } from 'vue-i18n'
import { message } from '../utils/message'
import { Delete } from '@element-plus/icons-vue'
import { de } from 'element-plus/es/locale/index.mjs'

const { t } = useI18n()
const store = useStore()
const loading = ref(false)
const products = ref([])
const currentProduct = ref(null)
const features = ref([])
const featuresDialogVisible = ref(false)
const showAddFeatureDialog = ref(false)
const newFeatureName = ref('')
const newFeatureCode = ref('')
const searchQuery = ref('')
const featureCodeError = ref('')

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

// 判断是否可以编辑功能
const canEditFeatures = computed(() => {
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

// 管理产品功能
const manageFeatures = async (product) => {
  currentProduct.value = product
  featuresDialogVisible.value = true
  await loadFeatures(product.id)
}

// 加载功能列表
const loadFeatures = async (productId) => {
  try {
    const params = {
      page: pagination.currentPage,
      page_size: pagination.pageSize
    }
    const response = await productFeature.list(productId, params)
    if (response.data) {
      features.value = response.data.list || []
      pagination.total = response.data.total || 0
    }
  } catch (error) {
    message.error(error.message,'server')
  }
}

// 验证功能编码
const validateFeatureCode = () => {
  const pattern = /^[a-zA-Z0-9_-]+$/
  if (newFeatureCode.value && !pattern.test(newFeatureCode.value)) {
    featureCodeError.value = '功能编码只能包含英文、数字、下划线和连字符'
  } else {
    featureCodeError.value = ''
  }
}

// 添加产品功能
const addFeature = async () => {
  if (!newFeatureName.value) {
    message.error(t('productFeatures.dialog.featureNameRequired','form'))
    return
  }
  if (!newFeatureCode.value) {
    message.error(t('productFeatures.dialog.featureCodeRequired','form'))
    return
  }
  if (featureCodeError.value) {
    return
  }

  try {
    await productFeature.add({
      product_id: currentProduct.value.id,
      feature_name: newFeatureName.value,
      feature_code: newFeatureCode.value.toUpperCase()
    })

    message.success(t('message.success.create'))
    newFeatureName.value = ''
    newFeatureCode.value = ''
    featureCodeError.value = ''
    showAddFeatureDialog.value = false
    await loadFeatures(currentProduct.value.id)
  } catch (error) {
    message.error(error.message,'server')
  }
}

// 删除产品功能
const deleteFeature = async (feature) => {
  try {
    await message.confirm('delete')
    await productFeature.delete(feature.id)
    message.success(t('message.success.delete'))
    await loadFeatures(currentProduct.value.id)
  } catch (error) {
    if (error !== 'cancel') {
      message.error(error.message,'server')
    }
  }
}

// 过滤产品列表 - 不再需要本地过滤，使用后端搜索
const filteredProducts = computed(() => {
  return products.value
})

// 处理搜索
const handleSearch = () => {
  // 重置页码并调用后端搜索
  productsPagination.currentPage = 1
  loadProducts()
}

// 处理页码变化
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  if (currentProduct.value) {
    loadFeatures(currentProduct.value.id)
  }
}

// 处理每页显示数量变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  if (currentProduct.value) {
    loadFeatures(currentProduct.value.id)
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

.features-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-message {
  color: var(--danger-color);
  font-size: 0.85rem;
  margin-top: 4px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 