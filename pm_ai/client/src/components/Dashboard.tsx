'use client';

import { useState, useEffect } from 'react';
import { Activity, Users, FileText, Zap, LogOut, Play } from 'lucide-react';
import { apiService } from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [agentTypes, setAgentTypes] = useState<any[]>([]);
  const [executions, setExecutions] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgentTypes();
  }, []);

  const loadAgentTypes = async () => {
    try {
      const types = await apiService.getAgentTypes();
      setAgentTypes(types);
    } catch (error) {
      console.error('Failed to load agent types:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeAgent = async (agentType: string, agentName: string) => {
    try {
      const task = `Generate ${agentName.toLowerCase()} report for current project`;
      const response = await apiService.executeAgent(agentType, task, {}, 1);

      setExecutions(prev => ({
        ...prev,
        [agentType]: {
          ...response,
          status: 'running',
          startTime: new Date().toISOString()
        }
      }));

      // Poll for status updates
      pollAgentStatus(response.executionId, agentType);
    } catch (error) {
      console.error('Failed to execute agent:', error);
    }
  };

  const pollAgentStatus = async (executionId: string, agentType: string) => {
    try {
      const status = await apiService.getAgentStatus(executionId);

      setExecutions(prev => ({
        ...prev,
        [agentType]: status
      }));

      // Continue polling if still running
      if (status.status === 'running' && status.progress < 100) {
        setTimeout(() => pollAgentStatus(executionId, agentType), 2000);
      }
    } catch (error) {
      console.error('Failed to get agent status:', error);
    }
  };

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'activity': return <Activity className="h-8 w-8" />;
      case 'file-text': return <FileText className="h-8 w-8" />;
      case 'users': return <Users className="h-8 w-8" />;
      case 'zap': return <Zap className="h-8 w-8" />;
      default: return <Activity className="h-8 w-8" />;
    }
  };

  const getAgentColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'purple': return 'text-purple-600';
      case 'orange': return 'text-orange-600';
      default: return 'text-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              PM Automation Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Welcome back, {user.username}!
            </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {agentTypes.map((agent) => {
            const execution = executions[agent.id];
            const isRunning = execution?.status === 'running';
            const isCompleted = execution?.status === 'completed';

            return (
              <div key={agent.id} className="bg-white rounded-lg p-6 shadow-md">
                <div className={`${getAgentColor(agent.color)} mb-4`}>
                  {getAgentIcon(agent.icon)}
                </div>
                <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {agent.description}
                </p>

                {isRunning && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Running...</span>
                      <span>{execution.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${execution.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {isCompleted && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700 text-sm font-medium">✅ Completed!</p>
                    <p className="text-green-600 text-xs mt-1">
                      {new Date(execution.endTime).toLocaleTimeString()}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => executeAgent(agent.id, agent.name)}
                  disabled={isRunning}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Play className="h-4 w-4" />
                  <span>{isRunning ? 'Running...' : 'Execute Agent'}</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          {Object.keys(executions).length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No agents executed yet. Click "Execute Agent" on any card above to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(executions).map(([agentType, execution]) => (
                <div key={agentType} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{agentType}</p>
                    <p className="text-sm text-gray-600">{execution.task}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      execution.status === 'completed' ? 'bg-green-100 text-green-800' :
                      execution.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {execution.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(execution.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}