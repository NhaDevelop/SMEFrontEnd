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
      return await api<User>('/auth/profile')
    } catch {
      return null
    }
  }

  async register(data: any): Promise<void> {
    const api = useApi()
    await api('/auth/register', {
      method: 'POST',
      body: data
    })
  }
}
