import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, CloudUpload } from 'lucide-react';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function OfflineSyncIndicator() {
  const { isOnline, pendingCount, syncStatus, sync } = useOfflineSync();

  if (isOnline && pendingCount === 0 && syncStatus === 'idle') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Wifi className="w-3.5 h-3.5 text-green-400" />
        <span className="hidden sm:inline">Online</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1.5">
        <WifiOff className="w-4 h-4 text-destructive" />
        <span className="text-xs font-semibold text-destructive">Offline</span>
        {pendingCount > 0 && (
          <Badge variant="destructive" className="text-xs px-1.5 py-0 h-5">
            {pendingCount}
          </Badge>
        )}
      </div>
    );
  }

  if (syncStatus === 'syncing') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-primary">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        <span className="hidden sm:inline font-medium">Syncing...</span>
      </div>
    );
  }

  if (syncStatus === 'completed') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-400">
        <CheckCircle className="w-3.5 h-3.5" />
        <span className="hidden sm:inline font-medium">Synced!</span>
      </div>
    );
  }

  if (syncStatus === 'error') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={sync}
        className="h-7 px-2 text-xs text-destructive hover:text-destructive"
      >
        <AlertCircle className="w-3.5 h-3.5 mr-1" />
        Retry
      </Button>
    );
  }

  // Pending items, online
  if (pendingCount > 0) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={sync}
        className="h-7 px-2 text-xs text-primary hover:text-primary/80"
      >
        <CloudUpload className="w-3.5 h-3.5 mr-1" />
        <span className="hidden sm:inline">Sync</span>
        <Badge className="ml-1 text-xs px-1.5 py-0 h-4 bg-primary text-primary-foreground">
          {pendingCount}
        </Badge>
      </Button>
    );
  }

  return null;
}
