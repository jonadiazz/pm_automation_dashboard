import { Activity, Users, FileText, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PM Automation Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Lightweight agent ecosystem for project management automation
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Activity className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Context Agent</h3>
            <p className="text-gray-600 text-sm">
              Maintains project state and extracts key information
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <FileText className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Documentation Agent</h3>
            <p className="text-gray-600 text-sm">
              Generates Slack updates and Confluence designs
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <Users className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Planning Agent</h3>
            <p className="text-gray-600 text-sm">
              Breaks down tasks and estimates effort
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <Zap className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Investigation Agent</h3>
            <p className="text-gray-600 text-sm">
              Analyzes issues and creates troubleshooting reports
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <span>Configure your project settings</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <span>Connect your development tools</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <span>Let agents automate your PM workflows</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}