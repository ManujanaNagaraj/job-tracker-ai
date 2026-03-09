import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import LoadingSkeleton from './components/LoadingSkeleton'
import Login from './pages/Login'
import Register from './pages/Register'

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Applications = lazy(() => import('./pages/Applications'))
const AddJob = lazy(() => import('./pages/AddJob'))
const EditJob = lazy(() => import('./pages/EditJob'))
const JobDetail = lazy(() => import('./pages/JobDetail'))
const Reminders = lazy(() => import('./pages/Reminders'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Navbar />
                <main className="md:ml-64 flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 pb-20 md:pb-8 transition-colors duration-200">
                  <div className="animate-fadeIn">
                    <Suspense fallback={<LoadingSkeleton rows={6} />}>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/applications" element={<Applications />} />
                        <Route path="/applications/add" element={<AddJob />} />
                        <Route path="/applications/edit/:id" element={<EditJob />} />
                        <Route path="/applications/:id" element={<JobDetail />} />
                        <Route path="/reminders" element={<Reminders />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </div>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
