import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import store from '@/store'
import router from '@/router'

class ApiService {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = store.getters['auth/token']
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            await store.dispatch('auth/refreshToken')
            return this.axiosInstance(originalRequest)
          } catch (refreshError) {
            store.dispatch('auth/logout')
            router.push('/login')
            return Promise.reject(refreshError)
          }
        }

        if (error.response?.status === 403) {
          // Handle forbidden access
          console.error('Access forbidden:', error.response.data)
        }

        if (error.response?.status >= 500) {
          // Handle server errors
          console.error('Server error:', error.response.data)
        }

        return Promise.reject(error)
      }
    )
  }

  public get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.axiosInstance.get(url, config)
  }

  public post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.axiosInstance.post(url, data, config)
  }

  public put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.axiosInstance.put(url, data, config)
  }

  public patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.axiosInstance.patch(url, data, config)
  }

  public delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.axiosInstance.delete(url, config)
  }

  public setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  public clearAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization']
  }
}

export default new ApiService()