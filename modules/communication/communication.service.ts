import { CommunicationRepository } from './communication.repository'
import type { Message, Notification, SendMessagePayload } from './communication.types'

export class CommunicationService {
  private repository: CommunicationRepository

  constructor() {
    this.repository = new CommunicationRepository()
  }

  async fetchMessages(): Promise<Message[]> {
    return this.repository.getMessages()
  }

  async send(payload: SendMessagePayload): Promise<Message> {
    return this.repository.sendMessage(payload)
  }

  async fetchNotifications(): Promise<Notification[]> {
    return this.repository.getNotifications()
  }

  async readNotification(id: number): Promise<void> {
    return this.repository.markAsRead(id)
  }

  async fetchProgramComments(programId: string | number) {
    const response = await this.repository.getProgramComments(programId) as any
    // Handle both { data: [...] } and direct array (if unwrapped by useApi)
    const rawComments = response?.data || (Array.isArray(response) ? response : [])

    return rawComments.map((c: any) => ({
      id: c.id,
      text: c.content || c.text,
      authorId: c.user_id || c.authorId,
      authorName: c.user?.full_name || c.authorName || 'System',
      authorRole: (c.user?.role || c.authorRole || 'sme').toLowerCase(),
      timestamp: c.created_at || c.timestamp
    }))
  }

  async addProgramComment(programId: string | number, content: string) {
    return this.repository.postProgramComment(programId, content)
  }
}

export const communicationService = new CommunicationService()
