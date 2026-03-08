import { useNavigate } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="mb-6">
        <FileQuestion className="w-24 h-24 text-gray-300 mx-auto mb-4" />
        <h1 className="text-8xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  )
}

export default NotFound
