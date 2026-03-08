import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import AddJob from './pages/AddJob'
import EditJob from './pages/EditJob'
import JobDetail from './pages/JobDetail'
import Reminders from './pages/Reminders'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="flex">
      <Navbar />
      <main className="md:ml-64 flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 pb-20 md:pb-8 transition-colors duration-200">
        <div className="animate-fadeIn">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/applications/add" element={<AddJob />} />
            <Route path="/applications/edit/:id" element={<EditJob />} />
            <Route path="/applications/:id" element={<JobDetail />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
