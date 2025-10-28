// 错误码国际化配置
export const errorCodes = {
  // 成功
  CODE_SUCCESS: {
    zh: '成功',
    en: 'Success'
  },
  
  // 系统错误
  ERR_SERVER_BUSY: {
    zh: '系统繁忙',
    en: 'Server is busy'
  },
  ERR_OPERATION_FAILED: {
    zh: '操作失败',
    en: 'Operation failed'
  },
  ERR_INVALID_PARAMETER: {
    zh: '参数错误',
    en: 'Invalid parameter'
  },
  ERR_QUERY_FAILED: {
    zh: '查询失败',
    en: 'Query failed'
  },
  ERR_ADD_FAILED: {
    zh: '新增失败',
    en: 'Add failed'
  },
  ERR_DEL_FAILED: {
    zh: '删除失败',
    en: 'Delete failed'
  },
  ERR_MOD_FAILED: {
    zh: '修改失败',
    en: 'Modify failed'
  },
  ERR_ADD_LOG_FAILED: {
    zh: '新增日志失败',
    en: 'Add log failed'
  },
  
  // 认证授权错误
  ERR_TOKEN_EXPIRED: {
    zh: 'Token已过期',
    en: 'Token expired'
  },
  ERR_NO_PERMISSION: {
    zh: '没有权限',
    en: 'No permission'
  },
  ERR_CAPTCHA_INCORRECT: {
    zh: '验证码错误',
    en: 'Captcha incorrect'
  },
  ERR_CAPTCHA_EXPIRED: {
    zh: '验证码已过期',
    en: 'Captcha expired'
  },
  ERR_LOGIN_FAILED: {
    zh: '登录失败',
    en: 'Login failed'
  },
  ERR_INCORRECT_PASSWORD: {
    zh: '密码错误',
    en: 'Incorrect password'
  },
  
  // 用户相关错误
  ERR_EMAIL_EXIST: {
    zh: '邮箱已存在',
    en: 'Email already exists'
  },
  ERR_USER_EXIST: {
    zh: '用户已存在',
    en: 'User already exists'
  },
  ERR_USER_NOT_EXIST: {
    zh: '用户不存在',
    en: 'User does not exist'
  },
  ERR_MANAGER_ALREADY_EXIST: {
    zh: '管理员已存在',
    en: 'Manager already exists'
  },
  
  // 产品相关错误
  ERR_PRODUCT_CODE_EXIST: {
    zh: '产品代号已存在',
    en: 'Product code exists'
  },
  ERR_PRODUCT_NAME_EXIST: {
    zh: '产品名称已存在',
    en: 'Product name exists'
  },
  ERR_PRODUCT_NOT_EXIST: {
    zh: '产品不存在',
    en: 'Product does not exist'
  },
  ERR_PRODUCT_HAS_RELATIONS: {
    zh: '产品存在关联数据，请先删除所有软硬件版本、许可证类型和功能',
    en: 'Product has associated data. Please delete all versions, license types and features first.'
  },
  
  // 许可证类型相关错误
  ERR_LICENSE_TYPE_EXIST: {
    zh: '许可证类型已存在',
    en: 'License type already exists'
  },
  ERR_LICENSE_TYPE_NOT_EXIST: {
    zh: '许可证类型不存在',
    en: 'License type does not exist'
  },
  ERR_LICENSE_CODE_EXIST: {
    zh: '许可证类型已存在',
    en: 'License code already exists'
  },
  
  // 功能相关错误
  ERR_FEATURE_CODE_EXIST: {
    zh: '功能编码已存在',
    en: 'Feature code already exists'
  },
  ERR_FEATURE_NAME_EXIST: {
    zh: '功能名称已存在',
    en: 'Feature name already exists'
  },
  
  // 版本相关错误
  ERR_FIRMWARE_VERSION_EXIST: {
    zh: '韧件版本已存在',
    en: 'Firmware version already exists'
  },
  ERR_SOFTWARE_VERSION_EXIST: {
    zh: '软件版本已存在',
    en: 'Software version already exists'
  },
  ERR_FIRMWARE_NOT_EXIST: {
    zh: '韧件版本不存在',
    en: 'Firmware version does not exist'
  },
  ERR_SOFTWARE_NOT_EXIST: {
    zh: '软件版本不存在',
    en: 'Software version does not exist'
  },
  
  // 设备相关错误
  ERR_DEVICE_SN_EXIST: {
    zh: '设备序列号已存在',
    en: 'Device SN already exists'
  },
  ERR_DEVICE_NOT_EXIST: {
    zh: '设备不存在',
    en: 'Device does not exist'
  }
}

// 根据语言获取错误消息
export function getErrorMessage(errorCode, locale = 'zh') {
  const error = errorCodes[errorCode]
  if (!error) {
    return errorCode // 如果找不到对应的错误码，返回原始错误码
  }
  return error[locale] || error.zh // 默认返回中文
}

// 根据错误码获取本地化消息
export function getLocalizedMessage(errorCode, locale = 'zh') {
  return getErrorMessage(errorCode, locale)
}
