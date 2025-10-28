export default {
  system: {
    name: '奕瑞授权管理系统',
    description: '安全可靠的企业级授权管理平台'
  },
  login: {
    title: '账号登录',
    email: '邮箱账号', 
    emailPlaceholder: '请输入邮箱',
    password: '登录密码',
    passwordPlaceholder: '请输入密码',
    button: '登录',
    loading: '登录中...',
    error: '登录失败',
    unauthorized: '登录失败：未获取到授权信息',
    toRegister: '没有账号？立即注册',
    toLogin: '已有账号？立即登录'
  },
  products: {
    title: '产品管理',
    addButton: '添加产品',
    table: {
      index: '序号',
      code: '产品代号',
      name: '产品名称',
      type: '产品分类',
      actions: '操作',
      createTime: '创建时间',
      updateTime: '更新时间',
      mainManager: '主管理员',
    },
    empty: '暂无产品数据',
    dialog: {
      addTitle: '添加产品',
      editTitle: '编辑产品',
      code: '产品代号',
      name: '产品名称',
      type: '产品分类',
      cancel: '取消',
      confirm: '确定'
    },
    message: {
      deleteConfirm: '确定要删除该产品吗？',
      operationFailed: '操作失败',
      deleteFailed: '删除失败'
    },
    searchPlaceholder: '搜索产品...',
    permissionDialog: {
      title: '权限管理',
      productName: '产品名称',
      managersList: '管理员列表',
      email: '邮箱',
      role: '角色',
      permissions: '权限',
      actions: '操作',
      mainManager: '主管理员',
      manager: '管理员',
      permFull: '完全权限',
      permRead: '只读权限',
      setAsMain: '设为主管理员',
      remove: '移除',
      addManager: '添加管理员',
      enterEmail: '请输入邮箱',
      selectPerm: '选择权限',
      add: '添加',
      close: '关闭',
      emailRequired: '请输入邮箱地址',
      remark: '备注',
      remarkPlaceholder: '输入备注信息',
      setMainTitle: '设置主管理员',
      setMainConfirm: '确定要将此用户设置为主管理员吗？当前主管理员将变为普通管理员。'
    },
  },
  licenseTypes: {
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
  },
  productFeatures: {
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
  },
  auditLog: {
    title: '操作日志',
    table: {
      time: '操作时间',
      operator: '操作者',
      module: '操作模块',
      action: '操作类型',
      details: '详情',
      ip: 'IP地址',
      product: '相关产品'
    },
    viewDetails: '查看详情',
    detailsDialog: {
      title: '操作详情',
      copy: '复制'
    },
    filter: {
      timeRange: '时间范围',
      startTime: '开始时间',
      endTime: '结束时间',
      module: '模块',
      action: '操作类型',
      product: '相关产品',
      search: '搜索',
      filteredByProduct: '已筛选产品',
      modulePlaceholder: '请选择模块',
      actionPlaceholder: '请选择操作类型',
      shortcuts: {
        lastWeek: '最近一周',
        lastMonth: '最近一个月',
        lastThreeMonths: '近三月'
      }
    },
    modules: {
      user: '用户管理',
      auth: '认证授权',
      product: '产品管理',
      feature: '功能管理',
      license_type: '许可类型',
      firmware_version: '固件版本',
      software_version: '软件版本',
      device: '设备管理'
    },
    actions: {
      create: '创建',
      update: '更新',
      delete: '删除',
      login: '登录',
      register: '注册'
    },
    userCard: {
      title: '用户信息',
      email: '邮箱',
      lastLogin: '最后登录',
      status: '状态',
      enabled: '正常',
      disabled: '禁用'
    },
    error: {
      invalidJson: '无效的JSON格式'
    },
    product: {
      view: '查看产品详情',
      filter: '筛选此产品日志',
      clearFilter: '取消筛选'
    },
  },
  common: {
    edit: '编辑',
    delete: '删除',
    logout: '退出登录',
    warning: '警告',
    confirm: '确定',
    cancel: '取消',
    permissions: '权限',
    pagination: {
      total: '共 {total} 条',
      prev: '上一页',
      next: '下一页',
      to: '前往',
      page: '页',
      perPage: '条/页',
      showing: '显示第 {from} 至 {to} 条，共 {total} 条'
    },
    copySuccess: '复制成功',
    copyFailed: '复制失败'
  },
  message: {
    error: {
      network: '网络错误',
      server: '服务器错误',
      unauthorized: '未授权，请重新登录',
      validation: '请检查输入内容',
      unknown: '未知错误',
      copyFailed: '复制失败',
      productHasRelations: '产品存在关联数据，请先删除所有软硬件版本、许可证类型和功能'
    },
    success: {
      save: '保存成功',
      delete: '删除成功',
      update: '更新成功',
      create: '创建成功',
      register: '注册成功，请登录',
      copy: '复制成功',
      reuseSuccess: '复用成功'
    },
    confirm: {
      delete: '确定要删除吗？',
      logout: '确定要退出登录吗？',
      transfer: '确定要转让主管理员权限吗？'
    },
    info: {
      noVersionsToReuse: '没有可复用的版本',
      noFeaturesInLastVersion: '上一版本没有功能可复用',
      noFirmwaresInLastVersion: '上一版本没有兼容韧件可复用'
    }
  },
  register: {
    title: '账号注册',
    confirmPassword: '确认密码',
    confirmPasswordPlaceholder: '请再次输入密码',
    button: '注册',
    passwordMismatch: '两次输入的密码不一致'
  },
  firmwareVersions: {
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
  },
  softwareVersions: {
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
  },
  menu: {
    dashboard: '面板',
    products: '产品管理',
    users: '用户管理',
    licenses: '许可证管理',
    licenseTypes: '许可证类型',
    firmwareVersions: '韧件版本',
    softwareVersions: '软件版本',
    devices: '设备管理',
    roles: '角色管理',
    permissions: '权限管理',
    settings: '设置',
    profile: '个人资料',
    logout: '退出登录'
  },
  devices: {
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
}