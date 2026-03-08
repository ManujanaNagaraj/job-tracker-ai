import { NavLink } from 'react-router-dom'
import { Briefcase, LayoutDashboard, ClipboardList, Bell, PlusCircle } from 'lucide-react'

function Navbar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col">
      {/* App Logo/Name */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-700">
        <Briefcase className="w-8 h-8 text-blue-500" />
        <h1 className="text-xl font-bold">Job Tracker AI</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/applications"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <ClipboardList className="w-5 h-5" />
          <span>Applications</span>
        </NavLink>

        <NavLink
          to="/applications/add"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Job</span>
        </NavLink>

        <NavLink
          to="/reminders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <Bell className="w-5 h-5" />
          <span>Reminders</span>
        </NavLink>
      </nav>

      {/* Version */}
      <div className="p-4 text-center text-gray-500 text-xs border-t border-gray-700">
        v1.0.0
      </div>
    </div>
  )
}

export default Navbar
