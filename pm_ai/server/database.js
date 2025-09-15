const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseManager {
  constructor() {
    const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('📁 Connected to SQLite database');
        this.initTables();
      }
    });
  }

  initTables() {
    // Users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Agent executions table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS agent_executions (
        id TEXT PRIMARY KEY,
        agent_type TEXT NOT NULL,
        task TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        progress INTEGER DEFAULT 0,
        result TEXT,
        project_id INTEGER,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Project context table for agent data
    this.db.run(`
      CREATE TABLE IF NOT EXISTS project_context (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        context_type TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )
    `);

    console.log('✅ Database tables initialized');
  }

  // User operations
  createUser(username, email, hashedPassword) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      this.db.run(sql, [username, email, hashedPassword], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, username, email });
      });
    });
  }

  findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      this.db.get(sql, [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  findUserById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
      this.db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Project operations
  createProject(name, description, userId) {
    try {
      const stmt = this.db.prepare('INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)');
      const result = stmt.run(name, description, userId);
      return { id: result.lastInsertRowid, name, description, user_id: userId };
    } catch (err) {
      throw err;
    }
  }

  getProjectsByUser(userId) {
    try {
      const stmt = this.db.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC');
      return stmt.all(userId);
    } catch (err) {
      throw err;
    }
  }

  // Agent execution operations
  saveAgentExecution(id, agentType, task, projectId, userId) {
    try {
      const stmt = this.db.prepare('INSERT INTO agent_executions (id, agent_type, task, project_id, user_id) VALUES (?, ?, ?, ?, ?)');
      stmt.run(id, agentType, task, projectId, userId);
      return { id, agentType, task, projectId, userId };
    } catch (err) {
      throw err;
    }
  }

  updateAgentExecution(id, status, progress, result = null) {
    try {
      const stmt = this.db.prepare('UPDATE agent_executions SET status = ?, progress = ?, result = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
      stmt.run(status, progress, result, id);
      return { id, status, progress, result };
    } catch (err) {
      throw err;
    }
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('📁 Database connection closed');
      }
    });
  }
}

module.exports = new DatabaseManager();