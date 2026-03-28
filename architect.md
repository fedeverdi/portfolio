# architect.md — Deploy Architecture

## Infrastruttura Cloudflare

```
┌─────────────────────────────────────────────────────────────────┐
│                        Cloudflare Network                        │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │  CF Pages        │  │  CF Pages        │  │  CF Worker    │  │
│  │  myportfolio-    │  │  myportfolio-    │  │  myportfolio- │  │
│  │  frontend        │  │  backoffice      │  │  api          │  │
│  │                  │  │                  │  │               │  │
│  │  Nuxt 3 (static) │  │  Vite + Vue 3    │  │  Hono         │  │
│  │  :3000 (dev)     │  │  :3001 (dev)     │  │  :4000 (dev)  │  │
│  └────────┬─────────┘  └────────┬─────────┘  └───────┬───────┘  │
│           │   GET /api/public/* │   /api/* + JWT      │          │
│           └────────────────────→┤                     │          │
│                                 └────────────────────→│          │
│                                                        │          │
│                                               ┌────────┴──────┐  │
│                                               │  Cloudflare   │  │
│                                               │     D1        │  │
│                                               │  (SQLite)     │  │
│                                               └───────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

| Risorsa | Tipo | URL prod | URL dev |
|---|---|---|---|
| Frontend | CF Pages (static) | `https://myportfolio-frontend.pages.dev` | `http://localhost:3000` |
| Backoffice | CF Pages (static) | `https://myportfolio-backoffice.pages.dev` | `http://localhost:3001` |
| API | CF Worker | `https://myportfolio-api.SUBDOMAIN.workers.dev` | `http://localhost:4000` |
| Database | CF D1 (SQLite) | `myportfolio-db` | locale via wrangler |

---

## Setup iniziale (una tantum)

### 1. Prerequisiti
```bash
npm install -g wrangler
wrangler login          # autenticazione browser Cloudflare
```

### 2. Creare il database D1
```bash
cd api
wrangler d1 create myportfolio-db
```
Copia l'`database_id` restituito e incollalo in `api/wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "myportfolio-db"
database_id = "INCOLLA_QUI"
```

### 3. Applicare le migrazioni in locale (dev)
```bash
cd api
npm run db:migrate:local
```

### 4. Configurare i Workers Secrets (produzione)
```bash
cd api

# Segreti cifrati — non vanno in wrangler.toml
wrangler secret put JWT_SECRET          # stringa random sicura
wrangler secret put ADMIN_EMAIL         # es. admin@tuodominio.com
wrangler secret put ADMIN_PASSWORD      # password sicura

# Variabili di produzione per CORS
# Modifica wrangler.toml [vars] con gli URL Pages definitivi PRIMA di deployare:
# FRONTEND_ORIGIN = "https://myportfolio-frontend.pages.dev"
# BACKOFFICE_ORIGIN = "https://myportfolio-backoffice.pages.dev"
```

### 5. Creare i progetti Pages
```bash
# Questi comandi creano i progetti su Cloudflare (solo la prima volta)
cd frontend
npx wrangler pages project create myportfolio-frontend

cd ../backoffice
npx wrangler pages project create myportfolio-backoffice
```

### 6. Configurare GitHub Actions secrets & vars

Nel repository GitHub → **Settings → Secrets and variables → Actions**:

**Secrets** (cifrati):
| Nome | Valore |
|---|---|
| `CF_API_TOKEN` | Token Cloudflare con permessi Worker + Pages + D1 |
| `CF_ACCOUNT_ID` | Il tuo Account ID Cloudflare |

**Variables** (visibili):
| Nome | Valore |
|---|---|
| `API_WORKER_URL` | `https://myportfolio-api.SUBDOMAIN.workers.dev` |

### 7. Come creare il CF_API_TOKEN
1. Cloudflare Dashboard → My Profile → **API Tokens**
2. "Create Token" → "Edit Cloudflare Workers" template
3. Aggiungere permesso: `Cloudflare Pages: Edit`
4. Aggiungere permesso: `D1: Edit`

---

## Sviluppo locale

```bash
# Prima installazione completa
npm run install:all && npm install

# Applicare le migration D1 locali (solo la prima volta)
cd api && npm run db:migrate:local && cd ..

# Dev server (tutti e tre in parallelo)
npm run dev
```

### File di ambiente
`api/.dev.vars` (gitignored — wrangler lo carica automaticamente in dev):
```
JWT_SECRET=dev-secret-change-in-production
ADMIN_EMAIL=admin@portfolio.dev
ADMIN_PASSWORD=admin123
```

`backoffice/.env.local` (opzionale — vuoto in dev, il proxy Vite gestisce tutto):
```
VITE_API_BASE=
```

---

## Deploy manuale

```bash
# 1. API Worker
cd api
wrangler d1 migrations apply myportfolio-db   # applica migrazioni prod
wrangler deploy

# 2. Frontend
cd ../frontend
NUXT_PUBLIC_API_BASE=https://myportfolio-api.SUBDOMAIN.workers.dev npm run generate
npx wrangler pages deploy .output/public --project-name=myportfolio-frontend

# 3. Backoffice
cd ../backoffice
VITE_API_BASE=https://myportfolio-api.SUBDOMAIN.workers.dev npm run build
npx wrangler pages deploy dist --project-name=myportfolio-backoffice
```

---

## Deploy automatico (GitHub Actions)

Ogni push su `main` esegue `.github/workflows/deploy.yml`:

```
push → main
    │
    ├── deploy-api        (wrangler deploy)
    │     └── D1 migrations apply prima del deploy
    │
    ├── deploy-frontend   (nuxt generate → wrangler pages deploy)
    │     └── dipende da deploy-api (needs: deploy-api)
    │
    └── deploy-backoffice (vite build → wrangler pages deploy)
          └── dipende da deploy-api (needs: deploy-api)
```

Frontend e backoffice vengono deployati in parallelo dopo che l'API è pronta.

---

## Stack tecnico per ambiente

### API — Cloudflare Worker
| | Dev | Prod |
|---|---|---|
| Runtime | `wrangler dev --port 4000` | CF Worker (V8 isolate) |
| Framework | Hono v4 | Hono v4 |
| Database | D1 locale (SQLite file) | D1 managed (Cloudflare) |
| Auth | `.dev.vars` | Workers Secrets (cifrati) |
| CORS origins | `localhost:3000`, `localhost:3001` | URL Pages produzione |

### Frontend — Cloudflare Pages
| | Dev | Prod |
|---|---|---|
| Runtime | `nuxt dev` (Node.js) | CF Pages (CDN globale) |
| Build | — | `nuxt generate` (static HTML) |
| API calls | Proxy Nitro → `localhost:4000` | `useFetch` → Worker URL |
| Env var | `apiBase = ''` | `NUXT_PUBLIC_API_BASE` |

### Backoffice — Cloudflare Pages
| | Dev | Prod |
|---|---|---|
| Runtime | `vite dev --port 3001` (Node.js) | CF Pages (CDN globale) |
| Build | — | `vite build` |
| API calls | Proxy Vite → `localhost:4000` | `fetch` → `VITE_API_BASE` |
| Env var | `VITE_API_BASE = ''` | `VITE_API_BASE` |

---

## Schema D1 (SQLite)

```sql
CREATE TABLE IF NOT EXISTS case_studies (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL DEFAULT '',
  client      TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  tags        TEXT NOT NULL DEFAULT '[]',   -- JSON array
  status      TEXT NOT NULL DEFAULT 'draft', -- 'published' | 'draft' | 'archived'
  cover_image TEXT,
  content     TEXT DEFAULT '',
  created_at  TEXT NOT NULL,               -- ISO 8601
  updated_at  TEXT NOT NULL
);
```

Migrations in `api/migrations/`. Applicare con:
```bash
wrangler d1 migrations apply myportfolio-db [--local]
```

---

## Aggiungere nuove migrazioni

```bash
# Creare il file di migrazione
echo "ALTER TABLE case_studies ADD COLUMN views INTEGER DEFAULT 0;" \
  > api/migrations/0002_add_views.sql

# Applicare localmente
cd api && npm run db:migrate:local

# La GitHub Action applicherà automaticamente in produzione al prossimo push
```

---

## Monitoraggio e rollback

- **Worker logs:** Dashboard Cloudflare → Workers → myportfolio-api → Logs
- **Pages deployments:** Dashboard → Pages → progetto → Deployments (rollback con un click)
- **D1 queries:** Dashboard → D1 → myportfolio-db → Console (SQL diretto)
