import { ChevronRight, Package } from 'lucide-react';
import type { Asset } from '../backend';
import { formatTimestamp } from '../utils/formatTimestamp';
import { getLocationName } from '../constants/locations';
import { Badge } from '@/components/ui/badge';

interface AssetTableProps {
  assets: Asset[];
  onSelect: (asset: Asset) => void;
}

function ConditionBadge({ condition }: { condition: string }) {
  const variants: Record<string, string> = {
    Good: 'status-good',
    Fair: 'status-fair',
    Poor: 'status-poor',
    Missing: 'status-missing',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${variants[condition] ?? 'bg-secondary text-foreground'}`}>
      {condition}
    </span>
  );
}

const PAGE_SIZE = 20;

export function AssetTable({ assets, onSelect }: AssetTableProps) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
        <Package className="w-12 h-12 opacity-30" />
        <p className="text-sm font-medium">No assets found</p>
        <p className="text-xs">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {assets.slice(0, PAGE_SIZE).map((asset) => (
        <button
          key={asset.assetId}
          type="button"
          onClick={() => onSelect(asset)}
          className="w-full text-left field-card hover:border-primary/50 hover:bg-card/80 transition-all touch-manipulation active:scale-[0.99] min-h-[72px]"
        >
          <div className="flex items-center gap-3">
            {/* Photo thumbnail */}
            <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary/50 flex-shrink-0">
              {asset.photos.length > 0 ? (
                <img
                  src={asset.photos[0]}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-xs text-primary font-semibold truncate">{asset.assetId}</span>
                <ConditionBadge condition={asset.condition} />
              </div>
              <p className="text-sm font-semibold text-foreground truncate">{asset.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground truncate">{getLocationName(asset.locationId)}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{formatTimestamp(asset.timestamp)}</span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </div>
        </button>
      ))}

      {assets.length > PAGE_SIZE && (
        <p className="text-center text-xs text-muted-foreground py-2">
          Showing {PAGE_SIZE} of {assets.length} records. Use filters to narrow results.
        </p>
      )}
    </div>
  );
}
