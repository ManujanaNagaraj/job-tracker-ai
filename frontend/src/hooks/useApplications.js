import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'

// Fetch all applications with optional filters
export const useApplications = (filters = {}) => {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.search) params.append('search', filters.search)
      if (filters.skip) params.append('skip', filters.skip)
      if (filters.limit) params.append('limit', filters.limit)
      
      const response = await client.get(`/applications/?${params}`)
      return response.data
    }
  })
}

// Fetch single application by ID
export const useApplication = (id) => {
  return useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      const response = await client.get(`/applications/${id}`)
      return response.data
    },
    enabled: !!id
  })
}

// Fetch stats
export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await client.get('/applications/stats')
      return response.data
    }
  })
}

// Create application
export const useCreateApplication = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await client.post('/applications/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    }
  })
}

// Update application
export const useUpdateApplication = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await client.put(`/applications/${id}`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['application', data.id] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    }
  })
}

// Delete application
export const useDeleteApplication = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await client.delete(`/applications/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    }
  })
}
