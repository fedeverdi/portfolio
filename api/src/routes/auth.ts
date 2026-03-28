import { Hono } from 'hono'
import type { AppBindings } from '../types.js'
import { signToken } from '../middleware/auth.js'

export const authRouter = new Hono<{ Bindings: AppBindings }>()

authRouter.post('/login', async (c) => {
  const { email, password } = await c.req.json<{ email?: string; password?: string }>()

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400)
  }

  if (email !== c.env.ADMIN_EMAIL) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  // Timing-safe comparison to prevent timing attacks
  const enc = new TextEncoder()
  const a = enc.encode(password)
  const b = enc.encode(c.env.ADMIN_PASSWORD)
  if (a.length !== b.length) return c.json({ error: 'Invalid credentials' }, 401)
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  if (diff !== 0) return c.json({ error: 'Invalid credentials' }, 401)

  const token = await signToken({ id: '1', email }, c.env.JWT_SECRET)
  return c.json({ token })
})

