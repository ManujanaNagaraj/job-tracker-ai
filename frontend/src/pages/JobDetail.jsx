import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { useApplication, useUpdateApplication } from '../hooks/useApplications'
import StatusBadge from '../components/StatusBadge'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorMessage from '../components/ErrorMessage'
import AITipsPanel from '../components/AITipsPanel'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Pencil, Building2, MapPin, DollarSign, Calendar,
  Link as LinkIcon, FileText, Clock
} from 'lucide-react'

function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: job, isLoading, error, refetch } = useApplication(id)
  const updateMutation = useUpdateApplication()
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState('')

  const handleStatusChange = (newStatus) => {
    updateMutation.mutate(
      { id: parseInt(id), data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success('Status updated')
        },
        onError: () => {
          toast.error('Failed to update status')
        }
      }
    )
  }

  const handleSaveNotes = () => {
    updateMutation.mutate(
      { id: parseInt(id), data: { notes } },
      {
        onSuccess: () => {
          toast.success('Notes saved')
          setIsEditingNotes(false)
        },
        onError: () => {
          toast.error('Failed to save notes')
        }
      }
    )
  }

  if (isLoading) {
    return <LoadingSkeleton rows={8} />
  }

  if (error || !job) {
    return <ErrorMessage message="Job application not found" onRetry={refetch} />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/applications')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Applications</span>
        </button>
        <div className="flex items-center gap-3">
          {/* Status Dropdown */}
          <select
            value={job.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Applied">Applied</option>
            <option value="Screening">Screening</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Ghosted">Ghosted</option>
          </select>
          <Link
            to={`/applications/edit/${id}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (60%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{job.company}</h1>
            </div>
            <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-4">{job.job_title}</h2>
            <StatusBadge status={job.status} />
          </div>

          {/* Info Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {job.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{job.location}</p>
                  </div>
                </div>
              )}
              {job.salary_range && (
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Salary Range</p>
                    <p className="text-green-600 font-medium">{job.salary_range}</p>
                  </div>
                </div>
              )}
              {job.applied_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Applied Date</p>
                    <p className="text-gray-900">{new Date(job.applied_date).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              {job.job_url && (
                <div className="flex items-start gap-3">
                  <LinkIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Job URL</p>
                    <a
                      href={job.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View posting →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          {job.job_description && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{job.job_description}</p>
            </div>
          )}

          {/* Notes Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Notes</h3>
              {!isEditingNotes ? (
                <button
                  onClick={() => {
                    setNotes(job.notes || '')
                    setIsEditingNotes(true)
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit Notes
                </button>
              ) : (
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Save
                </button>
              )}
            </div>
            {isEditingNotes ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Add your notes..."
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{job.notes || 'No notes yet'}</p>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Created:</span>
                <span className="text-gray-900">{new Date(job.created_at).toLocaleString()}</span>
              </div>
              {job.updated_at && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="text-gray-900">{new Date(job.updated_at).toLocaleString()}</span>
                </div>
              )}
              {job.follow_up_date && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Follow Up:</span>
                  <span className="text-gray-900">{new Date(job.follow_up_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (40%) */}
        <div className="space-y-6">
          {/* AI Tips Panel */}
          <AITipsPanel
            applicationId={parseInt(id)}
            jobTitle={job.job_title}
            company={job.company}
            existingTips={job.ai_tips}
          />

          {/* Resume Version */}
          {job.resume_version && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Resume Version</p>
                  <p className="text-gray-900 font-medium">{job.resume_version}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobDetail
