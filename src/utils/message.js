import { ElMessage, ElMessageBox } from 'element-plus'
import i18n from './i18n'
import { translateErrorMessage } from './errorTranslator'

const { t, locale } = i18n.global

export const message = {
  error: (msg, key = 'unknown') => {
    let errorMessage = msg
    
    // 如果传入的是错误对象或错误码，尝试翻译
    if (msg && (typeof msg === 'object' || typeof msg === 'string')) {
      errorMessage = translateErrorMessage(msg, locale.value)
    }
    
    // 如果翻译失败，使用原始消息或国际化键
    if (!errorMessage || errorMessage === msg) {
      errorMessage = msg || t(`message.error.${key}`)
    }
    
    ElMessage.error(errorMessage)
  },
  success: (msg) => {
    ElMessage.success(msg)
  },
  confirm: (key = 'delete') => {
    return ElMessageBox.confirm(
      t(`message.confirm.${key}`),
      t('common.warning'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
  },
  info: (msg) => {
    ElMessage.info(msg)
  }
} 