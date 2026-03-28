-- Migration 0001: Initial schema
CREATE TABLE IF NOT EXISTS case_studies (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL DEFAULT '',
  client      TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  tags        TEXT NOT NULL DEFAULT '[]',
  status      TEXT NOT NULL DEFAULT 'draft',
  cover_image TEXT,
  content     TEXT DEFAULT '',
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

-- Seed data (skipped if rows already exist)
INSERT OR IGNORE INTO case_studies VALUES
  ('cs-001', 'Dashboard Analytics Real-Time per E-Commerce', 'Client A',
   'Dashboard interattiva con aggiornamenti in tempo reale via WebSocket, KPI e grafici di conversione. Riduzione del tempo di decisione del team del 40%.',
   '["Nuxt 3","Vue 3","WebSocket","Chart.js"]', 'published', NULL, '',
   '2024-10-01T00:00:00.000Z', '2024-10-01T00:00:00.000Z'),
  ('cs-002', 'Design System & Component Library', 'Client B',
   'Libreria di componenti Vue 3 riutilizzabili, documentata con Storybook. Include 50+ componenti, token di design e guidelines per un team di 8 sviluppatori.',
   '["Vue 3","TypeScript","Storybook","Tailwind CSS"]', 'published', NULL, '',
   '2024-09-15T00:00:00.000Z', '2024-09-15T00:00:00.000Z'),
  ('cs-003', 'Web App Mobile-First per Prenotazioni', 'Client C',
   'PWA con flusso di prenotazione multi-step, gestione stato con Pinia, autenticazione JWT e integrazione con API REST esterne. Lighthouse: 97/100.',
   '["Nuxt 3","Pinia","PWA","REST API"]', 'draft', NULL, '',
   '2024-08-20T00:00:00.000Z', '2024-08-20T00:00:00.000Z'),
  ('cs-004', 'Ottimizzazione Performance & Core Web Vitals', 'Client D',
   'Audit e refactoring completo di un portale ad alto traffico (500k+ visite/mese). LCP da 4.2s a 1.1s, CLS azzerato.',
   '["Performance","Lighthouse","Vite","Image CDN"]', 'archived', NULL, '',
   '2024-06-10T00:00:00.000Z', '2024-06-10T00:00:00.000Z');
