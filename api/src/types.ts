export interface AppBindings {
  DB: D1Database
  IMAGES_BUCKET: R2Bucket
  JWT_SECRET: string
  ADMIN_EMAIL: string
  ADMIN_PASSWORD: string
  FRONTEND_ORIGIN: string
  BACKOFFICE_ORIGIN: string
  CF_ZONE_ID: string
  CF_PURGE_TOKEN: string
  RESEND_API_KEY: string
  FROM_EMAIL: string
  NOTIFY_EMAIL: string
  TURNSTILE_SECRET: string
  IMAGES_PUBLIC_URL: string
}

export interface CaseStudy {
  id: string
  title: string
  client: string
  description: string
  tags: string[]
  status: 'published' | 'draft' | 'archived'
  coverImage?: string | null
  content?: string | null
  createdAt: string
  updatedAt: string
}

export interface CaseStudyRow {
  id: string
  title: string
  client: string
  description: string
  tags: string
  status: 'published' | 'draft' | 'archived'
  cover_image: string | null
  content: string | null
  created_at: string
  updated_at: string
}

export function parseRow(row: CaseStudyRow): CaseStudy {
  return {
    id: row.id,
    title: row.title,
    client: row.client,
    description: row.description,
    tags: JSON.parse(row.tags) as string[],
    status: row.status,
    coverImage: row.cover_image,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}
