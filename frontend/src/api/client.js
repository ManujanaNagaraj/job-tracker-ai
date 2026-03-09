import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Log API URL in development mode
if (import.meta.env.DEV) {
  console.log('🌐 API URL:', import.meta.env.VITE_API_URL || 'http://localhost:8000')
}

// Request interceptor
client.interceptors.request.use(
  (config) => {
    // You can add auth tokens here in the future
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
client.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Extract error message from FastAPI error response format: { detail: "error message" }
    let errorMessage = 'An error occurred'
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      // Extract detail from FastAPI error format
      errorMessage = data?.detail || data?.message || errorMessage
      
      if (status === 401) {
        // Unauthorized - could redirect to login in the future
        console.error('Unauthorized access:', errorMessage)
      } else if (status === 404) {
        console.error('Resource not found:', errorMessage)
      } else if (status >= 500) {
        console.error('Server error:', errorMessage)
      }
      
      // Attach the extracted message to the error object for easy access
      error.message = errorMessage
    } else if (error.request) {
      // Request made but no response
      errorMessage = 'Network error - no response from server'
      error.message = errorMessage
      console.error(errorMessage)
    } else {
      // Other errors
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default client
