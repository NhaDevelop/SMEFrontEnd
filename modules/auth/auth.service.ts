import { AuthRepository } from './auth.repository'
import type { User, AuthResponse } from './auth.types'

export class AuthService {
  private repository: AuthRepository

  constructor() {
    this.repository = new AuthRepository()
  }

  async login(credentials: any): Promise<AuthResponse> {
    return this.repository.login(credentials)
  }

  async logout(): Promise<void> {
    return this.repository.logout()
  }

  async getCurrentUser(): Promise<User | null> {
    return this.repository.getUser()
  }

  async register(data: any): Promise<void> {
    return this.repository.register(data)
  }
}

export const authService = new AuthService()
