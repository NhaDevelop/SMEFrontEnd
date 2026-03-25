export interface Document {
  id: number | string
  sme_id: number | string
  name: string
  original_filename: string
  category: string
  description?: string
  size: number
  file_url: string
  is_verified: boolean
  uploaded_at: string
}

export interface DocumentUploadPayload {
  file: File
  name: string
  category: string
  description?: string
}
