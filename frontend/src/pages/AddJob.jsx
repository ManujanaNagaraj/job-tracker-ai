import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateApplication } from '../hooks/useApplications'
import { useUrlParser } from '../hooks/useUrlParser'
import toast from 'react-hot-toast'
import { Briefcase, MapPin, DollarSign, Link as LinkIcon, FileText, Calendar, ArrowLeft, Building2, Wand2, Loader2, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const schema = z.object({
  company: z.string().min(1, 'Company name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  job_url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  location: z.string().optional(),
  salary_range: z.string().optional(),
  status: z.enum(['Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Ghosted']).optional().default('Applied'),
  applied_date: z.string().optional(),
  notes: z.string().optional(),
  job_description: z.string().optional(),
  resume_version: z.string().optional()
})

function AddJob() {
  const navigate = useNavigate()
  const createMutation = useCreateApplication()
  const { mutate: parseUrl, isPending: isParsing } = useUrlParser()
  const [urlInput, setUrlInput] = useState('')
  const [autoFilledFields, setAutoFilledFields] = useState(new Set())

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'Applied',
      applied_date: new Date().toISOString().split('T')[0]
    }
  })

  const handleAutoFill = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a URL first')
      return
    }

    parseUrl(urlInput, {
      onSuccess: (data) => {
        const filled = new Set()
        
        if (data.company) {
          setValue('company', data.company)
          filled.add('company')
        }
        if (data.job_title) {
          setValue('job_title', data.job_title)
          filled.add('job_title')
        }
        if (data.location) {
          setValue('location', data.location)
          filled.add('location')
        }
        if (data.salary_range) {
          setValue('salary_range', data.salary_range)
          filled.add('salary_range')
        }
        if (data.job_url) {
          setValue('job_url', data.job_url)
          filled.add('job_url')
        }
        if (data.job_description) {
          setValue('job_description', data.job_description)
          filled.add('job_description')
        }

        setAutoFilledFields(filled)

        if (filled.size > 0) {
          toast.success(`Form auto-filled! ${filled.size} fields populated`)
          // Clear auto-filled indicators after 3 seconds
          setTimeout(() => setAutoFilledFields(new Set()), 3000)
        } else if (data.error) {
          toast.error(data.error)
        } else {
          toast.error('Could not extract job details from URL')
        }
      },
      onError: () => {
        toast.error('Failed to parse URL. Please fill manually.')
      }
    })
  }

  const onSubmit = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Application added successfully!')
        navigate('/applications')
      },
      onError: () => {
        toast.error('Failed to add application')
      }
    })
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Application</h1>
          <p className="text-gray-500 mt-1">Track a new job opportunity</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
        {/* URL Auto-Fill Section */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Fill from Job URL
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste job posting URL to auto-fill form (e.g., https://jobs.lever.co/...)"
            />
            <button
              type="button"
              onClick={handleAutoFill}
              disabled={isParsing || !urlInput.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isParsing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Parsing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Auto Fill</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Paste a job posting URL and we'll try to extract the details for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Company Name *
                {autoFilledFields.has('company') && (
                  <span className="flex items-center gap-1 text-green-600 text-xs">
                    <CheckCircle className="w-4 h-4" />
                    Auto-filled
                  </span>
                )}
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('company')}
                  type="text"
                  className={`w-full border rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 ${
                    autoFilledFields.has('company')
                      ? 'border-green-500 ring-2 ring-green-200 focus:ring-green-500'
                      : 'border-gray-200 focus:ring-blue-500'
                  }`}
                  placeholder="e.g., Google"
                />
              </div>
              {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Job Title *
                {autoFilledFields.has('job_title') && (
                  <span className="flex items-center gap-1 text-green-600 text-xs">
                    <CheckCircle className="w-4 h-4" />
                    Auto-filled
                  </span>
                )}
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('job_title')}
                  type="text"
                  className={`w-full border rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 ${
                    autoFilledFields.has('job_title')
                      ? 'border-green-500 ring-2 ring-green-200 focus:ring-green-500'
                      : 'border-gray-200 focus:ring-blue-500'
                  }`}
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
            onClick={() => navigate('/applications')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Application'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddJob
