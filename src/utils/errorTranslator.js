import { getErrorMessage } from '@/locales/errorCodes.js'

/**
 * 错误码翻译工具
 * @param {string} errorCode - 错误码
 * @param {string} locale - 语言代码，默认为 'zh'
 * @returns {string} 翻译后的错误消息
 */
export function translateError(errorCode, locale = 'zh') {
  if (!errorCode) return ''
  
  // 如果错误码包含 | 分隔符，直接解析
  if (errorCode.includes('|')) {
    const parts = errorCode.split('|')
    if (parts.length === 2) {
      return locale === 'en' ? parts[0].trim() : parts[1].trim()
    }
  }
  
  // 使用预定义的错误码映射
  return getErrorMessage(errorCode, locale)
}

/**
 * 从错误对象中提取并翻译错误消息
 * @param {Error|Object} error - 错误对象
 * @param {string} locale - 语言代码，默认为 'zh'
 * @returns {string} 翻译后的错误消息
 */
export function translateErrorMessage(error, locale = 'zh') {
  if (!error) return ''
  
  // 如果是字符串，直接翻译
  if (typeof error === 'string') {
    return translateError(error, locale)
  }
  
  // 如果是对象，尝试从 message 属性获取错误码
  if (error.message) {
    return translateError(error.message, locale)
  }
  
  // 如果是对象，尝试从 code 属性获取错误码
  if (error.code) {
    return translateError(error.code, locale)
  }
  
  // 如果都没有，返回原始错误信息
  return error.toString()
}

/**
 * 批量翻译错误消息
 * @param {Array} errors - 错误码数组
 * @param {string} locale - 语言代码，默认为 'zh'
 * @returns {Array} 翻译后的错误消息数组
 */
export function translateErrorMessages(errors, locale = 'zh') {
  if (!Array.isArray(errors)) return []
  
  return errors.map(error => translateErrorMessage(error, locale))
}

/**
 * 检查是否为已知错误码
 * @param {string} errorCode - 错误码
 * @returns {boolean} 是否为已知错误码
 */
export function isKnownErrorCode(errorCode) {
  if (!errorCode) return false
  
  // 检查是否包含 | 分隔符
  if (errorCode.includes('|')) return true
  
  // 检查是否在预定义错误码中
  const knownCodes = [
    'CODE_SUCCESS',
    'ERR_SERVER_BUSY',
    'ERR_OPERATION_FAILED',
    'ERR_INVALID_PARAMETER',
    'ERR_QUERY_FAILED',
    'ERR_ADD_FAILED',
    'ERR_DEL_FAILED',
    'ERR_MOD_FAILED',
    'ERR_TOKEN_EXPIRED',
    'ERR_NO_PERMISSION',
    'ERR_CAPTCHA_INCORRECT',
    'ERR_CAPTCHA_EXPIRED',
    'ERR_EMAIL_EXIST',
    'ERR_LOGIN_FAILED',
    'ERR_INCORRECT_PASSWORD',
    'ERR_USER_EXIST',
    'ERR_USER_NOT_EXIST',
    'ERR_PRODUCT_CODE_EXIST',
    'ERR_PRODUCT_NAME_EXIST',
    'ERR_MANAGER_ALREADY_EXIST',
    'ERR_LICENSE_TYPE_EXIST',
    'ERR_FEATURE_CODE_EXIST',
    'ERR_FIRMWARE_VERSION_EXIST',
    'ERR_SOFTWARE_VERSION_EXIST',
    'ERR_FIRMWARE_NOT_EXIST',
    'ERR_SOFTWARE_NOT_EXIST',
    'ERR_LICENSE_CODE_EXIST',
    'ERR_FEATURE_NAME_EXIST',
    'ERR_PRODUCT_HAS_RELATIONS',
    'ERR_ADD_LOG_FAILED',
    'ERR_PRODUCT_NOT_EXIST',
    'ERR_LICENSE_TYPE_NOT_EXIST',
    'ERR_DEVICE_SN_EXIST',
    'ERR_DEVICE_NOT_EXIST'
  ]
  
  return knownCodes.includes(errorCode)
}
