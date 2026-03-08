import { useStats, useApplications } from '../hooks/useApplications'
import StatsCard from '../components/StatsCard'
import StatusBadge from '../components/StatusBadge'
import { Briefcase, TrendingUp, Award, XCircle } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { Link } from 'react-router-dom'

function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStats()
  const { data: applications, isLoading: appsLoading } = useApplications({ limit: 5 })

  // Prepare chart data
  const barData = stats ? [
    { name: 'Applied', count: stats.applied },
    { name: 'Screening', count: stats.screening },
    { name: 'Interview', count: stats.interview },
    { name: 'Offer', count: stats.offer },
    { name: 'Rejected', count: stats.rejected },
    { name: 'Ghosted', count: stats.ghosted }
  ] : []

  const pieData = stats ? [
    { name: 'Applied', value: stats.applied },
    { name: 'Screening', value: stats.screening },
    { name: 'Interview', value: stats.interview },
    { name: 'Offer', value: stats.offer },
    { name: 'Rejected', value: stats.rejected },
    { name: 'Ghosted', value: stats.ghosted }
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">{today}</p>
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
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Applications by Status</h2>
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
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h2>
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
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
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
