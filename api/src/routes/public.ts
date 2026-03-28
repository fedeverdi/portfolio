import { Hono } from 'hono'
import type { AppBindings, CaseStudyRow } from '../types.js'
import { parseRow } from '../types.js'

export const publicRouter = new Hono<{ Bindings: AppBindings }>()

publicRouter.get('/texts', async (c) => {
  const { results } = await c.env.DB
    .prepare('SELECT key, value FROM texts ORDER BY key ASC')
    .all<{ key: string; value: string }>()
  const obj: Record<string, string> = {}
  for (const row of results) obj[row.key] = row.value
  c.header('Cache-Control', 'no-store')
  return c.json(obj)
})

publicRouter.get('/settings', async (c) => {
  const { results } = await c.env.DB
    .prepare('SELECT key, value FROM settings')
    .all<{ key: string; value: string }>()
  const obj: Record<string, string> = {}
  for (const row of results) obj[row.key] = row.value
  return c.json(obj)
})

publicRouter.get('/case-studies', async (c) => {
  const { results } = await c.env.DB
    .prepare("SELECT * FROM case_studies WHERE status = 'published' ORDER BY created_at DESC")
    .all<CaseStudyRow>()
  return c.json(results.map(parseRow))
})

publicRouter.get('/case-studies/:id', async (c) => {
  const item = await c.env.DB
    .prepare("SELECT * FROM case_studies WHERE id = ? AND status = 'published'")
    .bind(c.req.param('id'))
    .first<CaseStudyRow>()
  if (!item) return c.json({ error: 'Not found' }, 404)
  return c.json(parseRow(item))
})

