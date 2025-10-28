// 审计日志模块
export default {
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
  }
}
