import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/apiClient';

const BOT_STATUS_KEY = ['bot', 'status'];
const TRANSITIONAL_PHASES = new Set([
  'starting',
  'waiting-qr',
  'authenticated',
  'restarting',
]);

export function useBotStatus() {
  return useQuery({
    queryKey: BOT_STATUS_KEY,
    queryFn: () => apiRequest('/api/admin/bot/status'),
    // Poll faster during transitional phases to reflect readiness quickly
    refetchInterval: (data) => {
      if (!data) return 3_000;
      if (data?.active || data?.phase === 'ready') return 60_000;
      if (TRANSITIONAL_PHASES.has(data?.phase)) return 2_000;
      return 5_000;
    },
    placeholderData: { active: false, phase: 'idle' },
  });
}

export function useBotStart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiRequest('/api/admin/bot/start', { method: 'POST' }),
    onSuccess: (result) => {
      if (result && typeof result === 'object') {
        queryClient.setQueryData(BOT_STATUS_KEY, (old) => ({
          ...(old || {}),
          active: Boolean(result.active),
          phase: result.phase ?? (old ? old.phase : 'idle'),
        }));
      }
      queryClient.invalidateQueries({ queryKey: BOT_STATUS_KEY });
    },
  });
}

export function useBotStop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiRequest('/api/admin/bot/stop', { method: 'POST' }),
    onSuccess: (result) => {
      if (result && typeof result === 'object') {
        queryClient.setQueryData(BOT_STATUS_KEY, (old) => ({
          ...(old || {}),
          active: Boolean(result.active),
          phase: result.phase ?? (old ? old.phase : 'idle'),
        }));
      }
      queryClient.invalidateQueries({ queryKey: BOT_STATUS_KEY });
    },
  });
}
