import { useApi } from '~/composables/useApi'

export class AdminRepository {
  // Users
  async getUsers() {
    const api = useApi()
    return await api('/admin/users')
  }

  async getPendingUsers() {
    const api = useApi()
    return await api('/admin/users/pending')
  }

  async createUser(data: any) {
    const api = useApi()
    return await api('/admin/users', { method: 'POST', body: data })
  }

  async updateUserStatus(id: number | string, action: 'approve' | 'reject') {
    const api = useApi()
    return await api(`/admin/users/${id}/status`, { method: 'PATCH', body: { action } })
  }

  async updateUserRole(id: number | string, role: string) {
    const api = useApi()
    return await api(`/admin/users/${id}/role`, { method: 'PATCH', body: { role } })
  }

  async resetPassword(id: number | string, password?: string) {
    const api = useApi()
    return await api(`/admin/users/${id}/reset-password`, { method: 'POST', body: { password } })
  }

  async deleteUser(id: number | string) {
    const api = useApi()
    return await api(`/admin/users/${id}`, { method: 'DELETE' })
  }

  // Programs
  async getPrograms() {
    const api = useApi()
    return await api('/admin/programs')
  }

  async createProgram(data: any) {
    const api = useApi()
    return await api('/admin/programs', { method: 'POST', body: data })
  }

  async updateProgram(id: number | string, data: any) {
    const api = useApi()
    return await api(`/admin/programs/${id}`, { method: 'PUT', body: data })
  }

  async updateProgramStatus(id: number | string, status: string) {
    const api = useApi()
    return await api(`/admin/programs/${id}/status`, { method: 'PATCH', body: { status } })
  }

  async deleteProgram(id: number | string) {
    const api = useApi()
    return await api(`/admin/programs/${id}`, { method: 'DELETE' })
  }

  async enrollSmes(programId: number | string, smeIds: (number | string)[]) {
    const api = useApi()
    return await api('/admin/programs/enroll', { method: 'POST', body: { programId, smeIds } })
  }

  async updateEnrollmentStatus(programId: number | string, smeId: number | string, status: string) {
    const api = useApi()
    return await api('/admin/programs/enrollments/status', { method: 'PATCH', body: { programId, smeId, status } })
  }

  // Framework (Sectors, Pillars, Templates, Questions)
  async getSectors() {
    const api = useApi()
    return await api('/admin/sectors')
  }

  async getPublicSectors() {
    const api = useApi()
    return await api('/sectors')
  }

  async createSector(data: any) {
    const api = useApi()
    return await api('/admin/sectors', { method: 'POST', body: data })
  }

  async getPillars() {
    const api = useApi()
    return await api('/admin/pillars')
  }

  async createPillar(data: any) {
    const api = useApi()
    return await api('/admin/pillars', { method: 'POST', body: data })
  }

  async getParticipants(programId: number | string) {
    const api = useApi()
    return await api(`/admin/programs/${programId}/participants`)
  }

  async getTemplates() {
    const api = useApi()
    return await api('/admin/templates')
  }

  async getActiveTemplates(programId?: number | string) {
    const api = useApi()
    const params = programId ? { program_id: programId } : undefined
    return await api('/admin/templates/active', { params })
  }

  async updateTemplateStatus(id: number | string, status: string) {
    const api = useApi()
    return await api(`/admin/templates/${id}/status`, { method: 'PATCH', body: { status } })
  }

  async createTemplate(data: any) {
    const api = useApi()
    return await api('/admin/templates', { method: 'POST', body: data })
  }

  async getQuestions() {
    const api = useApi()
    return await api('/admin/questions')
  }

  async createQuestion(data: any) {
    const api = useApi()
    return await api('/admin/questions', { method: 'POST', body: data })
  }

  async updateQuestion(id: number | string, data: any) {
    const api = useApi()
    return await api(`/admin/questions/${id}`, { method: 'PUT', body: data })
  }

  async deleteQuestion(id: number | string) {
    const api = useApi()
    return await api('/admin/questions', { method: 'DELETE', params: { id } })
  }

  async addIndicator(data: any) {
    const api = useApi()
    return await api('/admin/indicators', { method: 'POST', body: data })
  }

  // Stats & Logs
  async getDashboardStats() {
    const api = useApi()
    return await api('/admin/dashboard')
  }

  async getFrameworkSettings() {
    const api = useApi()
    return await api('/admin/settings')
  }

  async updateFrameworkSettings(data: any) {
    const api = useApi()
    return await api('/admin/settings', { method: 'POST', body: data })
  }

  async getAuditLogs(page: number = 1) {
    const api = useApi()
    return await api('/admin/audit-logs', { params: { page } })
  }

  async getSmeDirectory(programId?: string | number) {
    const api = useApi()
    const params = programId ? { program_id: programId } : undefined
    return await api('/admin/smes', { params })
  }

  async getVerificationRequests() {
    const api = useApi()
    return await api('/admin/verification-requests')
  }

  async updateVerificationStatus(id: number | string, status: string) {
    const api = useApi()
    return await api(`/admin/verification-requests/${id}`, { method: 'PATCH', body: { status } })
  }

  // --- NEW CRUD METHODS ---
  async updateSector(id: number | string, data: any) {
    const api = useApi()
    return await api(`/admin/sectors/${id}`, { method: 'PUT', body: data })
  }

  async deleteSector(id: number | string) {
    const api = useApi()
    return await api(`/admin/sectors/${id}`, { method: 'DELETE' })
  }

  async updatePillar(id: number | string, data: any) {
    const api = useApi()
    return await api(`/admin/pillars/${id}`, { method: 'PUT', body: data })
  }

  async deletePillar(id: number | string) {
    const api = useApi()
    return await api(`/admin/pillars/${id}`, { method: 'DELETE' })
  }

  async updateTemplate(id: number | string, data: any) {
    const api = useApi()
    return await api(`/admin/templates/${id}`, { method: 'PUT', body: data })
  }

  async deleteTemplate(id: number | string) {
    const api = useApi()
    return await api(`/admin/templates/${id}`, { method: 'DELETE' })
  }
}
