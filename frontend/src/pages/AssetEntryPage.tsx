import { ClipboardCheck } from 'lucide-react';
import { AssetEntryForm } from '../components/AssetEntryForm';

export function AssetEntryPage() {
  return (
    <div className="space-y-4 animate-slide-up">
      {/* Page header */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <ClipboardCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Asset Verification</h1>
          <p className="text-xs text-muted-foreground">Physical audit entry form</p>
        </div>
      </div>

      <AssetEntryForm />
    </div>
  );
}
