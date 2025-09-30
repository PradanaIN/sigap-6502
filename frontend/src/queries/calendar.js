import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/apiClient';

const ADMIN_CALENDAR_KEY = ['calendar', 'admin'];

export function useAdminCalendar() {
  return useQuery({
    queryKey: ADMIN_CALENDAR_KEY,
    queryFn: () => apiRequest('/api/admin/calendar'),
  });
}

export function useUpdateAdminCalendar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      apiRequest('/api/admin/calendar', {
        method: 'PUT',
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CALENDAR_KEY });
    },
  });
}
