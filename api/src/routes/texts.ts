import { Hono } from 'hono'
import type { AppBindings } from '../types.js'
import { requireAuth } from '../middleware/auth.js'

export const textsRouter = new Hono<{ Bindings: AppBindings }>()

textsRouter.use('*', async (c, next) => {
  if (c.req.method === 'OPTIONS') return next()
  return requireAuth(c, next)
})

interface TextRow { key: string; value: string; description: string; updated_at: string }

// GET /api/texts
textsRouter.get('/', async (c) => {
  const { results } = await c.env.DB
    .prepare('SELECT key, value, description, updated_at FROM texts ORDER BY key ASC')
    .all<TextRow>()
  return c.json(results)
})

// PUT /api/texts — upserts { key, value } pairs
textsRouter.put('/', async (c) => {
  const body = await c.req.json<{ key: string; value: string }[]>()
  if (!Array.isArray(body) || body.length === 0) return c.json({ error: 'No data provided' }, 400)
  const now = new Date().toISOString()
  for (const { key, value } of body) {
    await c.env.DB
      .prepare('UPDATE texts SET value = ?, updated_at = ? WHERE key = ?')
      .bind(value, now, key)
      .run()
  }
  return c.json({ ok: true })
})
