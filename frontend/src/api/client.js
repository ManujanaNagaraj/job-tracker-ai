import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

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
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      if (status === 401) {
        // Unauthorized - could redirect to login in the future
        console.error('Unauthorized access')
      } else if (status === 404) {
        console.error('Resource not found')
      } else if (status >= 500) {
        console.error('Server error:', data.detail || 'Internal server error')
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error - no response from server')
    } else {
      // Other errors
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default client
