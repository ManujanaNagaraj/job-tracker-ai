import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReminders, useUpcomingFollowups, useSendReminder, useSnoozeReminder, useMarkUpdated } from '../hooks/useReminders'
import StatusBadge from '../components/StatusBadge'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorMessage from '../components/ErrorMessage'
import toast from 'react-hot-toast'
import { 
  Bell, Clock, Mail, SnoozeIcon, CheckCircle, 
  AlertCircle, Calendar, Building2, Briefcase, X 
} from 'lucide-react'

function Reminders() {
  const { data: pendingReminders, isLoading: loadingPending, error: errorPending, refetch: refetchPending } = useReminders()
  const { data: upcomingFollowups, isLoading: loadingUpcoming, error: errorUpcoming, refetch: refetchUpcoming } = useUpcomingFollowups()
  const { mutate: sendReminder } = useSendReminder()
  const { mutate: snooze } = useSnoozeReminder()
  const { mutate: markUpdated } = useMarkUpdated()
  
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const [emailInput, setEmailInput] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSendEmail = () => {
    if (!emailInput.trim()) {
      toast.error('Please enter an email address')
      return
    }

    setIsSending(true)
    sendReminder(
      { id: selectedApp.id, email: emailInput },
      {
        onSuccess: () => {
          toast.success('Reminder email sent successfully!')
          setShowEmailModal(false)
          setEmailInput('')
          setSelectedApp(null)
        },
        onError: (error) => {
          toast.error(error.response?.data?.detail || 'Failed to send email')
        },
        onSettled: () => {
          setIsSending(false)
        }
      }
    )
  }

  const handleSnooze = (id, days = 7) => {
    snooze(
      { id, days },
      {
        onSuccess: () => {
          toast.success(`Reminder snoozed for ${days} days`)
        },
        onError: () => {
          toast.error('Failed to snooze reminder')
        }
      }
    )
  }

  const handleMarkUpdated = (id) => {
    markUpdated(id, {
      onSuccess: () => {
        toast.success('Marked as updated')
      },
      onError: () => {
        toast.error('Failed to update')
      }
    })
  }

  const getDaysSince = (date) => {
    const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24))
    return days
  }

  const getDaysUntil = (date) => {
    const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
    return days
  }

  if (loadingPending || loadingUpcoming) {
    return <LoadingSkeleton rows={6} />
  }

  if (errorPending || errorUpcoming) {
    return <ErrorMessage message="Failed to load reminders" onRetry={() => { refetchPending(); refetchUpcoming() }} />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Follow-up Reminders</h1>
        </div>
        <p className="text-gray-600">Stay on top of your job applications</p>
      </div>

      {/* Section 1: Needs Follow-up */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-semibold text-gray-800">Needs Follow-up</h2>
          {pendingReminders && pendingReminders.length > 0 && (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
              {pendingReminders.length}
            </span>
          )}
        </div>

        {!pendingReminders || pendingReminders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">All caught up! No pending follow-ups.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingReminders.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-orange-500">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <Link to={`/applications/${app.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                        {app.company}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm">{app.job_title}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm text-orange-600 font-medium">
                  <Clock className="w-4 h-4" />
                  <span>{getDaysSince(app.applied_date)} days since applied</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedApp(app)
                      setShowEmailModal(true)
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
                  </button>
                  <button
                    onClick={() => handleSnooze(app.id, 7)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <SnoozeIcon className="w-4 h-4" />
                    Snooze 7d
                  </button>
                  <button
                    onClick={() => handleMarkUpdated(app.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Updated
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Upcoming Follow-ups */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Follow-ups</h2>
          {upcomingFollowups && upcomingFollowups.length > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              {upcomingFollowups.length}
            </span>
          )}
        </div>

        {!upcomingFollowups || upcomingFollowups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No upcoming follow-ups scheduled</p>
            <p className="text-sm text-gray-500 mt-1">Set follow-up dates when editing applications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingFollowups.map((app) => {
              const daysUntil = getDaysUntil(app.follow_up_date)
              return (
                <div key={app.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`px-3 py-2 rounded-lg text-center ${
                      daysUntil === 0 ? 'bg-red-100 text-red-700' :
                      daysUntil <= 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      <div className="text-2xl font-bold">
                        {daysUntil === 0 ? 'Today' : `${daysUntil}d`}
                      </div>
                    </div>
                    <div className="flex-1">
                      <Link to={`/applications/${app.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                          {app.company} - {app.job_title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500">
                        Follow up on {new Date(app.follow_up_date).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Send Reminder Email</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedApp?.company} - {selectedApp?.job_title}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEmailModal(false)
                  setEmailInput('')
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                We'll send you a follow-up template and tips to help you reconnect
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEmailModal(false)
                  setEmailInput('')
                }}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isSending || !emailInput.trim()}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reminders
