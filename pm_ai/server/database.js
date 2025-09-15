const { Pool } = require('pg');

class DatabaseManager {
  constructor() {
    // Use Railway's DATABASE_URL or fallback to local PostgreSQL
    const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/pm_dashboard';

    this.pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    console.log('📁 Connected to PostgreSQL database');
    this.initTables();
  }

  async initTables() {
    const client = await this.pool.connect();

    try {
      // Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Projects table
      await client.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'active',
          user_id INTEGER NOT NULL REFERENCES users(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Agent executions table
      await client.query(`
        CREATE TABLE IF NOT EXISTS agent_executions (
          id VARCHAR(255) PRIMARY KEY,
          agent_type VARCHAR(255) NOT NULL,
          task TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          progress INTEGER DEFAULT 0,
          result TEXT,
          project_id INTEGER REFERENCES projects(id),
          user_id INTEGER NOT NULL REFERENCES users(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Project context table
      await client.query(`
        CREATE TABLE IF NOT EXISTS project_context (
          id SERIAL PRIMARY KEY,
          project_id INTEGER NOT NULL REFERENCES projects(id),
          context_type VARCHAR(255) NOT NULL,
          data TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('✅ Database tables initialized');
    } catch (err) {
      console.error('❌ Error initializing database tables:', err);
    } finally {
      client.release();
    }
  }

  // User operations
  async createUser(username, email, hashedPassword) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
        [username, email, hashedPassword]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async findUserByEmail(email) {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async findUserById(id) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT id, username, email, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Project operations
  async createProject(name, description, userId) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO projects (name, description, user_id) VALUES ($1, $2, $3) RETURNING *',
        [name, description, userId]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getProjectsByUser(userId) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Agent execution operations
  async saveAgentExecution(id, agentType, task, projectId, userId) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO agent_executions (id, agent_type, task, project_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id, agentType, task, projectId, userId]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async updateAgentExecution(id, status, progress, result = null) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'UPDATE agent_executions SET status = $1, progress = $2, result = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
        [status, progress, result, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async close() {
    await this.pool.end();
    console.log('📁 Database connection closed');
  }
}

module.exports = new DatabaseManager();