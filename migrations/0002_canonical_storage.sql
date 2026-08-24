PRAGMA foreign_keys = ON;

CREATE TABLE profiles (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2),2)) || '-' || substr('89ab',abs(random())%4+1,1) || substr(hex(randomblob(2),2)) || '-' || hex(randomblob(6)))),
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  local_id TEXT NOT NULL,
  faculty_id INTEGER NOT NULL,
  speciality_id INTEGER NOT NULL,
  setup_completed INTEGER NOT NULL CHECK(setup_completed IN (0,1)),
  payload_json TEXT NOT NULL CHECK(json_valid(payload_json)), revision INTEGER NOT NULL,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT,
  UNIQUE(user_id,local_id)
);
CREATE TABLE preferences (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2),2)) || '-' || substr('89ab',abs(random())%4+1,1) || substr(hex(randomblob(2),2)) || '-' || hex(randomblob(6)))),
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE, local_id TEXT NOT NULL,
  weekdays_json TEXT NOT NULL CHECK(json_valid(weekdays_json)), crossings INTEGER NOT NULL, max_generation_history INTEGER NOT NULL,
  payload_json TEXT NOT NULL CHECK(json_valid(payload_json)), revision INTEGER NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT,
  UNIQUE(user_id,local_id)
);
CREATE TABLE academic_configs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2),2)) || '-' || substr('89ab',abs(random())%4+1,1) || substr(hex(randomblob(2),2)) || '-' || hex(randomblob(6)))),
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE, local_id TEXT NOT NULL,
  hourly_load_id INTEGER, hourly_load_snapshot_json TEXT CHECK(hourly_load_snapshot_json IS NULL OR json_valid(hourly_load_snapshot_json)),
  payload_json TEXT NOT NULL CHECK(json_valid(payload_json)), revision INTEGER NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT,
  UNIQUE(user_id,local_id)
);
CREATE TABLE activities (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2),2)) || '-' || substr('89ab',abs(random())%4+1,1) || substr(hex(randomblob(2),2)) || '-' || hex(randomblob(6)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, local_id TEXT NOT NULL,
  title TEXT NOT NULL, description TEXT, location TEXT, color TEXT NOT NULL, allow_overlap INTEGER NOT NULL, category TEXT NOT NULL, type TEXT NOT NULL,
  payload_json TEXT NOT NULL CHECK(json_valid(payload_json)), revision INTEGER NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT,
  UNIQUE(user_id,local_id)
);
CREATE TABLE activity_sessions (user_id TEXT NOT NULL, activity_id TEXT NOT NULL, position INTEGER NOT NULL, day INTEGER NOT NULL CHECK(day BETWEEN 0 AND 6), start_time TEXT NOT NULL, end_time TEXT NOT NULL, PRIMARY KEY(user_id,activity_id,position), FOREIGN KEY(activity_id) REFERENCES activities(id) ON DELETE CASCADE);
CREATE TABLE user_subjects (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2),2)) || '-' || substr('89ab',abs(random())%4+1,1) || substr(hex(randomblob(2),2)) || '-' || hex(randomblob(6)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, local_id TEXT NOT NULL, subject_id INTEGER NOT NULL, color TEXT,
  subject_snapshot_json TEXT NOT NULL CHECK(json_valid(subject_snapshot_json)), payload_json TEXT NOT NULL CHECK(json_valid(payload_json)), revision INTEGER NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT,
  UNIQUE(user_id,local_id)
);
CREATE TABLE user_subject_schedules (user_id TEXT NOT NULL, user_subject_id TEXT NOT NULL, schedule_id INTEGER NOT NULL, section_id TEXT NOT NULL, schedule_subject_id INTEGER NOT NULL, position INTEGER NOT NULL, PRIMARY KEY(user_id,user_subject_id,schedule_id), FOREIGN KEY(user_subject_id) REFERENCES user_subjects(id) ON DELETE CASCADE);
CREATE TABLE user_subject_sessions (user_id TEXT NOT NULL, user_subject_id TEXT NOT NULL, schedule_id INTEGER NOT NULL, session_id INTEGER NOT NULL, position INTEGER NOT NULL, classroom_json TEXT NOT NULL CHECK(json_valid(classroom_json)), teacher_json TEXT CHECK(teacher_json IS NULL OR json_valid(teacher_json)), type_json TEXT NOT NULL CHECK(json_valid(type_json)), day INTEGER NOT NULL CHECK(day BETWEEN 0 AND 6), start_time TEXT NOT NULL, end_time TEXT NOT NULL, PRIMARY KEY(user_id,user_subject_id,schedule_id,session_id), FOREIGN KEY(user_id,user_subject_id,schedule_id) REFERENCES user_subject_schedules(user_id,user_subject_id,schedule_id) ON DELETE CASCADE);
CREATE TABLE schedules (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2),2)) || '-' || substr('89ab',abs(random())%4+1,1) || substr(hex(randomblob(2),2)) || '-' || hex(randomblob(6)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, local_id TEXT NOT NULL, schedule_subject_key TEXT NOT NULL, crossings INTEGER NOT NULL,
  payload_json TEXT NOT NULL CHECK(json_valid(payload_json)), revision INTEGER NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT,
  UNIQUE(user_id,local_id)
);
CREATE INDEX schedules_by_subject_key ON schedules(user_id,schedule_subject_key) WHERE deleted_at IS NULL;
CREATE TABLE schedule_subjects (user_id TEXT NOT NULL, schedule_id TEXT NOT NULL, subject_id INTEGER NOT NULL, subject_schedule_id INTEGER NOT NULL, position INTEGER NOT NULL, snapshot_json TEXT NOT NULL CHECK(json_valid(snapshot_json)), PRIMARY KEY(user_id,schedule_id,position), FOREIGN KEY(schedule_id) REFERENCES schedules(id) ON DELETE CASCADE);
CREATE TABLE schedule_events (user_id TEXT NOT NULL, schedule_id TEXT NOT NULL, event_id TEXT NOT NULL, title TEXT NOT NULL, category TEXT, type TEXT NOT NULL, day INTEGER NOT NULL CHECK(day BETWEEN 0 AND 6), start_time TEXT NOT NULL, end_time TEXT NOT NULL, description TEXT, location TEXT, color TEXT NOT NULL, PRIMARY KEY(user_id,schedule_id,event_id), FOREIGN KEY(schedule_id) REFERENCES schedules(id) ON DELETE CASCADE);
CREATE TABLE generations (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2),2)) || '-' || substr('89ab',abs(random())%4+1,1) || substr(hex(randomblob(2),2)) || '-' || hex(randomblob(6)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, local_id TEXT NOT NULL, generated_at TEXT NOT NULL, crossings_setting INTEGER NOT NULL, weekdays_json TEXT NOT NULL CHECK(json_valid(weekdays_json)), hourly_load_id INTEGER NOT NULL, result_count INTEGER NOT NULL, occurrences_json TEXT NOT NULL CHECK(json_valid(occurrences_json)),
  payload_json TEXT NOT NULL CHECK(json_valid(payload_json)), revision INTEGER NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT,
  UNIQUE(user_id,local_id)
);
CREATE TABLE generation_schedules (user_id TEXT NOT NULL, generation_id TEXT NOT NULL, schedule_id TEXT NOT NULL, position INTEGER NOT NULL, PRIMARY KEY(user_id,generation_id,schedule_id), FOREIGN KEY(generation_id) REFERENCES generations(id) ON DELETE CASCADE, FOREIGN KEY(schedule_id) REFERENCES schedules(id));
CREATE TABLE favorites (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2),2)) || '-' || substr('89ab',abs(random())%4+1,1) || substr(hex(randomblob(2),2)) || '-' || hex(randomblob(6)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, local_id TEXT NOT NULL, schedule_id TEXT NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  payload_json TEXT NOT NULL CHECK(json_valid(payload_json)), revision INTEGER NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT,
  UNIQUE(user_id,local_id)
);
