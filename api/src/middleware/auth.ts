import { verify, sign } from 'hono/jwt'
import type { MiddlewareHandler } from 'hono'
import type { AppBindings } from '../types.js'

export const requireAuth: MiddlewareHandler<{ Bindings: AppBindings }> = async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.slice(7)
  try {
    await verify(token, c.env.JWT_SECRET, 'HS256')
    await next()
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e)
    return c.json({ error: 'Invalid or expired token', detail, hasSecret: !!c.env.JWT_SECRET }, 401)
  }
}

export async function signToken(
  payload: Record<string, unknown>,
  secret: string
): Promise<string> {
  return sign(
    { ...payload, exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60 },
    secret,
    'HS256'
  )
}

