import { Hono } from 'hono'
import type { AppBindings, CaseStudyRow } from '../types.js'
import { parseRow } from '../types.js'
import { requireAuth } from '../middleware/auth.js'

export const searchRouter = new Hono<{ Bindings: AppBindings }>()

searchRouter.use('*', async (c, next) => {
  if (c.req.method === 'OPTIONS') return next()
  return requireAuth(c, next)
})

// GET /api/search?q=... — searches across models
searchRouter.get('/', async (c) => {
  const q = c.req.query('q')?.trim()
  if (!q || q.length < 2) return c.json({ caseStudies: [] })

  const pattern = `%${q}%`

  const { results: caseStudies } = await c.env.DB
    .prepare(`SELECT * FROM case_studies WHERE title LIKE ? OR client LIKE ? ORDER BY updated_at DESC LIMIT 8`)
    .bind(pattern, pattern)
    .all<CaseStudyRow>()

  return c.json({
    caseStudies: caseStudies.map(r => ({
      id: r.id,
      title: r.title,
      client: r.client,
      status: r.status
    }))
  })
})
