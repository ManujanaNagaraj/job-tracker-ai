import { Inbox } from 'lucide-react'

function EmptyState({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center">
      <Inbox className="w-24 h-24 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title || 'No data found'}</h3>
      <p className="text-sm text-gray-400 mb-6 text-center">{subtitle}</p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
