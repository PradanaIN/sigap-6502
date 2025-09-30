import { useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { closeSocket, getSocket } from '../../lib/socket';

// Keys reused by queries
const LOGS_PREFIX = ['system', 'logs'];
const BOT_STATUS_KEY = ['bot', 'status'];
const QR_KEY = ['system', 'qr'];

export function SocketProvider({ children }) {
  const queryClient = useQueryClient();

  // Stable handlers via refs/memo
  const handlers = useMemo(() => ({
    onStatus: (status) => {
      if (status && typeof status === 'object') {
        queryClient.setQueryData(BOT_STATUS_KEY, (old) => ({
          ...(old || {}),
          active: Boolean(status.active),
          phase: status.phase ?? (old ? old.phase : 'idle'),
        }));
        return;
      }

      queryClient.setQueryData(BOT_STATUS_KEY, (old) => ({
        ...(old || {}),
        active: Boolean(status),
      }));
    },
    onLog: (audience, line) => {
      // Update all caches that start with LOGS_PREFIX
      const entries = queryClient.getQueriesData({ queryKey: LOGS_PREFIX });
      entries.forEach(([key, data]) => {
        // key format: ['system','logs', audience, limit]
        const keyAudience =
          Array.isArray(key) && typeof key[2] === 'string' ? key[2] : 'public';
        const limit =
          Array.isArray(key) && typeof key[3] === 'number' ? key[3] : 100;

        const shouldUpdate =
          keyAudience === 'admin' || keyAudience === audience;
        if (!shouldUpdate) return;

        const next = Array.isArray(data?.logs) ? [...data.logs, line] : [line];
        const bounded = next.slice(-limit);
        queryClient.setQueryData(key, { logs: bounded });
      });
    },
    onQr: (qr) => {
      queryClient.setQueryData(QR_KEY, { qr });
    },
  }), [queryClient]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      // no-op; server will emit current status/QR automatically
    });
    const handleAdminLog = (line) => handlers.onLog('admin', line);
    const handlePublicLog = (line) => handlers.onLog('public', line);

    socket.on('status-update', handlers.onStatus);
    socket.on('log-update:admin', handleAdminLog);
    socket.on('log-update:public', handlePublicLog);
    socket.on('qr-update', handlers.onQr);

    return () => {
      socket.off('status-update', handlers.onStatus);
      socket.off('log-update:admin', handleAdminLog);
      socket.off('log-update:public', handlePublicLog);
      socket.off('qr-update', handlers.onQr);
      closeSocket();
    };
  }, [handlers]);

  return children;
}

