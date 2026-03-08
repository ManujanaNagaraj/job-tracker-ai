import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './index.css'

// Apply dark mode class on initial load before React renders
const isDarkMode = (() => {
  const stored = localStorage.getItem('darkMode')
  if (stored !== null) {
    return JSON.parse(stored)
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
})()

if (isDarkMode) {
  document.documentElement.classList.add('dark')
}

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            success: {
              duration: 3000,
              style: {
                background: '#10b981',
                color: '#fff',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#ef4444',
                color: '#fff',
              },
            },
            style: {
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
