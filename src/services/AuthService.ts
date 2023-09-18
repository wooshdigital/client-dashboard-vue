import ApiService from './ApiService'
import { AxiosResponse } from 'axios'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  user: any
  token: string
  refreshToken: string
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AxiosResponse<LoginResponse>> {
    return ApiService.post('/auth/login', credentials)
  }

  async logout(): Promise<AxiosResponse> {
    return ApiService.post('/auth/logout')
  }

  async refreshToken(refreshToken: string): Promise<AxiosResponse<{ token: string }>> {
    return ApiService.post('/auth/refresh', { refreshToken })
  }

  async getUser(): Promise<AxiosResponse> {
    return ApiService.get('/auth/user')
  }

  async forgotPassword(email: string): Promise<AxiosResponse> {
    return ApiService.post('/auth/forgot-password', { email })
  }

  async resetPassword(token: string, password: string, passwordConfirmation: string): Promise<AxiosResponse> {
    return ApiService.post('/auth/reset-password', {
      token,
      password,
      password_confirmation: passwordConfirmation
    })
  }

  async updateProfile(profileData: any): Promise<AxiosResponse> {
    return ApiService.put('/auth/profile', profileData)
  }

  async changePassword(currentPassword: string, newPassword: string, passwordConfirmation: string): Promise<AxiosResponse> {
    return ApiService.put('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      password_confirmation: passwordConfirmation
    })
  }
}

export default new AuthService()