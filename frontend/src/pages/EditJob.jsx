import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApplication, useUpdateApplication } from '../hooks/useApplications'
import toast from 'react-hot-toast'
import { Briefcase, MapPin, DollarSign, Link as LinkIcon, FileText, Calendar, ArrowLeft, Building2 } from 'lucide-react'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorMessage from '../components/ErrorMessage'
import { useEffect } from 'react'

const schema = z.object({
  company: z.string().min(1, 'Company name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  job_url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  location: z.string().optional(),
  salary_range: z.string().optional(),
  status: z.enum(['Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Ghosted']).optional(),
  applied_date: z.string().optional(),
  notes: z.string().optional(),
  job_description: z.string().optional(),
  resume_version: z.string().optional()
})

function EditJob() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: job, isLoading, error, refetch } = useApplication(id)
  const updateMutation = useUpdateApplication()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  })

  // Pre-fill form when job data is loaded
  useEffect(() => {
    if (job) {
      reset({
        company: job.company || '',
        job_title: job.job_title || '',
        job_url: job.job_url || '',
        location: job.location || '',
        salary_range: job.salary_range || '',
        status: job.status || 'Applied',
        applied_date: job.applied_date ? new Date(job.applied_date).toISOString().split('T')[0] : '',
        notes: job.notes || '',
        job_description: job.job_description || '',
        resume_version: job.resume_version || ''
      })
    }
  }, [job, reset])

  const onSubmit = (data) => {
    updateMutation.mutate({ id: parseInt(id), data }, {
      onSuccess: () => {
        toast.success('Application updated successfully!')
        navigate(`/applications/${id}`)
      },
      onError: () => {
        toast.error('Failed to update application')
      }
    })
  }

  if (isLoading) {
    return <LoadingSkeleton rows={8} />
  }

  if (error || !job) {
    return <ErrorMessage message="Job application not found" onRetry={refetch} />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/applications')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Application</h1>
          <p className="text-gray-500 mt-1">Update job details</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('company')}
                  type="text"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Google"
                />
              </div>
              {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('job_title')}
                  type="text"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Software Engineer"
                />
              </div>
              {errors.job_title && <p className="text-red-500 text-sm mt-1">{errors.job_title.message}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('location')}
                  type="text"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('salary_range')}
                  type="text"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $120k - $180k"
                />
              </div>
            </div>

            {/* Job URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job URL
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('job_url')}
                  type="url"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://company.com/careers/job-id"
                />
              </div>
              {errors.job_url && <p className="text-red-500 text-sm mt-1">{errors.job_url.message}</p>}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Ghosted">Ghosted</option>
              </select>
            </div>

            {/* Applied Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applied Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('applied_date')}
                  type="date"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Resume Version */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume Version
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('resume_version')}
                  type="text"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Resume_v2.pdf"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows="4"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Add any notes or reminders..."
              />
            </div>
          </div>
        </div>

        {/* Full width - Job Description */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            {...register('job_description')}
            rows="6"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Paste the job description here..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(`/applications/${id}`)}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Application'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditJob
