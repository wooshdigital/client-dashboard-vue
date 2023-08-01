import { createStore } from 'vuex'
import auth from './modules/auth'
import clients from './modules/clients'
import reports from './modules/reports'
import notifications from './modules/notifications'
import analytics from './modules/analytics'

export default createStore({
  modules: {
    auth,
    clients,
    reports,
    notifications,
    analytics
  },
  state: {
    loading: false,
    error: null
  },
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_ERROR(state) {
      state.error = null
    }
  },
  actions: {
    setLoading({ commit }, loading) {
      commit('SET_LOADING', loading)
    },
    setError({ commit }, error) {
      commit('SET_ERROR', error)
    },
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    }
  },
  getters: {
    isLoading: (state) => state.loading,
    error: (state) => state.error
  }
})