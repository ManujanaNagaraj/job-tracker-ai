import { create } from 'zustand'

// Initialize dark mode from localStorage or system preference
const getInitialDarkMode = () => {
  const stored = localStorage.getItem('darkMode')
  if (stored !== null) {
    return JSON.parse(stored)
  }
  // Fallback to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const useJobStore = create((set) => ({
  // State
  selectedStatus: null,
  searchQuery: '',
  selectedJob: null,
  isDarkMode: getInitialDarkMode(),

  // Actions
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.isDarkMode
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode))
    // Update document class for Tailwind
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    return { isDarkMode: newDarkMode }
  }),
  clearFilters: () => set({ selectedStatus: null, searchQuery: '' })
}))

export default useJobStore
