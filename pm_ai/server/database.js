const Database = require('better-sqlite3');
const path = require('path');

class DatabaseManager {
  constructor() {
    const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
    try {
      this.db = new Database(dbPath);
      console.log('📁 Connected to SQLite database');
      this.initTables();
    } catch (err) {
      console.error('Error opening database:', err);
      throw err;
    }
  }

  initTables() {
    // Users table
    this.db.exec(`
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
    this.db.exec(`
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
    this.db.exec(`
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
    this.db.exec(`
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
    try {
      const stmt = this.db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
      const result = stmt.run(username, email, hashedPassword);
      return { id: result.lastInsertRowid, username, email };
    } catch (err) {
      throw err;
    }
  }

  findUserByEmail(email) {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
      return stmt.get(email);
    } catch (err) {
      throw err;
    }
  }

  findUserById(id) {
    try {
      const stmt = this.db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?');
      return stmt.get(id);
    } catch (err) {
      throw err;
    }
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
    try {
      this.db.close();
      console.log('📁 Database connection closed');
    } catch (err) {
      console.error('Error closing database:', err);
    }
  }
}

module.exports = new DatabaseManager();