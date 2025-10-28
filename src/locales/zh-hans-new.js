// 中文语言包 - 模块化版本
import system from './modules/system.js'
import common from './modules/common.js'
import auth from './modules/auth.js'
import message from './modules/message.js'
import products from './modules/products.js'
import auditLog from './modules/auditLog.js'
import menu from './modules/menu.js'

// 许可证类型模块
const licenseTypes = {
  title: '许可证类型管理',
  manageTypes: '管理',
  dialog: {
    title: '添加许可证类型',
    typeName: '类型名称',
    typeNamePlaceholder: '请输入类型名称',
    typeNameRequired: '请输入类型名称',
    typeCode: '类型编码',
    typeCodePlaceholder: '请输入类型编码',
    typeCodeRequired: '请输入类型编码',
    features: '包含功能',
    featuresPlaceholder: '请选择功能',
    editFeatures: '编辑功能列表',
    noFeatures: '暂无可选功能'
  }
}

// 产品功能模块
const productFeatures = {
  title: '产品功能管理',
  manageFeatures: '管理',
  dialog: {
    title: '产品功能管理',
    featureName: '功能名称',
    featureNamePlaceholder: '请输入功能名称',
    featureNameRequired: '请输入功能名称',
    featureCode: '功能编码',
    featureCodePlaceholder: '请输入功能编码',
    featureCodeRequired: '请输入功能编码',
    addFeature: '添加功能'
  }
}

// 韧件版本模块
const firmwareVersions = {
  title: '韧件版本管理',
  manage: '管理',
  empty: '暂无韧件版本',
  dialog: {
    title: '韧件版本管理',
    addVersion: '添加韧件版本',
    editVersion: '编辑韧件版本',
    lastVersion: '上一版本：{version}',
    lastVersionHover: '按发布时间排序',
    version: '版本号',
    releaseDate: '发布日期',
    releaseDatePlaceholder: '请选择发布日期',
    versionPlaceholder: '请输入版本号',
    remark: '备注',
    remarkPlaceholder: '请输入备注信息',
    createdBy: '创建人',
    createdAt: '创建时间'
  },
  validation: {
    versionRequired: '版本号不能为空',
    releaseDateRequired: '发布日期不能为空'
  }
}

// 软件版本模块
const softwareVersions = {
  title: '软件版本管理',
  manage: '管理',
  empty: '暂无软件版本',
  dialog: {
    title: '软件版本管理',
    addVersion: '添加软件版本',
    editVersion: '编辑软件版本',
    lastVersion: '上一版本：{version}',
    lastVersionHover: '按发布时间排序',
    version: '版本号',
    versionPlaceholder: '请输入版本号',
    releaseDate: '发布日期',
    releaseDatePlaceholder: '请选择发布日期',
    remark: '备注',
    remarkPlaceholder: '请输入备注信息',
    updateLog: '更新日志',
    updateLogPlaceholder: '请输入更新日志',
    features: '包含功能',
    featuresPlaceholder: '请选择包含功能',
    noFeatures: '未包含功能',
    noFeaturesAvailable: '暂无可选功能',
    firmwares: '兼容韧件',
    firmwaresPlaceholder: '请选择兼容韧件',
    noFirmwares: '未添加兼容韧件',
    noFirmwaresAvailable: '暂无可选韧件',
    createdAt: '创建时间',
    reuseLastVersion: '复用上一版本',
    createdBy: '创建人',
  },
  validation: {
    versionRequired: '版本号不能为空',
    releaseDateRequired: '发布日期不能为空'
  }
}

// 设备管理模块
const devices = {
  title: '设备管理',
  addButton: '注册设备',
  batchRegisterButton: '批量注册设备',
  batchUpdateButton: '批量更新许可证',
  searchPlaceholder: '搜索设备...',
  filterByProduct: '按产品筛选',
  filterByStatus: '按状态筛选',
  filterByLicenseType: '按许可证类型筛选',
  empty: '暂无设备数据',
  activeFilters: '当前筛选',
  searchFilter: '搜索',
  clearAllFilters: '清除所有筛选',
  table: {
    index: '序号',
    serialNumber: '序列号',
    product: '所属产品',
    macAddress: 'MAC地址',
    status: '状态',
    firmwareVersion: '固件版本',
    licenseType: '许可证类型',
    oemTag: 'OEM标签',
    licenseTypeCode: '许可证类型代码',
    productCode: '产品代码',
    createTime: '创建时间',
    updateTime: '更新时间',
    lastActiveTime: '最后活跃时间',
    createdBy: '创建人',
    updatedBy: '更新人',
    notes: '备注',
    remark: '备注',
    actions: '操作'
  },
  status: {
    active: '活跃',
    inactive: '未激活'
  },
  dialog: {
    addTitle: '注册设备',
    editTitle: '编辑设备',
    serialNumber: '序列号',
    product: '所属产品',
    macAddress: 'MAC地址',
    status: '状态',
    firmwareVersion: '固件版本',
    licenseType: '许可证类型',
    oemTag: 'OEM标签',
    notes: '备注',
    remark: '备注',
    cancel: '取消',
    confirm: '确定'
  },
  batchDialog: {
    title: '批量注册设备',
    product: '所属产品',
    serialNumbers: '序列号列表',
    serialNumbersPlaceholder: '请输入设备序列号，每行一个',
    status: '状态',
    cancel: '取消',
    confirm: '确定'
  },
  batchUpdate: {
    title: '批量更新许可证',
    search: '搜索设备',
    originalLicenseType: '原始许可证类型（可选）',
    newLicenseType: '新许可证类型',
    previousStep: '上一步',
    confirm: '确认选择',
    submit: '更新许可证',
    selectionInfo: '找到 {total} 个符合条件的设备，请选择要更新的设备:',
    selectedCount: '已选择 {count} 个设备:',
    more: '更多',
    noDeviceSelected: '请至少选择一个设备',
    confirmPrompt: '确定要为 {count} 个设备分配 {type} 许可证吗？',
    next: '下一步',
    searchSN: '按序列号搜索',
    searchOEM: '按OEM标签搜索',
    searchSNPlaceholder: '输入设备序列号',
    searchOEMPlaceholder: '输入OEM标签',
    searchResults: '搜索结果',
    addSelected: '添加所选',
    noResults: '未找到匹配的设备',
    selectedDevices: '已选择设备',
    noDevicesSelected: '未选择任何设备，请搜索并添加设备。',
    targetLicenseType: '目标许可证类型',
    selectTargetLicense: '选择要应用的许可证类型',
    currentLicense: '当前许可证',
    newLicense: '新许可证',
    willChange: '将变更',
    noChange: '无变更',
    remove: '移除',
    noDevicesToUpdate: '没有需要更新许可证的设备',
    nothingSelected: '未选择任何设备',
    remarkPlaceholder: '请输入备注信息（可选）'
  },
  validation: {
    serialNumberRequired: '序列号不能为空',
    serialNumberLength: '序列号长度必须在3-50个字符之间',
    productRequired: '请选择产品',
    licenseTypeRequired: '请选择许可证类型',
    macAddressFormat: 'MAC地址格式不正确',
    serialNumbersRequired: '请输入序列号列表',
    oemTagRequired: 'OEM标签不能为空'
  },
  confirmDelete: '确定要删除该设备吗？',
  createSuccess: '注册设备成功',
  updateSuccess: '更新设备成功',
  deleteSuccess: '删除设备成功',
  batchCreateSuccess: '批量注册设备成功',
  batchUpdateSuccess: '批量更新许可证成功',
  downloadLicense: '下载',
  downloadSuccess: '激活文件下载成功',
  downloadFailed: '激活文件下载失败'
}

export default {
  system,
  common,
  login: auth.login,
  register: auth.register,
  message,
  products,
  licenseTypes,
  productFeatures,
  auditLog,
  firmwareVersions,
  softwareVersions,
  menu,
  devices
}
