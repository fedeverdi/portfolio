import { Hono } from 'hono'
import type { AppBindings } from '../types.js'
import { requireAuth } from '../middleware/auth.js'

export const contactsRouter = new Hono<{ Bindings: AppBindings }>()

contactsRouter.options('*', (c) => c.text('', 204))

// All contact management routes require auth
contactsRouter.use('*', requireAuth)

contactsRouter.get('/', async (c) => {
  const { results } = await c.env.DB
    .prepare('SELECT * FROM contact_requests ORDER BY created_at DESC')
    .all()
  return c.json(results)
})

contactsRouter.patch('/:id/read', async (c) => {
  await c.env.DB
    .prepare('UPDATE contact_requests SET is_read = 1 WHERE id = ?')
    .bind(c.req.param('id'))
    .run()
  return c.json({ success: true })
})

contactsRouter.delete('/:id', async (c) => {
  await c.env.DB
    .prepare('DELETE FROM contact_requests WHERE id = ?')
    .bind(c.req.param('id'))
    .run()
  return c.json({ success: true })
})
