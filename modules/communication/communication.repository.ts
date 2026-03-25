import { useApi } from '~/composables/useApi'
import type { Message, Notification, SendMessagePayload } from './communication.types'

export class CommunicationRepository {
  async getMessages(): Promise<Message[]> {
    const api = useApi()
    return await api<Message[]>('/messages')
  }

  async sendMessage(payload: SendMessagePayload): Promise<Message> {
    const api = useApi()
    return await api<Message>('/messages', {
      method: 'POST',
      body: payload
    })
  }

  async getNotifications(): Promise<Notification[]> {
    const api = useApi()
    return await api<Notification[]>('/notifications')
  }

  async markAsRead(id: number): Promise<void> {
    const api = useApi()
    await api(`/notifications/${id}/read`, { method: 'PATCH' })
  }

  // Program Comments
  async getProgramComments(programId: string | number) {
    const api = useApi()
    return await api(`/programs/${programId}/comments`)
  }

  async postProgramComment(programId: string | number, content: string) {
    const api = useApi()
    return await api(`/programs/${programId}/comments`, {
      method: 'POST',
      body: { content }
    })
  }
}
