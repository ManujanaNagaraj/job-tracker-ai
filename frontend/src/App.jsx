import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import AddJob from './pages/AddJob'
import JobDetail from './pages/JobDetail'
import Reminders from './pages/Reminders'

function App() {
  return (
    <div className="flex">
      <Navbar />
      <main className="ml-64 flex-1 min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/add" element={<AddJob />} />
          <Route path="/applications/:id" element={<JobDetail />} />
          <Route path="/reminders" element={<Reminders />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
