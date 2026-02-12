import type { User, AuthResponse } from './auth.types'

export class AuthRepository {
  async login(credentials: any): Promise<AuthResponse> {
    return await $fetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
  }

  async logout(): Promise<void> {
    return await $fetch('/api/auth/logout', { method: 'POST' })
  }

  async getUser(): Promise<User | null> {
    try {
      return await $fetch<User>('/api/auth/user')
    } catch {
      return null
    }
  }
}
