import { Hono } from 'hono'
import type { AppBindings } from '../types.js'
import { requireAuth } from '../middleware/auth.js'

export const settingsRouter = new Hono<{ Bindings: AppBindings }>()

settingsRouter.use('*', async (c, next) => {
  if (c.req.method === 'OPTIONS') return next()
  return requireAuth(c, next)
})

// GET /api/settings — returns all settings as { key: value }
settingsRouter.get('/', async (c) => {
  const { results } = await c.env.DB
    .prepare('SELECT key, value FROM settings')
    .all<{ key: string; value: string }>()
  const obj: Record<string, string> = {}
  for (const row of results) obj[row.key] = row.value
  return c.json(obj)
})

// PUT /api/settings — upserts each key/value pair then purges frontend cache
settingsRouter.put('/', async (c) => {
  const body = await c.req.json<Record<string, string>>()
  const entries = Object.entries(body)
  if (entries.length === 0) return c.json({ error: 'No data provided' }, 400)

  for (const [key, value] of entries) {
    await c.env.DB
      .prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
      .bind(key, value)
      .run()
  }

  // Purge Cloudflare cache for the frontend
  if (c.env.CF_ZONE_ID && c.env.CF_PURGE_TOKEN) {
    await fetch(
      `https://api.cloudflare.com/client/v4/zones/${c.env.CF_ZONE_ID}/purge_cache`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.CF_PURGE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files: ['https://portfolio.federicoverdi.it/'] })
      }
    )
  }

  return c.json({ ok: true })
})
