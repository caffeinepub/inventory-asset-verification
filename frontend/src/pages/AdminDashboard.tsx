import { useState, useMemo } from 'react';
import {
  LayoutDashboard, RefreshCw, TrendingUp, Package,
  MapPin, AlertTriangle, Download, Loader2, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AssetTable } from '../components/AssetTable';
import { AssetFilters, type FilterState } from '../components/AssetFilters';
import { useGetAllAssets, useExportAssetVerifications, useDeleteAsset } from '../hooks/useQueries';
import type { Asset } from '../backend';
import { getLocationName } from '../constants/locations';
import { getCategoryName } from '../constants/categories';
import { formatTimestamp } from '../utils/formatTimestamp';
import { GPSDisplay } from '../components/GPSDisplay';
import { downloadCSV } from '../utils/csvExport';
import { toast } from 'sonner';

function ConditionBadge({ condition }: { condition: string }) {
  const variants: Record<string, string> = {
    Good: 'status-good',
    Fair: 'status-fair',
    Poor: 'status-poor',
    Missing: 'status-missing',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold ${variants[condition] ?? 'bg-secondary text-foreground'}`}>
      {condition}
    </span>
  );
}

function AssetDetailDrawer({
  asset,
  onClose,
  onDelete,
}: {
  asset: Asset;
  onClose: () => void;
  onDelete: (asset: Asset) => void;
}) {
  const [photoIndex, setPhotoIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-950 border-b border-border">
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2"
        >
          ← Back
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm font-bold text-primary truncate">{asset.assetId}</p>
          <p className="text-xs text-muted-foreground truncate">{asset.name}</p>
        </div>
        <ConditionBadge condition={asset.condition} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-8">
        {/* Photos */}
        {asset.photos.length > 0 && (
          <div className="space-y-2">
            <div className="aspect-video rounded-xl overflow-hidden bg-secondary/50 border border-border">
              <img
                src={asset.photos[photoIndex]}
                alt={`${asset.name} photo ${photoIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            {asset.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {asset.photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoIndex(i)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === photoIndex ? 'border-primary' : 'border-border'}`}
                  >
                    <img src={photo} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Details grid */}
        <div className="field-card space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Asset Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Asset ID</p>
              <p className="font-mono text-sm font-bold text-primary">{asset.assetId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Condition</p>
              <ConditionBadge condition={asset.condition} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Category</p>
              <p className="text-sm font-semibold text-foreground">{getCategoryName(asset.category)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Location</p>
              <p className="text-sm font-semibold text-foreground">{getLocationName(asset.locationId)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground mb-0.5">Verified At</p>
              <p className="text-sm font-semibold text-foreground">{formatTimestamp(asset.timestamp)}</p>
            </div>
          </div>
        </div>

        {/* Remarks */}
        {asset.remarks && (
          <div className="field-card space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Remarks</h3>
            <p className="text-sm text-foreground leading-relaxed">{asset.remarks}</p>
          </div>
        )}

        {/* GPS */}
        <div className="field-card space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">GPS Location</h3>
          <GPSDisplay
            latitude={asset.gpsCoordinates.latitude}
            longitude={asset.gpsCoordinates.longitude}
          />
        </div>

        {/* Delete action */}
        <div className="pt-2">
          <Button
            variant="destructive"
            className="w-full min-h-[44px] gap-2"
            onClick={() => onDelete(asset)}
          >
            <Trash2 className="w-4 h-4" />
            Delete Asset Record
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: React.ElementType; color: string }) {
  return (
    <div className="field-card flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xl font-bold text-foreground leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { data: assets = [], isLoading, refetch, isFetching } = useGetAllAssets();
  const { refetch: fetchExport } = useExportAssetVerifications();
  const deleteMutation = useDeleteAsset();

  const [filters, setFilters] = useState<FilterState>({
    locationId: '', condition: '', dateFrom: '', dateTo: '', search: ''
  });
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      if (filters.locationId && !asset.locationId.toLowerCase().includes(filters.locationId.toLowerCase())) return false;
      if (filters.condition && asset.condition !== filters.condition) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!asset.assetId.toLowerCase().includes(q) && !asset.name.toLowerCase().includes(q)) return false;
      }
      if (filters.dateFrom || filters.dateTo) {
        const ts = Number(asset.timestamp / BigInt(1_000_000));
        const date = new Date(ts);
        if (filters.dateFrom && date < new Date(filters.dateFrom)) return false;
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          toDate.setHours(23, 59, 59, 999);
          if (date > toDate) return false;
        }
      }
      return true;
    }).sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [assets, filters]);

  const stats = useMemo(() => {
    const total = assets.length;
    const good = assets.filter(a => a.condition === 'Good').length;
    const poor = assets.filter(a => a.condition === 'Poor').length;
    const missing = assets.filter(a => a.condition === 'Missing').length;
    return { total, good, poor, missing };
  }, [assets]);

  const hasActiveFilters = !!(filters.locationId || filters.condition || filters.dateFrom || filters.dateTo || filters.search);

  async function handleExport() {
    setIsExporting(true);
    try {
      const result = await fetchExport();
      const allRecords = result.data ?? [];

      const toExport = allRecords.filter(asset => {
        if (filters.locationId && !asset.locationId.toLowerCase().includes(filters.locationId.toLowerCase())) return false;
        if (filters.condition && asset.condition !== filters.condition) return false;
        if (filters.search) {
          const q = filters.search.toLowerCase();
          if (!asset.assetId.toLowerCase().includes(q) && !asset.name.toLowerCase().includes(q)) return false;
        }
        if (filters.dateFrom || filters.dateTo) {
          const ts = Number(asset.timestamp / BigInt(1_000_000));
          const date = new Date(ts);
          if (filters.dateFrom && date < new Date(filters.dateFrom)) return false;
          if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            if (date > toDate) return false;
          }
        }
        return true;
      }).sort((a, b) => Number(b.timestamp - a.timestamp));

      if (toExport.length === 0) {
        toast.warning('No records to export', { description: 'There are no asset records matching the current filters.' });
        return;
      }

      downloadCSV(toExport);
      toast.success(`Exported ${toExport.length} record${toExport.length !== 1 ? 's' : ''}`, {
        description: 'Your CSV file is ready to open in Google Sheets.',
      });
    } catch {
      toast.error('Export failed', { description: 'Could not fetch asset records. Please try again.' });
    } finally {
      setIsExporting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!assetToDelete) return;
    const id = assetToDelete.assetId;
    const name = assetToDelete.name;
    setAssetToDelete(null);
    try {
      await deleteMutation.mutateAsync(id);
      setSelectedAsset(null);
      toast.success('Asset deleted', {
        description: `"${name}" (${id}) has been permanently removed.`,
      });
    } catch (err) {
      toast.error('Delete failed', {
        description: err instanceof Error ? err.message : 'Could not delete the asset. Please try again.',
      });
    }
  }

  if (selectedAsset) {
    return (
      <>
        <AssetDetailDrawer
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onDelete={(asset) => setAssetToDelete(asset)}
        />
        <AlertDialog open={!!assetToDelete} onOpenChange={(open) => { if (!open) setAssetToDelete(null); }}>
          <AlertDialogContent className="bg-popover border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">Delete Asset Record?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This will permanently delete{' '}
                <span className="font-mono font-semibold text-primary">{assetToDelete?.assetId}</span>
                {assetToDelete?.name ? ` — ${assetToDelete.name}` : ''}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-border text-foreground hover:bg-secondary/50">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">{assets.length} total records</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="min-h-[44px] min-w-[44px]"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      {!isLoading && (
        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Total Assets" value={stats.total} icon={Package} color="bg-primary/20 text-primary" />
          <StatCard label="Good Condition" value={stats.good} icon={TrendingUp} color="bg-green-900/40 text-green-400" />
          <StatCard label="Poor Condition" value={stats.poor} icon={AlertTriangle} color="bg-red-900/40 text-red-400" />
          <StatCard label="Missing" value={stats.missing} icon={MapPin} color="bg-gray-900/40 text-gray-400" />
        </div>
      )}

      {/* Filter toggle + Export */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="min-h-[40px] text-sm border-border text-foreground hover:bg-secondary/50"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {hasActiveFilters && (
            <span className="ml-1.5 w-2 h-2 rounded-full bg-primary inline-block" />
          )}
        </Button>

        {filteredAssets.length !== assets.length && (
          <span className="text-xs text-muted-foreground">
            {filteredAssets.length} of {assets.length} shown
          </span>
        )}

        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting || isLoading}
            className="min-h-[40px] text-sm border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60 gap-1.5"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            {isExporting ? 'Exporting…' : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* Export info banner */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary">
          <Download className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Export will include only the <strong>{filteredAssets.length}</strong> filtered record{filteredAssets.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {showFilters && (
        <AssetFilters filters={filters} onChange={setFilters} />
      )}

      {/* Asset list */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="field-card">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-md bg-secondary/50" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24 bg-secondary/50" />
                  <Skeleton className="h-4 w-40 bg-secondary/50" />
                  <Skeleton className="h-3 w-32 bg-secondary/50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AssetTable assets={filteredAssets} onSelect={setSelectedAsset} />
      )}

      {/* Delete confirmation dialog (shown from list view if needed) */}
      <AlertDialog open={!!assetToDelete && !selectedAsset} onOpenChange={(open) => { if (!open) setAssetToDelete(null); }}>
        <AlertDialogContent className="bg-popover border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Asset Record?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete{' '}
              <span className="font-mono font-semibold text-primary">{assetToDelete?.assetId}</span>
              {assetToDelete?.name ? ` — ${assetToDelete.name}` : ''}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground hover:bg-secondary/50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
