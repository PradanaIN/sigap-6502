import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/apiClient';

const TEMPLATE_KEY = ['template', 'admin'];

export function useTemplate() {
  return useQuery({
    queryKey: TEMPLATE_KEY,
    queryFn: () => apiRequest('/api/admin/templates/raw'),
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (template) =>
      apiRequest('/api/admin/templates', {
        method: 'POST',
        body: { template },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATE_KEY });
    },
  });
}
