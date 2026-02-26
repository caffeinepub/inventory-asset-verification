import { useState, useEffect, useCallback, useRef } from 'react';
import { offlineQueue } from '../services/offlineQueue';
import { useActor } from './useActor';

export type SyncStatus = 'idle' | 'syncing' | 'completed' | 'error';

export function useOfflineSync() {
  const { actor } = useActor();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(offlineQueue.count());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const isSyncingRef = useRef(false);

  const refreshCount = useCallback(() => {
    setPendingCount(offlineQueue.count());
  }, []);

  const sync = useCallback(async () => {
    if (!actor || isSyncingRef.current) return;
    const items = offlineQueue.getAll();
    if (items.length === 0) return;

    isSyncingRef.current = true;
    setSyncStatus('syncing');
    setSyncError(null);

    let hasError = false;
    for (const item of items) {
      try {
        await actor.submitAssetCheck(
          item.assetId,
          item.name,
          item.category,
          item.locationId,
          item.condition,
          item.remarks,
          item.latitude,
          item.longitude,
          item.photos
        );
        offlineQueue.remove(item.id);
        setPendingCount(offlineQueue.count());
      } catch (err) {
        hasError = true;
        console.error('Failed to sync item:', item.id, err);
      }
    }

    isSyncingRef.current = false;
    setSyncStatus(hasError ? 'error' : 'completed');
    setPendingCount(offlineQueue.count());

    if (!hasError) {
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  }, [actor]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('idle');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && actor && pendingCount > 0) {
      sync();
    }
  }, [isOnline, actor, sync, pendingCount]);

  return {
    isOnline,
    pendingCount,
    syncStatus,
    syncError,
    sync,
    refreshCount,
  };
}
