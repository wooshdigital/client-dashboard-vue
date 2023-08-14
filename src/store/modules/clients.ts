import { Module } from 'vuex'
import ClientService from '@/services/ClientService'
import { Client } from '@/types/Client'

interface ClientsState {
  clients: Client[]
  currentClient: Client | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

const clients: Module<ClientsState, any> = {
  namespaced: true,
  state: {
    clients: [],
    currentClient: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    }
  },
  mutations: {
    SET_CLIENTS(state, clients: Client[]) {
      state.clients = clients
    },
    SET_CURRENT_CLIENT(state, client: Client) {
      state.currentClient = client
    },
    ADD_CLIENT(state, client: Client) {
      state.clients.push(client)
    },
    UPDATE_CLIENT(state, updatedClient: Client) {
      const index = state.clients.findIndex(c => c.id === updatedClient.id)
      if (index !== -1) {
        state.clients[index] = updatedClient
      }
      if (state.currentClient?.id === updatedClient.id) {
        state.currentClient = updatedClient
      }
    },
    REMOVE_CLIENT(state, clientId: number) {
      state.clients = state.clients.filter(c => c.id !== clientId)
      if (state.currentClient?.id === clientId) {
        state.currentClient = null
      }
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = { ...state.pagination, ...pagination }
    }
  },
  actions: {
    async fetchClients({ commit }, { page = 1, search = '', status = '' } = {}) {
      try {
        const response = await ClientService.getClients({ page, search, status })
        const { data, pagination } = response.data
        
        commit('SET_CLIENTS', data)
        commit('SET_PAGINATION', pagination)
        return response
      } catch (error) {
        throw error
      }
    },
    async fetchClient({ commit }, clientId: number) {
      try {
        const response = await ClientService.getClient(clientId)
        commit('SET_CURRENT_CLIENT', response.data)
        return response
      } catch (error) {
        throw error
      }
    },
    async createClient({ commit }, clientData: Partial<Client>) {
      try {
        const response = await ClientService.createClient(clientData)
        commit('ADD_CLIENT', response.data)
        return response
      } catch (error) {
        throw error
      }
    },
    async updateClient({ commit }, { clientId, clientData }: { clientId: number; clientData: Partial<Client> }) {
      try {
        const response = await ClientService.updateClient(clientId, clientData)
        commit('UPDATE_CLIENT', response.data)
        return response
      } catch (error) {
        throw error
      }
    },
    async deleteClient({ commit }, clientId: number) {
      try {
        await ClientService.deleteClient(clientId)
        commit('REMOVE_CLIENT', clientId)
      } catch (error) {
        throw error
      }
    }
  },
  getters: {
    clients: (state) => state.clients,
    currentClient: (state) => state.currentClient,
    pagination: (state) => state.pagination,
    activeClients: (state) => state.clients.filter(client => client.status === 'active'),
    totalClients: (state) => state.clients.length
  }
}

export default clients