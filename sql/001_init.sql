CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_sso_identities (
  provider TEXT NOT NULL,
  provider_subject TEXT NOT NULL,
  user_email TEXT NOT NULL REFERENCES users (email) ON DELETE CASCADE,
  provider_email TEXT,
  profile_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  PRIMARY KEY (provider, provider_subject)
);

CREATE INDEX IF NOT EXISTS idx_user_sso_identities_user_email
  ON user_sso_identities (user_email);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_sso_identities_provider_user_email
  ON user_sso_identities (provider, user_email);
