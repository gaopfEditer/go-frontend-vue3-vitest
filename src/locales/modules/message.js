// 消息模块
export default {
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
}
