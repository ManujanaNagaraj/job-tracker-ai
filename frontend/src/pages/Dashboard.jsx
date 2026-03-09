import { useStats, useApplications } from '../hooks/useApplications'
import { useQuery } from '@tanstack/react-query'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'
import StatsCard from '../components/StatsCard'
import StatusBadge from '../components/StatusBadge'
import { Briefcase, TrendingUp, Award, XCircle, Wifi, WifiOff } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { Link } from 'react-router-dom'

function Dashboard() {
  const { user } = useAuth()
  const { data: stats, isLoading: statsLoading, error: statsError } = useStats()
  const { data: applications, isLoading: appsLoading, error: appsError } = useApplications({ limit: 5 })
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'Good morning'
    if (hour >= 12 && hour < 17) return 'Good afternoon'
    if (hour >= 17 && hour < 21) return 'Good evening'
    return 'Working late'
  }
  
  const firstName = user?.name?.split(' ')[0] || 'there'
  
  // Health check for connection status
  const { data: healthData, isError: healthError } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await client.get('/health')
      return response.data
    },
    refetchInterval: 30000, // Check every 30 seconds
    retry: 1
  })

  // Prepare chart data
  const barData = stats ? [
    { name: 'Applied', count: stats.applied || 0 },
    { name: 'Screening', count: stats.screening || 0 },
    { name: 'Interview', count: stats.interview || 0 },
    { name: 'Offer', count: stats.offer || 0 },
    { name: 'Rejected', count: stats.rejected || 0 },
    { name: 'Ghosted', count: stats.ghosted || 0 }
  ] : []

  const pieData = stats ? [
    { name: 'Applied', value: stats.applied || 0 },
    { name: 'Screening', value: stats.screening || 0 },
    { name: 'Interview', value: stats.interview || 0 },
    { name: 'Offer', value: stats.offer || 0 },
    { name: 'Rejected', value: stats.rejected || 0 },
    { name: 'Ghosted', value: stats.ghosted || 0 }
  ].filter(item => item.value > 0) : []

  const COLORS = ['#3b82f6', '#eab308', '#a855f7', '#22c55e', '#ef4444', '#6b7280']

  // Get today's date
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-6 h-32 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (statsError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard data: {statsError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with Personalized Greeting */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {firstName}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{today}</p>
        </div>
        {/* Connection Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {!healthError ? (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Disconnected</span>
            </>
          )}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value={stats?.total || 0}
          icon={Briefcase}
          color="bg-blue-500"
          subtitle="All time"
        />
        <StatsCard
          title="Interviews"
          value={stats?.interview || 0}
          icon={TrendingUp}
          color="bg-purple-500"
          subtitle="In progress"
        />
        <StatsCard
          title="Offers"
          value={stats?.offer || 0}
          icon={Award}
          color="bg-green-500"
          subtitle="Received"
        />
        <StatsCard
          title="Rejected"
          value={stats?.rejected || 0}
          icon={XCircle}
          color="bg-red-500"
          subtitle="Total"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bar Chart - 60% width */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Applications by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - 40% width */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Recent Activity</h2>
          <Link 
            to="/applications" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All →
          </Link>
        </div>
        
        {appsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        ) : applications && applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Company</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Applied Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Location</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{app.company}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{app.job_title}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{app.location || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No applications yet</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
