# Portfolio — Federico Verdi

Monorepo con tre applicazioni:
- **`api/`** — Cloudflare Worker (Hono + D1)
- **`frontend/`** — Nuxt 3 SSR su Cloudflare Pages
- **`backoffice/`** — Vue 3 + Vite su Cloudflare Pages

## Setup locale

### 1. Installa le dipendenze
```bash
npm run install:all
```

### 2. Configura le variabili d'ambiente

**API** — copia il file di esempio:
```bash
cp api/.dev.vars.example api/.dev.vars
```
Modifica `api/.dev.vars` con le tue credenziali locali.

**Frontend** — già pronto:
```bash
# frontend/.env contiene: NUXT_PUBLIC_API_BASE=http://localhost:4000
```

**Backoffice** — già pronto:
```bash
# backoffice/.env contiene: VITE_API_BASE=http://localhost:4000
```

### 3. Applica le migration SQLite (prima volta)
```bash
npm run setup:local
```

### 4. Avvia tutto
```bash
npm run dev
```

I server gireranno su:
| Servizio   | URL                    |
|------------|------------------------|
| API        | http://localhost:4000  |
| Frontend   | http://localhost:3000  |
| Backoffice | http://localhost:3001  |

Credenziali backoffice di default: `admin@portfolio.dev` / `admin123`

## Deploy

Il deploy avviene automaticamente tramite GitHub Actions al push su `main`.

Richiede i seguenti GitHub Secrets nell'environment `mein`:
- `CF_API_TOKEN` — Cloudflare API token (Workers + Pages + D1)
- `CF_ACCOUNT_ID` — Cloudflare Account ID

I secrets del Worker (JWT, credenziali admin, purge token) vanno impostati manualmente:
```bash
cd api
npx wrangler secret put JWT_SECRET
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put CF_PURGE_TOKEN
```
