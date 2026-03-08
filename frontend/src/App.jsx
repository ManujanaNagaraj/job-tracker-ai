import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import AddJob from './pages/AddJob'
import JobDetail from './pages/JobDetail'
import Reminders from './pages/Reminders'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/applications/add" element={<AddJob />} />
      <Route path="/applications/:id" element={<JobDetail />} />
      <Route path="/reminders" element={<Reminders />} />
    </Routes>
  )
}

export default App
