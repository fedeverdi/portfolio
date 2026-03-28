import { Hono } from 'hono'
import type { AppBindings, CaseStudy, CaseStudyRow } from '../types.js'
import { parseRow } from '../types.js'
import { requireAuth } from '../middleware/auth.js'

export const caseStudiesRouter = new Hono<{ Bindings: AppBindings }>()

// All routes require JWT auth (skip OPTIONS preflight)
caseStudiesRouter.use('*', async (c, next) => {
  if (c.req.method === 'OPTIONS') return next()
  return requireAuth(c, next)
})

// GET /api/case-studies
caseStudiesRouter.get('/', async (c) => {
  const { results } = await c.env.DB
    .prepare('SELECT * FROM case_studies ORDER BY created_at DESC')
    .all<CaseStudyRow>()
  return c.json(results.map(parseRow))
})

// GET /api/case-studies/:id
caseStudiesRouter.get('/:id', async (c) => {
  const item = await c.env.DB
    .prepare('SELECT * FROM case_studies WHERE id = ?')
    .bind(c.req.param('id'))
    .first<CaseStudyRow>()
  if (!item) return c.json({ error: 'Not found' }, 404)
  return c.json(parseRow(item))
})

// POST /api/case-studies
caseStudiesRouter.post('/', async (c) => {
  const body = await c.req.json<Partial<CaseStudy>>()
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await c.env.DB.prepare(
    `INSERT INTO case_studies
       (id, title, client, description, tags, status, cover_image, content, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    body.title ?? '',
    body.client ?? '',
    body.description ?? '',
    JSON.stringify(body.tags ?? []),
    body.status ?? 'draft',
    body.coverImage ?? null,
    body.content ?? '',
    now, now
  ).run()

  const created = await c.env.DB
    .prepare('SELECT * FROM case_studies WHERE id = ?')
    .bind(id)
    .first<CaseStudyRow>()
  return c.json(parseRow(created!), 201)
})

// PUT /api/case-studies/:id
caseStudiesRouter.put('/:id', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB
    .prepare('SELECT * FROM case_studies WHERE id = ?')
    .bind(id)
    .first<CaseStudyRow>()
  if (!existing) return c.json({ error: 'Not found' }, 404)

  const body = await c.req.json<Partial<CaseStudy>>()
  const now = new Date().toISOString()

  await c.env.DB.prepare(
    `UPDATE case_studies
     SET title = ?, client = ?, description = ?, tags = ?,
         status = ?, cover_image = ?, content = ?, updated_at = ?
     WHERE id = ?`
  ).bind(
    body.title ?? existing.title,
    body.client ?? existing.client,
    body.description ?? existing.description,
    JSON.stringify(body.tags ?? (JSON.parse(existing.tags) as string[])),
    body.status ?? existing.status,
    'coverImage' in body ? (body.coverImage ?? null) : existing.cover_image,
    'content' in body ? (body.content ?? '') : existing.content,
    now, id
  ).run()

  const updated = await c.env.DB
    .prepare('SELECT * FROM case_studies WHERE id = ?')
    .bind(id)
    .first<CaseStudyRow>()
  return c.json(parseRow(updated!))
})

// DELETE /api/case-studies/:id
caseStudiesRouter.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const existing = await c.env.DB
    .prepare('SELECT * FROM case_studies WHERE id = ?')
    .bind(id)
    .first<CaseStudyRow>()
  if (!existing) return c.json({ error: 'Not found' }, 404)
  await c.env.DB.prepare('DELETE FROM case_studies WHERE id = ?').bind(id).run()
  return c.body(null, 204)
})
