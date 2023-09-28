import ApiService from './ApiService'
import { AxiosResponse } from 'axios'
import { Client } from '@/types/Client'

interface GetClientsParams {
  page?: number
  search?: string
  status?: string
  perPage?: number
}

class ClientService {
  async getClients(params: GetClientsParams = {}): Promise<AxiosResponse> {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.status) queryParams.append('status', params.status)
    if (params.perPage) queryParams.append('per_page', params.perPage.toString())
    
    const queryString = queryParams.toString()
    const url = queryString ? `/clients?${queryString}` : '/clients'
    
    return ApiService.get(url)
  }

  async getClient(clientId: number): Promise<AxiosResponse<Client>> {
    return ApiService.get(`/clients/${clientId}`)
  }

  async createClient(clientData: Partial<Client>): Promise<AxiosResponse<Client>> {
    return ApiService.post('/clients', clientData)
  }

  async updateClient(clientId: number, clientData: Partial<Client>): Promise<AxiosResponse<Client>> {
    return ApiService.put(`/clients/${clientId}`, clientData)
  }

  async deleteClient(clientId: number): Promise<AxiosResponse> {
    return ApiService.delete(`/clients/${clientId}`)
  }

  async getClientWebsites(clientId: number): Promise<AxiosResponse> {
    return ApiService.get(`/clients/${clientId}/websites`)
  }

  async getClientAnalytics(clientId: number, period: string = '30d'): Promise<AxiosResponse> {
    return ApiService.get(`/clients/${clientId}/analytics?period=${period}`)
  }

  async getClientReports(clientId: number): Promise<AxiosResponse> {
    return ApiService.get(`/clients/${clientId}/reports`)
  }

  async toggleClientStatus(clientId: number): Promise<AxiosResponse<Client>> {
    return ApiService.patch(`/clients/${clientId}/toggle-status`)
  }
}

export default new ClientService()