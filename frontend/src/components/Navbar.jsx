import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { Briefcase, LayoutDashboard, ClipboardList, Bell, PlusCircle, Moon, Sun, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import useJobStore from '../store/useJobStore'

function Navbar() {
  const { isDarkMode, toggleDarkMode } = useJobStore()
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const getInitials = (name) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : '??'
  }

  const getUserColor = (name) => {
    const colors = [
      'bg-blue-600',
      'bg-purple-600',
      'bg-green-600',
      'bg-red-600',
      'bg-yellow-600',
      'bg-indigo-600'
    ]
    const index = name ? name.charCodeAt(0) % colors.length : 0
    return colors[index]
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-gray-900 dark:bg-gray-950 text-white flex-col">
        {/* App Logo/Name */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-700 dark:border-gray-800">
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
                  : 'text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
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
                  : 'text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
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
                  : 'text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
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
                  : 'text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Bell className="w-5 h-5" />
            <span>Reminders</span>
          </NavLink>
        </nav>

        {/* Dark Mode Toggle & User Profile */}
        <div className="border-t border-gray-700 dark:border-gray-800">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 px-4 py-3 mx-2 my-2 rounded-lg text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white transition-all duration-200 w-[calc(100%-1rem)]"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          {/* User Profile Section */}
          {user && (
            <div className="p-2 relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-200 w-full"
              >
                <div className={`w-10 h-10 rounded-full ${getUserColor(user.name)} flex items-center justify-center text-white font-semibold`}>
                  {getInitials(user.name)}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute bottom-full left-2 right-2 mb-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                  <button
                    onClick={() => {
                      logout()
                      setShowDropdown(false)
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="p-4 text-center text-gray-500 text-xs">
            v1.0.0
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 dark:bg-gray-950 text-white border-t border-gray-700 dark:border-gray-800 z-50">
        <nav className="flex justify-around items-center py-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 ${
                isActive ? 'text-blue-500' : 'text-gray-400'
              }`
            }
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </NavLink>

          <NavLink
            to="/applications"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 ${
                isActive ? 'text-blue-500' : 'text-gray-400'
              }`
            }
          >
            <ClipboardList className="w-6 h-6" />
            <span className="text-xs">Jobs</span>
          </NavLink>

          <NavLink
            to="/applications/add"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 ${
                isActive ? 'text-blue-500' : 'text-gray-400'
              }`
            }
          >
            <PlusCircle className="w-6 h-6" />
            <span className="text-xs">Add</span>
          </NavLink>

          <NavLink
            to="/reminders"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 ${
                isActive ? 'text-blue-500' : 'text-gray-400'
              }`
            }
          >
            <Bell className="w-6 h-6" />
            <span className="text-xs">Alerts</span>
          </NavLink>

          <button
            onClick={toggleDarkMode}
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400"
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            <span className="text-xs">Theme</span>
          </button>
        </nav>
      </div>
    </>
  )
}

export default Navbar
