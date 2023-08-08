import { Module } from 'vuex'
import AuthService from '@/services/AuthService'
import { User } from '@/types/User'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
}

const auth: Module<AuthState, any> = {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken')
  },
  mutations: {
    SET_USER(state, user: User) {
      state.user = user
    },
    SET_TOKEN(state, token: string) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_REFRESH_TOKEN(state, refreshToken: string) {
      state.refreshToken = refreshToken
      localStorage.setItem('refreshToken', refreshToken)
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      state.refreshToken = null
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  },
  actions: {
    async login({ commit }, credentials: { email: string; password: string }) {
      try {
        const response = await AuthService.login(credentials)
        const { user, token, refreshToken } = response.data
        
        commit('SET_USER', user)
        commit('SET_TOKEN', token)
        commit('SET_REFRESH_TOKEN', refreshToken)
        
        return response
      } catch (error) {
        throw error
      }
    },
    async logout({ commit }) {
      try {
        await AuthService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        commit('CLEAR_AUTH')
      }
    },
    async refreshToken({ commit, state }) {
      try {
        if (!state.refreshToken) throw new Error('No refresh token available')
        
        const response = await AuthService.refreshToken(state.refreshToken)
        const { token } = response.data
        
        commit('SET_TOKEN', token)
        return response
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    },
    async fetchUser({ commit }) {
      try {
        const response = await AuthService.getUser()
        commit('SET_USER', response.data)
        return response
      } catch (error) {
        throw error
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    user: (state) => state.user,
    token: (state) => state.token
  }
}

export default auth