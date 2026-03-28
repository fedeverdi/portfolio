# Portfolio Personale — Istruzioni per l'Agente AI

## Panoramica del Progetto

Questo è un **monorepo** composto da tre applicazioni indipendenti:

| Cartella | Tipo | Porta | Scopo |
|---|---|---|---|
| `frontend/` | Nuxt 3 | 3000 | Portfolio pubblico (landing page) |
| `api/` | Express.js + TypeScript | 4000 | REST API condivisa |
| `backoffice/` | Vite + Vue 3 + Pinia | 3001 | Admin panel per gestire i case studies |

> **REGOLA FONDAMENTALE sul design:** Ogni applicazione ha i propri file HTML di riferimento da cui copiare **fedelmente** stile, colori, layout e componenti. Non inventare nulla sul fronte visivo.
> - **Frontend** → `design.html` nella root
> - **Backoffice** → `backoffice/design/*.html` (login, dashboard, lista, dettaglio)

---

## Come avviare il progetto

### Prima installazione
```bash
# Dalla root — installa le dipendenze di tutte e tre le app
npm run install:all
npm install   # installa concurrently nella root
```

### Sviluppo (tutto in parallelo)
```bash
# Dalla root — avvia API + Frontend + Backoffice contemporaneamente
npm run dev
```

Output colorato con prefissi:
- `[API]` → Express su http://localhost:4000 (cyan)
- `[FRONT]` → Nuxt 3 su http://localhost:3000 (magenta)
- `[BO]` → Backoffice su http://localhost:3001 (yellow)

### Script disponibili dalla root

| Comando | Descrizione |
|---|---|
| `npm run dev` | Avvia tutti e tre in parallelo con `concurrently` |
| `npm run dev:api` | Solo API |
| `npm run dev:frontend` | Solo frontend |
| `npm run dev:backoffice` | Solo backoffice |
| `npm run build` | Build di produzione di tutti e tre |
| `npm run install:all` | Installa le dipendenze di tutte le app |

### Avvio singolo (alternativa)
```bash
cd api && npm run dev
cd frontend && npm run dev
cd backoffice && npm run dev
```

---

## 1. FRONTEND — `frontend/`

### Stack
- **Framework:** Nuxt 3 (Vue 3 Composition API, `<script setup>`)
- **Styling:** Tailwind CSS v3 con token colori MD3 (dark mode fissa)
- **Font:** Google Fonts — `Inter` (body) + `Space Grotesk` (headline)
- **Icone:** Material Symbols Outlined

### Design System (da `design.html`)
Il sito è **sempre dark mode** (`class="dark"` su `<html>`). Non aggiungere toggle.

#### Colori Tailwind (Material Design 3 tokens)
```ts
colors: {
  "surface-dim": "#161311", "on-surface": "#e9e1dd",
  "surface-container-lowest": "#100e0c", "background": "#161311",
  "on-primary": "#233143", "outline": "#8e9197",
  "surface-variant": "#383432", "surface-container": "#221f1d",
  "primary-container": "#657488", "on-primary-container": "#f9f9ff",
  "secondary-container": "#4b4641", "surface": "#161311",
  "surface-container-high": "#2d2927", "surface-container-low": "#1e1b19",
  "surface-container-highest": "#383432", "primary": "#b9c8de",
  "primary-fixed-dim": "#b9c8de", "primary-fixed": "#d4e4fa",
  "on-surface-variant": "#c4c6cd", "outline-variant": "#44474c",
  "error": "#ffb4ab", "tertiary": "#e3c199"
  // ... vedi design.html per lista completa
}
```

#### Tipografia
```ts
fontFamily: { "headline": ["Space Grotesk"], "body": ["Inter"], "label": ["Inter"] }
```

#### Border Radius — sempre 4px (quasi squadrato)

#### Blueprint Grid (hero section)
```css
background-image: radial-gradient(circle, #2d2927 1px, transparent 1px);
background-size: 40px 40px;
```

### Struttura file
```
frontend/
├── app.vue
├── nuxt.config.ts        — modules, fonts, pathPrefix: false
├── tailwind.config.ts    — token MD3 dark
├── assets/css/main.css
├── components/
│   ├── layout/
│   │   ├── TheNavbar.vue   — fixed, active section tracking, mobile menu
│   │   └── TheFooter.vue
│   └── sections/
│       ├── HeroSection.vue
│       ├── SkillsSection.vue
│       ├── PortfolioSection.vue
│       └── ContactSection.vue
└── pages/index.vue
```

### Sezioni
1. **Navbar** — fixed, blur, active link con `border-b-2`
2. **Hero** — `min-h-[921px]`, blueprint-grid, H1 `text-8xl`, 2 CTA
3. **Skills** — 3 skill card (icon + lista skill con livello PRO/ADV/MID)
4. **Portfolio** — 4 case study card, immagine grayscale → colore su hover. I dati vengono recuperati **live dall'API** via `useFetch('/api/public/case-studies')` — mostra solo i `published`. In caso di loading mostra stato di attesa, in caso di lista vuota un messaggio appropriato.
5. **Contact** — form con stile underline-only, feedback di invio
6. **Footer** — `bg-stone-950`, link social

---

## 2. API — `api/`

### Stack
- **Framework:** Express.js + TypeScript
- **Auth:** JWT (`jsonwebtoken`) + bcrypt
- **Dev server:** `tsx watch`
- **Porta:** 4000

### Struttura file
```
api/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              — setup express, cors, routes
    ├── middleware/
    │   └── auth.ts           — requireAuth middleware + signToken
    └── routes/
        ├── auth.ts           — POST /api/auth/login
        ├── public.ts         — GET /api/public/case-studies (no auth, solo published)
        └── caseStudies.ts    — CRUD /api/case-studies (protetto JWT) + store condiviso
```

### Endpoints

| Metodo | Path | Auth | Usato da | Descrizione |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | No | Backoffice | Login → restituisce JWT |
| `GET` | `/api/health` | No | — | Health check |
| `GET` | `/api/public/case-studies` | No | **Frontend** | Lista case studies pubblicati |
| `GET` | `/api/public/case-studies/:id` | No | **Frontend** | Singolo case study pubblicato |
| `GET` | `/api/case-studies` | Bearer JWT | Backoffice | Lista tutti (tutti gli status) |
| `GET` | `/api/case-studies/:id` | Bearer JWT | Backoffice | Singolo case study |
| `POST` | `/api/case-studies` | Bearer JWT | Backoffice | Crea nuovo |
| `PUT` | `/api/case-studies/:id` | Bearer JWT | Backoffice | Aggiorna |
| `DELETE` | `/api/case-studies/:id` | Bearer JWT | Backoffice | Elimina |

> **Separazione public/protected:** Il frontend usa esclusivamente `/api/public/*` (nessun JWT). Questi endpoint restituiscono **solo** i case study con `status: published`. Il backoffice usa `/api/case-studies/*` protetto da JWT e vede tutti gli status.

### Modello CaseStudy
```ts
interface CaseStudy {
  id: string
  title: string
  client: string
  description: string
  tags: string[]
  status: 'published' | 'draft' | 'archived'
  coverImage?: string
  content?: string
  createdAt: string
  updatedAt: string
}
```

### Credenziali di default (dev)
- Email: `admin@portfolio.dev`
- Password: `admin123`
- Cambiarle via env vars: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`

> **Nota sicurezza:** Lo store dei dati è in-memory. In produzione sostituire con un database reale (es. PostgreSQL + Prisma).

---

## 3. BACKOFFICE — `backoffice/`

### Stack
- **Framework:** Vite + Vue 3 (Composition API, `<script setup>`)
- **Routing:** Vue Router 4 (file: `src/router/index.ts`)
- **State:** Pinia (stores: `auth`, `caseStudies`)
- **Styling:** Tailwind CSS v3 con token colori light mode
- **Font:** Inter
- **Icone:** Material Symbols Outlined
- **Porta:** 3001
- **Proxy:** `/api/*` → `http://localhost:4000`

### Design System (da `backoffice/design/*.html`)
Il backoffice è in **light mode**. Non usare dark mode.

#### Colori Tailwind (light mode)
```ts
colors: {
  "background": "#f7f9fb",
  "surface": "#f7f9fb",
  "surface-container-lowest": "#ffffff",
  "surface-container-low": "#f0f4f7",
  "surface-container": "#e8eff3",
  "surface-container-high": "#e1e9ee",
  "surface-container-highest": "#d9e4ea",
  "on-surface": "#2a3439",
  "on-surface-variant": "#566166",
  "primary": "#565e74",       // bottoni, link attivi, accenti
  "primary-dim": "#4a5268",   // hover primario
  "on-primary": "#f7f7ff",
  "secondary": "#526075",
  "outline": "#717c82",
  "outline-variant": "#a9b4b9",
  "error": "#9f403d",
  "surface-variant": "#d9e4ea"
}
```

#### Border Radius
```ts
borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" }
```

### Struttura file
```
backoffice/
├── index.html
├── package.json
├── vite.config.ts          — proxy /api → :4000, porta 3001
├── tailwind.config.ts
├── tsconfig.json
└── src/
    ├── main.ts
    ├── App.vue             — solo <RouterView />
    ├── assets/main.css
    ├── router/
    │   └── index.ts        — route guard (requiresAuth)
    ├── stores/
    │   ├── auth.ts         — login, logout, authHeaders()
    │   └── caseStudies.ts  — fetchAll, fetchOne, create, update, remove
    ├── layouts/
    │   └── AdminLayout.vue — sidebar + topbar + <RouterView>
    └── views/
        ├── LoginView.vue
        ├── DashboardView.vue
        ├── CaseStudiesView.vue
        └── CaseStudyDetailView.vue
```

### Route del backoffice
| Path | View | Descrizione |
|---|---|---|
| `/login` | `LoginView` | Login form (pubblico) |
| `/` | `DashboardView` | System overview + stats |
| `/case-studies` | `CaseStudiesView` | Lista con search, filtri, delete |
| `/case-studies/new` | `CaseStudyDetailView` | Crea nuovo case study |
| `/case-studies/:id` | `CaseStudyDetailView` | Modifica case study |

### Layout Admin
- **Sidebar** (w-64, fixed): logo, nav links (active con `border-r-2 border-primary`), user profile + logout
- **Topbar** (h-16, fixed, blur): search bar, notifiche, help

### Pagine di riferimento (design files)
- `login_design.html` → `LoginView.vue` (card centrata, sfondo slate-50)
- `dashboard_design.html` → `DashboardView.vue` (stat cards 4-col + tabella eventi)
- `lista_design.html` → `CaseStudiesView.vue` (bento stats + tabella con paginazione)
- `dettaglio_design.html` → `CaseStudyDetailView.vue` (form bento 8+4 col, sidebar status/tags/cover)

---

## Convenzioni generali

1. **`<script setup lang="ts">`** in tutti i componenti Vue
2. **Nessun `any`** — tipizzare sempre
3. **Fetch diretto** nelle store Pinia tramite `authHeaders()` per i token JWT
4. **Confirmazione** prima di operazioni distruttive (delete)
5. **Feedback visivo** su loading/error/success in tutti i form
6. **Colori mai hardcoded** — usare sempre i token Tailwind definiti

## Panoramica del Progetto

Questo progetto è il mio **sito personale / portfolio**, realizzato con **Nuxt 3**. L'obiettivo è presentare il mio curriculum, le mie competenze tecniche e i miei case studies in modo professionale.

> **REGOLA FONDAMENTALE:** Il design visivo deve essere copiato fedelmente dal file `design.html` presente nella root del workspace. Colori, tipografia, spaziature, layout, stile generale — tutto deve rispecchiare esattamente quel file. Non inventare nulla di nuovo sul fronte visivo.

---

## Stack Tecnologico

- **Framework:** Nuxt 3 (con Vue 3 Composition API, `<script setup>`)
- **Styling:** Tailwind CSS v3 (stessa configurazione del `design.html`)
- **Font:** Google Fonts — `Inter` (body/label) + `Space Grotesk` (headline/titoli)
- **Icone:** Material Symbols Outlined (via Google Fonts CDN)
- **Linguaggio:** TypeScript

---

## Design System — Riferimento `design.html`

### Dark Mode
Il sito è **sempre in dark mode** (`class="dark"` sull'`<html>`). Non implementare il toggle light/dark.

### Colori Tailwind personalizzati (Material Design 3 tokens)
Questi colori devono essere configurati in `tailwind.config.ts`:

```ts
colors: {
  "surface-dim": "#161311",
  "on-surface": "#e9e1dd",
  "surface-container-lowest": "#100e0c",
  "on-error": "#690005",
  "surface-bright": "#3c3836",
  "secondary": "#cec5bf",
  "error-container": "#93000a",
  "on-tertiary": "#412c10",
  "primary-fixed-dim": "#b9c8de",
  "background": "#161311",
  "on-primary": "#233143",
  "outline": "#8e9197",
  "surface-variant": "#383432",
  "surface-container": "#221f1d",
  "on-tertiary-fixed": "#2a1801",
  "inverse-primary": "#516072",
  "on-secondary-fixed-variant": "#4b4641",
  "secondary-fixed": "#eae1da",
  "error": "#ffb4ab",
  "on-background": "#e9e1dd",
  "on-surface-variant": "#c4c6cd",
  "tertiary-fixed": "#ffddb6",
  "on-error-container": "#ffdad6",
  "on-primary-container": "#f9f9ff",
  "secondary-container": "#4b4641",
  "on-secondary-container": "#bcb3ae",
  "surface": "#161311",
  "tertiary-container": "#8a6e4c",
  "tertiary-fixed-dim": "#e3c199",
  "secondary-fixed-dim": "#cec5bf",
  "surface-container-high": "#2d2927",
  "inverse-on-surface": "#33302d",
  "on-tertiary-container": "#fff9f5",
  "primary-container": "#657488",
  "on-primary-fixed": "#0d1c2d",
  "on-tertiary-fixed-variant": "#5a4224",
  "surface-container-low": "#1e1b19",
  "on-secondary": "#342f2b",
  "tertiary": "#e3c199",
  "primary-fixed": "#d4e4fa",
  "surface-container-highest": "#383432",
  "on-secondary-fixed": "#1f1b17",
  "primary": "#b9c8de",
  "surface-tint": "#b9c8de",
  "inverse-surface": "#e9e1dd",
  "on-primary-fixed-variant": "#39485a",
  "outline-variant": "#44474c"
}
```

### Tipografia
```ts
fontFamily: {
  "headline": ["Space Grotesk"],
  "body": ["Inter"],
  "label": ["Inter"]
}
```

### Border Radius
Tutti i bordi arrotondati usano `4px` (quasi squadrato):
```ts
borderRadius: { "DEFAULT": "4px", "sm": "4px", "lg": "4px", "xl": "4px", "full": "9999px" }
```

### Blueprint Grid
L'hero section ha uno sfondo con pattern a griglia di punti:
```css
.blueprint-grid {
  background-image: radial-gradient(circle, #2d2927 1px, transparent 1px);
  background-size: 40px 40px;
}
```

---

## Struttura del Progetto Nuxt 3

```
myportfolio/
├── app.vue
├── nuxt.config.ts
├── tailwind.config.ts
├── assets/
│   └── css/
│       └── main.css
├── components/
│   ├── layout/
│   │   ├── TheNavbar.vue
│   │   └── TheFooter.vue
│   ├── sections/
│   │   ├── HeroSection.vue
│   │   ├── SkillsSection.vue
│   │   ├── PortfolioSection.vue
│   │   └── ContactSection.vue
│   └── ui/
│       ├── SkillCard.vue
│       └── ProjectCard.vue
├── pages/
│   └── index.vue
└── public/
    └── (assets statici, es. CV PDF)
```

---

## Sezioni della Landing Page

### 1. Navbar (`TheNavbar.vue`)
- Fixed, `z-50`, `backdrop-blur-md`, `bg-stone-950/80`
- Logo a sinistra: testo bold, `tracking-tighter`
- Link di navigazione al centro (nascosti su mobile): Profile, Skills, Portfolio, Contact
- Link attivo: `border-b-2 border-slate-400`
- CTA button a destra: "Get in Touch" → scrolling verso `#contact`
- Hamburger menu per mobile

### 2. Hero Section (`HeroSection.vue`) — id: `profile`
- `min-h-[921px]`, layout a 12 colonne, `blueprint-grid` come sfondo
- Badge superiore: testo piccolo `tracking-[0.2em]` uppercase, colore `text-primary`
- `<h1>` enorme (fino a `text-8xl`), bold, `tracking-tighter`, `leading-[0.9]`
- Paragrafo descrittivo, `font-light`
- Due CTA: "Explore Projects" (filled, con freccia animata) e "Download CV" (ghost/outline)
- Decorazione tecnica in basso a destra (testo mono con metadati tipo `REGION:`, `STACK:`, `UPTIME:`) — adattala al tuo profilo

### 3. Skills Section (`SkillsSection.vue`) — id: `skills`
- `bg-surface-container-lowest`, bordo superiore `border-stone-900`
- Griglia a 12 colonne: testo intro a sinistra (4 col), skill cards a destra (8 col)
- Titolo: "TECHNICAL SUMMARY" (o equivalente al tuo settore)
- Ogni `SkillCard.vue` ha: icona Material Symbol, titolo categoria (`text-[10px] uppercase tracking-widest`), lista di skill con livello (`PRO` / `ADV` / `MID`)
- **Adatta le skill al tuo CV reale**

### 4. Portfolio / Case Studies (`PortfolioSection.vue`) — id: `portfolio`
- Header con titolo grande (`text-5xl`, `tracking-tighter`) + sottotitolo "Case Studies"
- Griglia 2 colonne su desktop (`lg:grid-cols-2`)
- Ogni `ProjectCard.vue` ha:
  - Immagine cover con effetto grayscale → colore su hover + zoom (`group-hover:scale-105`)
  - Label con codice progetto stile tecnico (`SPEC_NO: XXXX`)
  - Titolo del progetto
  - Descrizione breve dei risultati/impatto
  - Tag tecnologie usate (`px-3 py-1 bg-surface-container-high font-mono text-[10px] uppercase`)
- **Sostituisci i progetti placeholder con i tuoi case studies reali**

### 5. Contact Section (`ContactSection.vue`) — id: `contact`
- `bg-surface-container-low`, `py-32`
- Griglia 12 colonne: info a sinistra (6 col), form a destra (6 col)
- A sinistra: titolo grande, sottotitolo, email link con `underline-offset-8`, link LinkedIn + GitHub
- A destra: form con campi nome, email, messaggio — stile underline-only (no bordi laterali), label uppercase tracking
- Submit button full-width

### 6. Footer (`TheFooter.vue`)
- `bg-stone-950`, `border-t border-stone-900`
- Logo + copyright a sinistra
- Link (LinkedIn, GitHub, ecc.) a destra

---

## Contenuto da Personalizzare

Questi elementi del `design.html` sono **placeholder** da sostituire con il tuo contenuto reale:

| Elemento | Placeholder nel design | Da sostituire con |
|---|---|---|
| Nome/Brand | `ARCH/SOLUTIONS` | Il tuo nome o brand |
| Titolo professionale | `Senior AWS Solutions Architect` | Il tuo ruolo |
| Tagline Hero | `ARCHITECTING SCALABLE CLOUD SOLUTIONS ON AWS.` | La tua headline |
| Descrizione Hero | testo sul cloud architect | La tua bio sintetica |
| Metadati tecnici | `REGION: US-EAST-1`, ecc. | Info rilevanti per te |
| Skill categories | Compute, Storage, Networking | Le tue aree di competenza |
| Skill items | Lambda, RDS, CloudFront, ecc. | Le tue tecnologie |
| Progetti (x2) | Multi-Region DR, Serverless API | I tuoi case studies reali |
| Email | `architect@archsolutions.com` | La tua email |
| Copyright | `© 2024` | `© 2025` + il tuo nome |

---

## Note Implementative

### Proxy Nitro (nuxt.config.ts)
Il frontend usa un proxy Nitro per girare le chiamate API senza hardcodare l'URL:
```ts
nitro: {
  routeRules: {
    '/api/**': { proxy: 'http://localhost:4000/api/**' }
  }
}
```
In questo modo `useFetch('/api/public/case-studies')` funziona sia in dev che in SSR senza CORS.

### `useFetch` nei componenti
Usare sempre `useFetch` (o `useAsyncData`) di Nuxt 3 per le chiamate API — mai `fetch` diretto — così il dato viene serializzato correttamente per SSR/hydration.

```ts
// PortfolioSection.vue
const { data, status } = await useFetch<CaseStudy[]>('/api/public/case-studies')
```

### `assets/css/main.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body { font-family: 'Inter', sans-serif; }
h1, h2, h3 { font-family: 'Space Grotesk', sans-serif; }

.blueprint-grid {
  background-image: radial-gradient(circle, #2d2927 1px, transparent 1px);
  background-size: 40px 40px;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

### Navigazione smooth scroll
Usa l'attributo `href="#section-id"` per i link navbar. Aggiungi in `main.css`:
```css
html { scroll-behavior: smooth; }
```

### Responsive
- Mobile-first come nel design originale
- Navbar: hamburger su mobile, link nascosti (`hidden md:flex`)
- Hero: testo ridotto su mobile (`text-5xl md:text-7xl lg:text-8xl`)
- Portfolio grid: 1 col su mobile, 2 col su `lg`
- Contact form: sotto il blocco info su mobile, affiancato su `lg`

---

## Vincoli e Regole

1. **Non alterare i colori** — usa esclusivamente i token definiti sopra
2. **Non cambiare i font** — Inter e Space Grotesk come da design
3. **Non aggiungere sezioni non presenti nel design** senza istruzione esplicita
4. **Il border-radius è sempre 4px** — nessun `rounded-full` eccetto per pillole/avatar
5. **Tutte le label e categorie sono uppercase** con `tracking-widest`
6. **Le immagini dei progetti** usano `grayscale` di default, a colori su hover
7. **Il sito è single-page** — `pages/index.vue` unica route
8. **Usare `<script setup lang="ts">`** in tutti i componenti Vue
