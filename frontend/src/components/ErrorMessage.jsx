import { AlertCircle } from 'lucide-react'

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center justify-center">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <p className="text-gray-600 text-center mb-4">{message || 'Something went wrong'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
