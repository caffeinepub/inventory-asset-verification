import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

export interface FilterState {
  locationId: string;
  condition: string;
  dateFrom: string;
  dateTo: string;
  search: string;
}

interface AssetFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const CONDITIONS = ['Good', 'Fair', 'Poor', 'Missing'];

export function AssetFilters({ filters, onChange }: AssetFiltersProps) {
  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.locationId || filters.condition || filters.dateFrom || filters.dateTo || filters.search;

  const clearAll = () => {
    onChange({ locationId: '', condition: '', dateFrom: '', dateTo: '', search: '' });
  };

  return (
    <div className="field-card space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <div>
        <Input
          value={filters.search}
          onChange={e => update('search', e.target.value)}
          placeholder="Search by ID or name..."
          className="min-h-[40px] bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Location filter */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</Label>
          <Input
            value={filters.locationId}
            onChange={e => update('locationId', e.target.value)}
            placeholder="Filter by location"
            className="min-h-[40px] bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground text-sm"
          />
        </div>

        {/* Condition filter */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Condition</Label>
          <Select value={filters.condition || 'all'} onValueChange={v => update('condition', v === 'all' ? '' : v)}>
            <SelectTrigger className="min-h-[40px] bg-secondary/50 border-border text-foreground text-sm">
              <SelectValue placeholder="All conditions" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all" className="text-foreground">All Conditions</SelectItem>
              {CONDITIONS.map(cond => (
                <SelectItem key={cond} value={cond} className="text-foreground text-sm">
                  {cond}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date range */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">From</Label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={e => update('dateFrom', e.target.value)}
            className="min-h-[40px] bg-secondary/50 border-border text-foreground text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">To</Label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={e => update('dateTo', e.target.value)}
            className="min-h-[40px] bg-secondary/50 border-border text-foreground text-sm"
          />
        </div>
      </div>
    </div>
  );
}
