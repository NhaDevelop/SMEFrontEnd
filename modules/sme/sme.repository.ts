import { useApi } from '~/composables/useApi'

export class SmeRepository {
  async getSmeDetails() {
    const api = useApi()
    return await api('/sme/profile')
  }

  async getSmeDashboard() {
    const api = useApi()
    return await api('/sme/dashboard')
  }

  async getEnrolledPrograms() {
    const api = useApi()
    return await api('/sme/enrolled-programs')
  }

  async getTemplates() {
    const api = useApi()
    return await api('/sme/templates')
  }

  async getQuestions(templateId?: string | number) {
    const api = useApi()
    return await api('/sme/questions', { params: { template_id: templateId } })
  }

  async getFrameworkSettings() {
    const api = useApi()
    return await api('/sme/settings')
  }

  async getSectors() {
    const api = useApi()
    return await api('/sme/sectors')
  }

  async getPrograms() {
    const api = useApi()
    return await api('/sme/programs')
  }

  async applyToProgram(id: string | number) {
    const api = useApi()
    return await api(`/programs/${id}/apply`, { method: 'POST' })
  }

  async getProgramComments(id: string | number) {
    const api = useApi()
    return await api(`/programs/${id}/comments`)
  }

  async getProgramParticipants(id: string | number) {
    const api = useApi()
    return await api(`/programs/${id}/participants`)
  }

  async postProgramComment(id: string | number, content: string) {
    const api = useApi()
    return await api(`/programs/${id}/comments`, {
      method: 'POST',
      body: { content }
    })
  }
}
