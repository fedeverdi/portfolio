-- Migration 0003: Content texts
CREATE TABLE IF NOT EXISTS texts (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO texts VALUES
  ('hero.tagline',           'Senior Web Developer & Solutions Architect',   'Riga sopra al titolo nella hero',                        datetime('now')),
  ('hero.title',             'FEDERICO VERDI: BUILDING FAST, SCALABLE WEB EXPERIENCES.', 'Titolo principale della hero',             datetime('now')),
  ('hero.bio',               'Un developer con focus su UI di qualità, performance e architetture frontend moderne. Trasformo idee complesse in prodotti digitali precisi e funzionali.', 'Biografia breve nella hero', datetime('now')),
  ('hero.cta_primary',       'Esplora i Progetti',                           'Testo bottone primario hero',                            datetime('now')),
  ('hero.cta_secondary',     'Download CV',                                  'Testo bottone secondario hero',                          datetime('now')),
  ('hero.meta_location',     'ITALY',                                        'Metadato location in basso a destra',                    datetime('now')),
  ('hero.meta_stack',        'VUE_NUXT_TS',                                  'Metadato stack in basso a destra',                       datetime('now')),
  ('hero.meta_status',       'AVAILABLE',                                    'Metadato status in basso a destra',                      datetime('now')),
  ('skills.title',           'TECHNICAL SUMMARY',                            'Titolo sezione skills',                                  datetime('now')),
  ('skills.description',     'Specializzato nello sviluppo di interfacce moderne, performanti e accessibili. Il mio approccio privilegia codice componibile, tipizzazione rigorosa e un''esperienza utente curata nei minimi dettagli.', 'Descrizione sezione skills', datetime('now')),
  ('contact.title',          'INIZIAMO A COLLABORARE',                       'Titolo sezione contatti',                                datetime('now')),
  ('contact.description',    'Hai un progetto in mente? Parliamone. Sono disponibile per collaborazioni freelance e opportunità full-time.', 'Descrizione sezione contatti', datetime('now')),
  ('contact.email',          'federicoverdi@me.com',                         'Email di contatto visibile nel frontend',                datetime('now')),
  ('contact.linkedin_url',   'https://linkedin.com/in/federicoverdi',        'URL LinkedIn',                                           datetime('now')),
  ('contact.github_url',     'https://github.com/federicoverdi',             'URL GitHub',                                             datetime('now')),
  ('footer.tagline',         '© 2025 Federico Verdi. Built with Nuxt 3.',    'Testo copyright nel footer',                             datetime('now')),
  ('footer.logo',            'FV/DEV',                                       'Logo testuale nel footer e navbar',                      datetime('now'));
