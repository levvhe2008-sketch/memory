-- Supabase/Postgres migration: create basic tables
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
BEGIN;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TYPE album_privacy AS ENUM ('private','link','public');

CREATE TABLE albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  privacy album_privacy DEFAULT 'private',
  password_hash text,
  cover_media_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES albums(id) ON DELETE CASCADE,
  uploader_id uuid REFERENCES users(id) ON DELETE SET NULL,
  filename text,
  mime_type text,
  size bigint,
  width int,
  height int,
  storage_path text NOT NULL,
  caption text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE albums ADD COLUMN IF NOT EXISTS cover_media_id uuid REFERENCES media(id) ON DELETE SET NULL;

CREATE TABLE album_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES albums(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text CHECK (role IN ('editor','viewer')) DEFAULT 'viewer',
  invited_email text,
  status text CHECK (status IN ('accepted','pending','rejected')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid REFERENCES media(id) ON DELETE CASCADE,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES albums(id) ON DELETE CASCADE,
  share_token text UNIQUE NOT NULL,
  expires_at timestamptz,
  password_hash text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text,
  target_id uuid,
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_media_album_id ON media(album_id);
CREATE INDEX idx_albums_owner_id ON albums(owner_id);
CREATE INDEX idx_shares_token ON shares(share_token);

COMMIT;
