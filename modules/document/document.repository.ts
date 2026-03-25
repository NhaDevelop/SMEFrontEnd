import { useApi } from '~/composables/useApi'
import type { Document, DocumentUploadPayload } from './document.types'

export class DocumentRepository {
  async getDocuments(): Promise<Document[]> {
    const api = useApi()
    return await api<Document[]>('/documents')
  }

  async uploadDocument(payload: DocumentUploadPayload): Promise<Document> {
    const config = useRuntimeConfig()
    const token = useCookie('irip_access_token').value ||
        (typeof localStorage !== 'undefined' ? localStorage.getItem('irip_access_token') : null)

    const formData = new FormData()
    formData.append('file', payload.file)
    formData.append('name', payload.name)
    formData.append('category', payload.category)
    if (payload.description) {
      formData.append('description', payload.description)
    }

    // Use $fetch for multipart to avoid useApi default JSON headers
    return await $fetch<Document>(`${config.public.apiBase}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: formData
    })
  }

  async deleteDocument(id: number | string): Promise<void> {
    const api = useApi()
    await api(`/documents/${id}`, { method: 'DELETE' })
  }
}
