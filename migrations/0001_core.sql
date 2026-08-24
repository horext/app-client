PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  picture TEXT,
  is_university_email INTEGER NOT NULL DEFAULT 0 CHECK(is_university_email IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  csrf_token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX sessions_user_id ON sessions(user_id);
CREATE INDEX sessions_expires_at ON sessions(expires_at);

CREATE TABLE changes (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK(resource_type IN ('profile','preferences','academic-config','activities','subjects','schedules','generations','favorites')),
  record_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  operation TEXT NOT NULL CHECK(operation IN ('upsert','delete')),
  changed_at TEXT NOT NULL
);
CREATE INDEX changes_feed ON changes(user_id,sequence);

CREATE TABLE processed_operations (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  operation_id TEXT NOT NULL,
  response_body TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  PRIMARY KEY(user_id,operation_id)
);
CREATE INDEX idempotency_expiry ON processed_operations(expires_at);
