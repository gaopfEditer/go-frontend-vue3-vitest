import { defineStore } from 'pinia'
import { auth } from '../api'
import router from '../../router'
import { message } from '../message'

export const useStore = defineStore('main', {
  state: () => {
    // 安全地获取 token，避免在构建时出错
    let token = ''
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('token') || ''
    }
    return {
      token,
      userInfo: null,
      products: [],
      devices: []
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    setToken(token) {
      const actualToken = token.replace('Bearer ', '')
      this.token = actualToken
      localStorage.setItem('token', actualToken)
    },

    setUserInfo(resp) {
      this.userInfo = resp.data
      localStorage.setItem('userInfo', JSON.stringify(resp.data))
    },

    async login(credentials) {
      try {
        debugger
        const response = await auth.login(credentials)
        if (response.data.code !== 200) {
          throw new Error(response.data.message || 'server')
        }
        
        const token = response.headers?.authorization
        if (!token) {
          throw new Error('unauthorized')
        }

        this.setToken(token)
        this.setUserInfo(response.data)
        await router.push('/')
        return response
      } catch (err) {
        throw err
      }
    },

    logout() {
      // if (!message.confirm('logout')) return

      this.token = ''
      this.userInfo = null
      this.products = []
      this.devices = []
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    },

    initUserInfo() {
      const savedInfo = localStorage.getItem('userInfo')
      if (savedInfo) {
        this.userInfo = JSON.parse(savedInfo)
      }
    }
  }
}) 