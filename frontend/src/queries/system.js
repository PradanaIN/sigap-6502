import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/apiClient';

export function useSystemHealth() {
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: () => apiRequest('/api/system/health'),
    refetchInterval: 30_000,
  });
}

export function useLogs(limit = 100, audience = 'public') {
  const safeAudience = audience === 'admin' ? 'admin' : 'public';
  return useQuery({
    queryKey: ['system', 'logs', safeAudience, limit],
    queryFn: () =>
      apiRequest(`/api/system/logs?limit=${limit}&audience=${safeAudience}`),
    // Refresh logs more frequently for better feedback after scanning QR
    refetchInterval: 5_000,
  });
}

export function useSystemStats() {
  return {
    ...useQuery({
      queryKey: ['system', 'stats'],
      queryFn: () => apiRequest('/api/system/stats'),
      refetchInterval: 60_000,
    }),
  };
}

export function useQr() {
  return useQuery({
    queryKey: ['system', 'qr'],
    queryFn: () => apiRequest('/api/system/qr'),
    // QR berubah cepat saat sesi baru; polling cepat saat belum aktif
    refetchInterval: 3000,
  });
}
