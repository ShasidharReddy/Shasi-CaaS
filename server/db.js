const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'users.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const countUsersStmt = db.prepare('SELECT COUNT(*) AS count FROM users');
const insertUserStmt = db.prepare(`
  INSERT INTO users (username, email, password_hash, role)
  VALUES (@username, @email, @password_hash, @role)
`);
const findUserByEmailStmt = db.prepare(`
  SELECT id, username, email, password_hash, role, created_at
  FROM users
  WHERE email = ?
`);
const findUserByIdStmt = db.prepare(`
  SELECT id, username, email, role, created_at
  FROM users
  WHERE id = ?
`);

function getUserCount() {
  return countUsersStmt.get().count;
}

function createUser({ username, email, password_hash }) {
  const role = getUserCount() === 0 ? 'admin' : 'user';
  const result = insertUserStmt.run({ username, email, password_hash, role });
  return findUserById(result.lastInsertRowid);
}

function findUserByEmail(email) {
  return findUserByEmailStmt.get(String(email).trim().toLowerCase());
}

function findUserById(id) {
  return findUserByIdStmt.get(id);
}

module.exports = {
  db,
  createUser,
  findUserByEmail,
  findUserById,
  getUserCount
};
