const express = require('express');
const router = express.Router();

// Agent types definition
const AGENT_TYPES = {
  CONTEXT: 'context-agent',
  DOCUMENTATION: 'doc-agent',
  PLANNING: 'plan-agent',
  INVESTIGATION: 'investigate-agent'
};

// In-memory agent status store
let agentStates = {};

// Get all agent types
router.get('/types', (req, res) => {
  res.json([
    {
      id: AGENT_TYPES.CONTEXT,
      name: 'Context Agent',
      description: 'Maintains project state and extracts key information',
      icon: 'activity',
      color: 'blue'
    },
    {
      id: AGENT_TYPES.DOCUMENTATION,
      name: 'Documentation Agent',
      description: 'Generates Slack updates and Confluence designs',
      icon: 'file-text',
      color: 'green'
    },
    {
      id: AGENT_TYPES.PLANNING,
      name: 'Planning Agent',
      description: 'Breaks down tasks and estimates effort',
      icon: 'users',
      color: 'purple'
    },
    {
      id: AGENT_TYPES.INVESTIGATION,
      name: 'Investigation Agent',
      description: 'Analyzes issues and creates troubleshooting reports',
      icon: 'zap',
      color: 'orange'
    }
  ]);
});

// Execute agent task
router.post('/execute', async (req, res) => {
  try {
    const { agentType, task, context, projectId } = req.body;

    if (!agentType || !task) {
      return res.status(400).json({ error: 'Agent type and task are required' });
    }

    // Simulate agent execution
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update agent state
    agentStates[executionId] = {
      id: executionId,
      agentType,
      task,
      status: 'running',
      progress: 0,
      startTime: new Date().toISOString(),
      projectId
    };

    // Simulate async processing
    simulateAgentExecution(executionId, agentType, task, context);

    res.json({
      executionId,
      status: 'started',
      message: `${agentType} execution started`
    });

  } catch (error) {
    res.status(500).json({ error: 'Agent execution failed' });
  }
});

// Get agent execution status
router.get('/status/:executionId', (req, res) => {
  const { executionId } = req.params;
  const state = agentStates[executionId];

  if (!state) {
    return res.status(404).json({ error: 'Execution not found' });
  }

  res.json(state);
});

// Simulate agent execution
function simulateAgentExecution(executionId, agentType, task, context) {
  const state = agentStates[executionId];
  let progress = 0;

  const updateProgress = () => {
    progress += Math.random() * 20;
    if (progress > 100) progress = 100;

    state.progress = Math.round(progress);
    state.lastUpdate = new Date().toISOString();

    if (progress >= 100) {
      state.status = 'completed';
      state.endTime = new Date().toISOString();
      state.result = generateMockResult(agentType, task);
    }

    // In a real implementation, you'd emit this via Socket.IO
    console.log(`Agent ${agentType} progress: ${state.progress}%`);

    if (progress < 100) {
      setTimeout(updateProgress, 1000 + Math.random() * 2000);
    }
  };

  setTimeout(updateProgress, 500);
}

// Generate mock results based on agent type
function generateMockResult(agentType, task) {
  switch (agentType) {
    case AGENT_TYPES.CONTEXT:
      return {
        type: 'context_update',
        data: {
          keyDecisions: ['Implemented user authentication', 'Added real-time updates'],
          blockers: ['Database migration pending'],
          nextActions: ['Deploy to staging', 'Run integration tests']
        }
      };

    case AGENT_TYPES.DOCUMENTATION:
      return {
        type: 'documentation',
        data: {
          slackUpdate: '✅ Completed PM dashboard MVP\\n🔧 Added agent orchestration\\n🎯 Next: User testing',
          confluenceDoc: '# PM Dashboard Implementation\\n\\n## Overview\\nBuilt lightweight agent ecosystem...'
        }
      };

    case AGENT_TYPES.PLANNING:
      return {
        type: 'task_breakdown',
        data: {
          tasks: [
            { name: 'Setup authentication', effort: '2d', priority: 'high' },
            { name: 'Implement agent API', effort: '3d', priority: 'medium' },
            { name: 'Add real-time updates', effort: '1d', priority: 'low' }
          ],
          timeline: '1 week',
          dependencies: ['Database setup', 'API design']
        }
      };

    case AGENT_TYPES.INVESTIGATION:
      return {
        type: 'investigation_report',
        data: {
          rootCause: 'Missing CORS configuration in production',
          evidence: ['Browser console errors', 'Network request failures'],
          recommendations: ['Update server CORS settings', 'Add environment-specific configs']
        }
      };

    default:
      return { type: 'generic', data: { message: 'Task completed successfully' } };
  }
}

module.exports = router;