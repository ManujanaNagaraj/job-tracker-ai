import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { memo, useCallback } from 'react'
import { Search, Filter, Plus, Pencil, Trash2, ExternalLink, Building2, MapPin, Calendar } from 'lucide-react'
import { useApplications, useDeleteApplication } from '../hooks/useApplications'
import useJobStore from '../store/useJobStore'
import StatusBadge from '../components/StatusBadge'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import toast from 'react-hot-toast'

const JobCard = memo(function JobCard({ job, onEdit, onDelete }) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-gray-400" />
          <h3 className="font-bold text-gray-900">{job.company}</h3>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Job Title */}
      <h4 className="text-gray-700 font-medium mb-3">{job.job_title}</h4>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {job.location && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{job.applied_date ? new Date(job.applied_date).toLocaleDateString() : 'N/A'}</span>
        </div>
        {job.salary_range && (
          <div className="text-sm text-green-600 font-medium">
            {job.salary_range}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => navigate(`/applications/${job.id}`)}
          className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          View Details
        </button>
        <button
          onClick={() => onEdit(job.id)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(job)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        {job.job_url && (
          <a
            href={job.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Open job posting"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
})

function Applications() {
  const navigate = useNavigate()
  const { searchQuery, setSearchQuery, selectedStatus, setSelectedStatus, clearFilters } = useJobStore()
  
  const { data: applications, isLoading, error, refetch } = useApplications({
    search: searchQuery || undefined,
    status: selectedStatus || undefined
  })
  
  const deleteMutation = useDeleteApplication()

  const handleEdit = useCallback((id) => {
    navigate(`/applications/edit/${id}`)
  }, [navigate])

  const handleDelete = useCallback((job) => {
    if (window.confirm(`Are you sure you want to delete the application for ${job.company}?`)) {
      deleteMutation.mutate(job.id, {
        onSuccess: () => {
          toast.success('Application deleted successfully')
        },
        onError: () => {
          toast.error('Failed to delete application')
        }
      })
    }
  }, [deleteMutation])

  const hasFilters = searchQuery || selectedStatus

  if (isLoading) {
    return <LoadingSkeleton rows={6} />
  }

  if (error) {
    return <ErrorMessage message="Failed to load applications" onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Applications</h1>
          <p className="text-gray-500 mt-1">{applications?.length || 0} jobs tracked</p>
        </div>
        <Link
          to="/applications/add"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Job</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={selectedStatus || ''}
            onChange={(e) => setSelectedStatus(e.target.value || null)}
            className="bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Screening">Screening</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Ghosted">Ghosted</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Applications Grid */}
      {applications && applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No applications found"
          subtitle={hasFilters ? "Try adjusting your filters" : "Start tracking your job applications"}
          actionLabel={hasFilters ? undefined : "Add your first job"}
          onAction={hasFilters ? undefined : () => navigate('/applications/add')}
        />
      )}
    </div>
  )
}

export default Applications
