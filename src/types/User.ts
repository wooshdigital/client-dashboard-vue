export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'manager' | 'user'
  emailVerifiedAt?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  permissions: string[]
  preferences: {
    theme: 'light' | 'dark'
    notifications: {
      email: boolean
      browser: boolean
      sms: boolean
    }
    dashboard: {
      defaultView: string
      refreshInterval: number
    }
  }
}