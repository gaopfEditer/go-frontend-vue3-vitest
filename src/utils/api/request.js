import axios from 'axios'
import { useStore } from '../stores'

// 创建axios实例
const service = axios.create({
  // 开发环境使用相对路径，生产环境使用完整 URL
  baseURL: '',
  timeout: 30000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const store = useStore()
    if (store.token) {
      config.headers['Authorization'] = `Bearer ${store.token}`
    }
    
    // 添加语言header
    const locale = (typeof window !== 'undefined' && window.localStorage) 
      ? localStorage.getItem('locale') || 'zh-hans'
      : 'zh-hans'
    // 根据locale设置Language header
    // 0: "en", 1: "zh-hans"
    let languageCode = 1 // 默认为中文
    if (locale === 'en') {
      languageCode = 0
    }
    config.headers['Language'] = languageCode.toString()
    
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 如果是登录接口，直接返回完整响应
    if (response.config.url === '/activate/base/login') {
      return response
    }
    // 其他接口检查业务状态码
    if (res.code !== 200) {
      if (res.code === 201000) {
        const store = useStore()
        store.logout()
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => {
    console.error('Response error:', error)
    return Promise.reject(error)
  }
)

// 封装请求方法
export const getRequest = (url, params) => {
  return service({
    url,
    method: 'get',
    params
  })
}

export const postRequest = (url, data) => {
  return service({
    url,
    method: 'post',
    data
  })
}

export const putRequest = (url, data) => {
  return service({
    url,
    method: 'put',
    data
  })
}

export const deleteRequest = (url) => {
  return service({
    url,
    method: 'delete'
  })
}