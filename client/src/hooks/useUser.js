import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axios';

export const useUser = (options = {}) => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const res = await apiClient.get('/users/profile');
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
    ...options,
  });
};
