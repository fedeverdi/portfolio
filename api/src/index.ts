import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { AppBindings } from './types.js'
import { authRouter } from './routes/auth.js'
import { publicRouter } from './routes/public.js'
import { caseStudiesRouter } from './routes/caseStudies.js'
import { settingsRouter } from './routes/settings.js'
import { searchRouter } from './routes/search.js'
import { textsRouter } from './routes/texts.js'
import { contactsRouter } from './routes/contacts.js'

const app = new Hono<{ Bindings: AppBindings }>()

// Dynamic CORS — reads origins from env so dev and prod both work
app.use('*', async (c, next) => {
  const allowed = [c.env.FRONTEND_ORIGIN, c.env.BACKOFFICE_ORIGIN].filter(Boolean)
  return cors({
    origin: allowed.length > 0 ? allowed : ['*'],
    credentials: true
  })(c, next)
})

app.route('/api/auth', authRouter)
app.route('/api/public', publicRouter)
app.route('/api/case-studies', caseStudiesRouter)
app.route('/api/settings', settingsRouter)
app.route('/api/search', searchRouter)
app.route('/api/texts', textsRouter)
app.route('/api/contacts', contactsRouter)

app.get('/robots.txt', (c) =>
  c.text('User-agent: *\nDisallow: /\n', 200, { 'Content-Type': 'text/plain' })
)

app.get('/api/health', (c) =>
  c.json({ status: 'ok', timestamp: new Date().toISOString() })
)

export default app

