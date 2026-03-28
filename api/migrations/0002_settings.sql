-- Migration 0002: Portfolio settings
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

INSERT OR IGNORE INTO settings VALUES
  ('owner_name',    'Federico Verdi'),
  ('bio',           'Senior Web Developer & Solutions Architect'),
  ('contact_email', 'federicoverdi@me.com'),
  ('github_url',    ''),
  ('linkedin_url',  ''),
  ('site_status',   'under_construction');
