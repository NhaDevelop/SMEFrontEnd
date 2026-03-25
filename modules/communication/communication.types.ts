export interface Message {
  id: number
  sender_id: number
  receiver_id: number
  content: string
  chat_id: string
  read: boolean
  created_at: string
  sender?: { id: number, full_name: string }
  receiver?: { id: number, full_name: string }
}

export interface Notification {
  id: number
  type: string
  message: string
  channel: 'IN_APP' | 'EMAIL' | 'PUSH'
  is_read: boolean
  created_at: string
}

export interface SendMessagePayload {
  receiver_id: number
  content: string
  chat_id: string
}
