import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'

export const useGenerateTips = (applicationId) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const { data } = await client.post(`/ai/tips/${applicationId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['application', applicationId])
    }
  })
}

export const useClearTips = (applicationId) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const { data } = await client.delete(`/ai/tips/${applicationId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['application', applicationId])
    }
  })
}

export const useGenerateCoverLetter = (applicationId) => {
  return useMutation({
    mutationFn: async (userBackground) => {
      const { data } = await client.post(`/ai/cover-letter/${applicationId}`, {
        user_background: userBackground
      })
      return data
    }
  })
}
