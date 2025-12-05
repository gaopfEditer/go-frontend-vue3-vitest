import { getRequest, postRequest, putRequest, deleteRequest } from './request'

// Auth APIs
export const auth = {
  login: (data) => postRequest('/activate/base/login', data),
  register: (data) => postRequest('/activate/base/register', data)
}

// Product APIs
export const product = {
  list: (params = {}) => getRequest('/activate/product/list', params),
  add: (data) => postRequest('/activate/product/add', data),
  modify: (data) => postRequest('/activate/product/put', data),
  delete: (productId) => getRequest(`/activate/product/del?product_id=${productId}`),
  addManager: (data) => postRequest('/activate/product/add-manager', data),
  updateManagerPermission: (data) => postRequest('/activate/product/update-manager-permission', data),
  updateManagerRemark: (data) => postRequest('/activate/product/update-manager-remark', data),
  removeManager: (managerId) => getRequest(`/activate/product/remove-manager?manager_id=${managerId}`)
}

export const post = {
  list: (params = {}) => getRequest('/activate/post/list', params),
  add: (data) => postRequest('/activate/post/add', data),
  modify: (data) => postRequest('/activate/post/put', data),
  delete: (postId) => getRequest(`/activate/post/del?post_id=${postId}`)
}

// License Type APIs
export const licenseType = {
  list: (productId, params = {}) => getRequest(`/activate/license-type/list?product_id=${productId}`, params),
  add: (data) => postRequest('/activate/license-type/add', data),
  delete: (typeId) => getRequest(`/activate/license-type/del?type_id=${typeId}`),
  updateFeatures: (data) => postRequest('/activate/license-type/update-features', data)
}

// Product Feature APIs
export const productFeature = {
  list: (productId, params = {}) => getRequest(`/activate/product-feature/list?product_id=${productId}`, params),
  add: (data) => postRequest('/activate/product-feature/add', data),
  delete: (featureId) => getRequest(`/activate/product-feature/del?feature_id=${featureId}`)
}

// 审计日志相关接口
export const auditLog = {
  // 获取日志列表
  list: (params) => getRequest('/activate/audit/list', params)
} 

// 韧件版本相关接口
export const firmwareVersion = {
  // 获取韧件版本列表
  list: (productId, params = {}) => getRequest(`/activate/firmware-versions/${productId}`, params),
  
  // 添加韧件版本
  add: (data) => postRequest('/activate/firmware-versions', data),
  
  // 更新韧件版本
  update: (data) => putRequest('/activate/firmware-versions', data),
  
  // 删除韧件版本
  delete: (id) => deleteRequest(`/activate/firmware-versions/${id}`),
  
  // 获取产品所有韧件版本（不分页）
  listAll: (productId) => getRequest(`/activate/version/firmware/all/${productId}`)
}

// 软件版本相关接口
export const softwareVersion = {
  // 获取软件版本列表
  list: (productId, params = {}) => getRequest(`/activate/software-versions/${productId}`, params),
  
  // 添加软件版本
  add: (data) => postRequest('/activate/software-versions', data),
  
  // 更新软件版本
  update: (data) => putRequest('/activate/software-versions', data),
  
  // 删除软件版本
  delete: (id) => deleteRequest(`/activate/software-versions/${id}`)
}

// 设备管理相关接口
export const device = {
  // 获取设备列表
  list: (params = {}) => getRequest('/activate/device/list', params),
  
  // 创建设备
  create: (data) => postRequest('/activate/device/add', data),
  
  // 修改设备
  modify: (data) => putRequest('/activate/device/update', data),
  
  // 删除设备
  remove: (id) => deleteRequest(`/activate/device/${id}`),
  
  // 批量创建设备
  batchCreate: (data) => postRequest('/activate/device/batch-add', data),
  
  // 批量更新许可证类型
  batchUpdateLicenseType: (data) => postRequest('/activate/device/batch-update-license', data),
  
  // 根据序列号搜索设备
  search: (serialNumber) => getRequest('/activate/device/search', { serial_number: serialNumber })
} 