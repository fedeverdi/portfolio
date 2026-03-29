import { Hono } from 'hono'
import type { AppBindings } from '../types.js'
import { requireAuth } from '../middleware/auth.js'

export const imagesRouter = new Hono<{ Bindings: AppBindings }>()

imagesRouter.options('*', (c) => new Response(null, { status: 204 }))
imagesRouter.use('*', requireAuth)

// POST /api/images/upload
// Body: multipart/form-data with field "file"
imagesRouter.post('/upload', async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file') as File | null

  if (!file) return c.json({ error: 'No file provided' }, 400)

  // Validate MIME type
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) {
    return c.json({ error: 'Only JPEG, PNG, WebP and GIF images are allowed' }, 400)
  }

  // Validate size: max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return c.json({ error: 'Image must be smaller than 5MB' }, 400)
  }

  const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
  const key = `case-studies/${crypto.randomUUID()}.${ext}`

  await c.env.IMAGES_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type }
  })

  const baseUrl = c.env.IMAGES_PUBLIC_URL.replace(/\/$/, '')
  const url = `${baseUrl}/${key}`

  return c.json({ url, key }, 201)
})

// DELETE /api/images/:key
// key is base64url-encoded to allow slashes
imagesRouter.delete('/:key', async (c) => {
  const key = atob(c.req.param('key').replace(/-/g, '+').replace(/_/g, '/'))
  await c.env.IMAGES_BUCKET.delete(key)
  return c.json({ success: true })
})
