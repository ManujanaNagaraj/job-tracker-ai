import { create } from 'zustand'

const useJobStore = create((set) => ({
  // State
  selectedStatus: null,
  searchQuery: '',
  selectedJob: null,
  isDarkMode: false,

  // Actions
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  clearFilters: () => set({ selectedStatus: null, searchQuery: '' })
}))

export default useJobStore
