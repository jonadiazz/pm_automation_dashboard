# PM Automation Dashboard

A lightweight agent ecosystem for project management automation, built to demonstrate **Claude Code integration patterns** and self-hosting capabilities.

## 🎯 Overview

This application showcases:
- **Agent-based architecture** for PM workflow automation
- **Real-time updates** via WebSocket integration
- **Self-hosted deployment** on GitHub Codespaces
- **Claude Code development patterns** throughout the codebase

## 🏗️ Architecture

```
pm_ai/
├── client/          # Next.js frontend (Port 3000)
├── server/          # Express.js API (Port 3001)
├── agents/          # PM automation agents
│   ├── context-agent.js    # Project state management
│   ├── doc-agent.js        # Documentation generation
│   ├── plan-agent.js       # Task planning
│   └── investigate-agent.js # Issue analysis
└── docs/            # Project documentation
```

## 🤖 Agent Types

### Context Agent
- **Purpose**: Maintains project state and extracts key information
- **Token Optimization**: Structured JSON context, delta updates
- **Triggers**: Git commits, file changes, manual execution

### Documentation Agent
- **Purpose**: Generates Slack updates, Confluence designs, test evidence
- **Outputs**: Formatted documentation using predefined templates
- **Integration**: Slack API, Confluence API, custom formats

### Planning Agent
- **Purpose**: Breaks down tasks, estimates effort, identifies dependencies
- **Outputs**: Structured task breakdown, timeline estimates
- **Features**: Effort estimation, dependency mapping, priority scoring

### Investigation Agent
- **Purpose**: Analyzes issues, creates troubleshooting reports
- **Inputs**: Error logs, system state, previous investigations
- **Outputs**: Root cause analysis, action items, evidence summaries

## 🚀 Quick Start

### Option 1: Using the Startup Script (Recommended)
\`\`\`bash
# Make script executable
chmod +x start-dev.sh

# Start both frontend and backend
./start-dev.sh
\`\`\`

### Option 2: Manual Setup
\`\`\`bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..

# Copy environment file
cp server/.env.example server/.env

# Start development servers
npm run dev
\`\`\`

## 🔐 Authentication

Demo credentials:
- **Email**: demo@example.com
- **Password**: demo123

## 📡 API Endpoints

### Authentication
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/register\` - User registration
- \`GET /api/auth/me\` - Get current user

### Agents
- \`GET /api/agents/types\` - Get available agent types
- \`POST /api/agents/execute\` - Execute agent task
- \`GET /api/agents/status/:id\` - Get execution status

### Projects
- \`GET /api/projects\` - Get user projects
- \`POST /api/projects\` - Create new project
- \`PUT /api/projects/:id\` - Update project

## 🌐 Accessing Your Dashboard

### Local Development
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Public Access (Codespaces)
1. Start the development servers
2. In VS Code, go to **Ports** tab
3. Make port 3000 **Public**
4. Copy the generated URL to share your dashboard

## 🔧 Claude Code Integration Points

This project demonstrates key Claude Code patterns:

### 1. Parallel Tool Execution
\`\`\`javascript
// Multiple bash commands executed simultaneously
await Promise.all([
  bash('npm install', { cwd: 'client' }),
  bash('npm install', { cwd: 'server' })
]);
\`\`\`

### 2. File System Operations
\`\`\`javascript
// Efficient file reading and writing
const config = await read('project.json');
await write('output.json', processedData);
\`\`\`

### 3. Agent Orchestration
\`\`\`javascript
// Task delegation to specialized agents
await Task({
  agent: 'context-agent',
  prompt: 'Extract project decisions from recent commits'
});
\`\`\`

### 4. Real-time Monitoring
\`\`\`javascript
// Background process monitoring
const process = await bash('npm run build', { background: true });
const output = await BashOutput(process.id);
\`\`\`

## 🎨 Frontend Features

- **Modern UI**: Built with Next.js 14 + Tailwind CSS
- **Real-time Updates**: Socket.IO integration for live agent status
- **Responsive Design**: Works on desktop and mobile
- **Agent Dashboard**: Visual interface for managing PM workflows

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Protection**: Configured for cross-origin requests
- **Environment Variables**: Secure configuration management

## 📊 Database Schema

### SQLite Tables
- **users**: User accounts and authentication
- **projects**: Project management data
- **agent_executions**: Agent task history and results
- **project_context**: Structured project state data

## 🚢 Deployment Options

### Self-Hosting (Current Setup)
- **Platform**: GitHub Codespaces
- **Cost**: Free with GitHub Pro/Education
- **Access**: Public URL via port forwarding
- **Persistence**: Session-based (can be made persistent)

### Production Deployment
- **Frontend**: Vercel, Netlify, or static hosting
- **Backend**: Railway, Heroku, DigitalOcean
- **Database**: PostgreSQL, MongoDB, or managed SQLite
- **Domain**: Custom domain with SSL certificate

## 🛠️ Development Commands

\`\`\`bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:client       # Start only frontend
npm run dev:server       # Start only backend

# Production
npm run build            # Build frontend for production
npm start               # Start production server

# Installation
npm run install:all      # Install all dependencies
\`\`\`

## 🧪 Testing Agent Workflows

### 1. Context Extraction
\`\`\`bash
curl -X POST http://localhost:3001/api/agents/execute \\
  -H "Content-Type: application/json" \\
  -d '{
    "agentType": "context-agent",
    "task": "Extract recent project changes",
    "projectId": 1
  }'
\`\`\`

### 2. Documentation Generation
\`\`\`bash
curl -X POST http://localhost:3001/api/agents/execute \\
  -H "Content-Type: application/json" \\
  -d '{
    "agentType": "doc-agent",
    "task": "Generate daily standup update",
    "context": "Completed authentication, working on agents"
  }'
\`\`\`

## 📈 Performance Optimization

### Token Efficiency
- **Structured Context**: JSON format for agent communication
- **Template-based Output**: Reusable documentation patterns
- **Caching**: Common responses and project state
- **Delta Updates**: Only transmit changes, not full state

### Real-time Performance
- **WebSocket**: Efficient real-time communication
- **Background Processing**: Non-blocking agent execution
- **Database Indexing**: Optimized queries for large datasets

## 🤝 Contributing

This project serves as a learning template for Claude Code integration. Key areas for extension:

1. **Additional Agents**: Create specialized agents for your workflow
2. **Integration APIs**: Connect to Slack, Jira, GitHub, etc.
3. **Advanced Authentication**: OAuth2, SAML, multi-tenant support
4. **Deployment Automation**: CI/CD, Docker, Kubernetes

## 🔮 Next Steps

- [ ] Add more PM agent types
- [ ] Implement Slack/Confluence integrations
- [ ] Add file upload for context analysis
- [ ] Create mobile-responsive dashboard
- [ ] Add agent performance metrics
- [ ] Implement multi-project workspaces

---

**Built with Claude Code** - Demonstrating AI-powered development workflows