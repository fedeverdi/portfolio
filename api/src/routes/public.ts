import { Hono } from 'hono'
import type { AppBindings, CaseStudyRow } from '../types.js'
import { parseRow } from '../types.js'

export const publicRouter = new Hono<{ Bindings: AppBindings }>()

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

publicRouter.options('/contact', (c) => new Response(null, { status: 204 }))

publicRouter.post('/contact', async (c) => {
  const body = await c.req.json().catch(() => null)
  if (!body) return c.json({ error: 'Invalid JSON' }, 400)

  const name = (body.name ?? '').trim()
  const email = (body.email ?? '').trim()
  const message = (body.message ?? '').trim()
  const turnstileToken = (body.turnstileToken ?? '').trim()

  if (!name || !email || !message) {
    return c.json({ error: 'All fields are required' }, 400)
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ error: 'Invalid email address' }, 400)
  }

  // Verify Turnstile token
  if (c.env.TURNSTILE_SECRET) {
    if (!turnstileToken) {
      return c.json({ error: 'Security check required' }, 400)
    }
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: c.env.TURNSTILE_SECRET,
        response: turnstileToken
      })
    })
    const result = await verification.json() as { success: boolean }
    if (!result.success) {
      return c.json({ error: 'Security check failed. Please try again.' }, 400)
    }
  }

  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await c.env.DB
    .prepare('INSERT INTO contact_requests (id, name, email, message, is_read, created_at) VALUES (?, ?, ?, ?, 0, ?)')
    .bind(id, name, email, message, now)
    .run()

  // Send notification email via Resend (non-blocking)
  if (c.env.RESEND_API_KEY) {
    const from = c.env.FROM_EMAIL ? `Portfolio <${c.env.FROM_EMAIL}>` : 'Portfolio <onboarding@resend.dev>'
    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${c.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [c.env.NOTIFY_EMAIL || c.env.ADMIN_EMAIL],
        subject: `New contact request from ${name}`,
        html: `<h2>New contact request</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p><p><strong>Message:</strong></p><p>${safeMessage}</p>`
      })
    })
  }

  return c.json({ success: true }, 201)
})

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

