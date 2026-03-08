import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'

export const useReminders = () => {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: async () => {
      const { data } = await client.get('/reminders/')
      return data
    }
  })
}

export const useUpcomingFollowups = () => {
  return useQuery({
    queryKey: ['upcoming-followups'],
    queryFn: async () => {
      const { data } = await client.get('/reminders/upcoming')
      return data
    }
  })
}

export const useSendReminder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, email }) => {
      const { data } = await client.post(`/reminders/send/${id}`, { email })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reminders'])
      queryClient.invalidateQueries(['applications'])
    }
  })
}

export const useSnoozeReminder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, days }) => {
      const { data } = await client.put(`/reminders/snooze/${id}`, { days })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reminders'])
      queryClient.invalidateQueries(['upcoming-followups'])
      queryClient.invalidateQueries(['applications'])
    }
  })
}

export const useMarkUpdated = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await client.put(`/reminders/mark-updated/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reminders'])
      queryClient.invalidateQueries(['applications'])
    }
  })
}
