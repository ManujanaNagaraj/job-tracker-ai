import { useMutation } from '@tanstack/react-query'
import client from '../api/client'

export const useUrlParser = () => {
  return useMutation({
    mutationFn: async (url) => {
      const { data } = await client.post('/parse/url', { url })
      return data
    },
  })
}
