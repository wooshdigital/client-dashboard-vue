export interface Client {
  id: number
  name: string
  email: string
  phone?: string
  company: string
  website: string
  status: 'active' | 'inactive' | 'suspended'
  tier: 'basic' | 'premium' | 'enterprise'
  contractStartDate: string
  contractEndDate: string
  monthlyFee: number
  notes?: string
  createdAt: string
  updatedAt: string
  websites: Website[]
  primaryContact: {
    name: string
    email: string
    phone?: string
    position?: string
  }
  billingInfo: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  reportSettings: {
    frequency: 'daily' | 'weekly' | 'monthly'
    recipients: string[]
    includeAnalytics: boolean
    includeUptime: boolean
    includePerformance: boolean
  }
}

export interface Website {
  id: number
  clientId: number
  url: string
  name: string
  isActive: boolean
  monitoringEnabled: boolean
  lastCheckedAt?: string
  status: 'online' | 'offline' | 'warning'
  responseTime?: number
  uptimePercentage: number
  createdAt: string
  updatedAt: string
}