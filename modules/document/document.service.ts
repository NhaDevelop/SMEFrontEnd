import { DocumentRepository } from './document.repository'
import type { Document, DocumentUploadPayload } from './document.types'

export class DocumentService {
  private repository: DocumentRepository

  constructor() {
    this.repository = new DocumentRepository()
  }

  async fetchDocuments(): Promise<Document[]> {
    return this.repository.getDocuments()
  }

  async upload(payload: DocumentUploadPayload): Promise<Document> {
    return this.repository.uploadDocument(payload)
  }

  async delete(id: number | string): Promise<void> {
    return this.repository.deleteDocument(id)
  }
}

export const documentService = new DocumentService()
