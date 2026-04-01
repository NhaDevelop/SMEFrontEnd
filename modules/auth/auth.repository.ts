import type { User, AuthResponse } from './auth.types'
import { useApi } from '~/composables/useApi'

export class AuthRepository {
  async login(credentials: any): Promise<AuthResponse> {
    const api = useApi()
    return await api<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials
    })
  }

  async logout(): Promise<void> {
    const api = useApi()
    await api('/auth/logout', { method: 'POST' })
  }

  async getUser(): Promise<User | null> {
    const api = useApi()
    try {
      const response = await api<any>('/auth/profile')
      return response.data || response // Handle both {data: User} and User response
    } catch {
      return null
    }
  }

  async updateGeneralProfile(data: any): Promise<User> {
    const api = useApi()
    const response = await api<any>('/auth/profile', {
      method: 'PATCH',
      body: data
    })
    return response.data || response
  }

  async updateSmeProfile(data: any): Promise<User> {
    const api = useApi()
    const response = await api<any>('/auth/sme/profile', {
      method: 'PATCH',
      body: data
    })
    return response.data || response
  }

  async updateInvestorProfile(data: any): Promise<User> {
    const api = useApi()
    const response = await api<any>('/auth/investor/profile', {
      method: 'PATCH',
      body: data
    })
    return response.data || response
  }

  async register(data: any): Promise<void> {
    const api = useApi()
    await api('/auth/register', {
      method: 'POST',
      body: data
    })
  }
}
