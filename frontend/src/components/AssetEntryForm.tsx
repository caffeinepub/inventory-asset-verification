import { useState, useCallback } from 'react';
import {
  MapPin, Clock, CheckCircle2, AlertCircle, Loader2,
  Navigation, WifiOff, CloudUpload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { PhotoUpload } from './PhotoUpload';
import { GPSDisplay } from './GPSDisplay';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSubmitAssetCheck } from '../hooks/useQueries';
import { offlineQueue } from '../services/offlineQueue';
import { CATEGORIES } from '../constants/categories';

const CONDITIONS = [
  { value: 'Good', label: 'Good', color: 'text-green-400' },
  { value: 'Fair', label: 'Fair', color: 'text-yellow-400' },
  { value: 'Poor', label: 'Poor', color: 'text-red-400' },
  { value: 'Missing', label: 'Missing', color: 'text-gray-400' },
];

interface FormData {
  assetId: string;
  name: string;
  category: string;
  locationId: string;
  condition: string;
  remarks: string;
}

interface FormErrors {
  assetId?: string;
  name?: string;
  category?: string;
  locationId?: string;
  condition?: string;
  photos?: string;
  gps?: string;
}

interface AssetEntryFormProps {
  onSuccess?: () => void;
}

export function AssetEntryForm({ onSuccess }: AssetEntryFormProps) {
  const [formData, setFormData] = useState<FormData>({
    assetId: '',
    name: '',
    category: '',
    locationId: '',
    condition: '',
    remarks: '',
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<'idle' | 'capturing-gps' | 'submitting' | 'success' | 'queued' | 'error'>('idle');
  const [capturedGPS, setCapturedGPS] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);
  const [isCapturingGPS, setIsCapturingGPS] = useState(false);

  const geo = useGeolocation();
  const submitMutation = useSubmitAssetCheck();

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.assetId.trim()) newErrors.assetId = 'Asset ID is required';
    if (!formData.name.trim()) newErrors.name = 'Asset name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.locationId.trim()) newErrors.locationId = 'Location is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (photos.length === 0) newErrors.photos = 'At least one photo is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, photos]);

  // Manual GPS capture button handler
  const handleCaptureGPS = async () => {
    setIsCapturingGPS(true);
    setErrors(prev => ({ ...prev, gps: undefined }));
    try {
      const coords = await geo.capture();
      setCapturedGPS({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy ?? undefined,
      });
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        gps: err instanceof Error ? err.message : 'Failed to capture GPS location',
      }));
    } finally {
      setIsCapturingGPS(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitState('capturing-gps');
    setErrors({});

    let gps = capturedGPS;

    if (!gps) {
      try {
        const coords = await geo.capture();
        gps = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy ?? undefined,
        };
        setCapturedGPS(gps);
      } catch (err) {
        setErrors({ gps: err instanceof Error ? err.message : 'Failed to capture GPS location' });
        setSubmitState('idle');
        return;
      }
    }

    const isOnline = navigator.onLine;

    if (!isOnline) {
      offlineQueue.add({
        assetId: formData.assetId,
        name: formData.name,
        category: formData.category,
        locationId: formData.locationId,
        condition: formData.condition,
        remarks: formData.remarks,
        latitude: gps.latitude,
        longitude: gps.longitude,
        photos,
        timestamp: Date.now(),
      });
      setSubmitState('queued');
      return;
    }

    setSubmitState('submitting');
    try {
      await submitMutation.mutateAsync({
        assetId: formData.assetId,
        name: formData.name,
        category: formData.category,
        locationId: formData.locationId,
        condition: formData.condition,
        remarks: formData.remarks,
        latitude: gps.latitude,
        longitude: gps.longitude,
        photos,
      });
      setSubmitState('success');
      onSuccess?.();
    } catch (err) {
      setSubmitState('error');
    }
  };

  const handleReset = () => {
    setFormData({ assetId: '', name: '', category: '', locationId: '', condition: '', remarks: '' });
    setPhotos([]);
    setErrors({});
    setSubmitState('idle');
    setCapturedGPS(null);
    setIsCapturingGPS(false);
    geo.reset();
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isSubmitting = submitState === 'capturing-gps' || submitState === 'submitting';

  if (submitState === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 animate-slide-up">
        <div className="w-16 h-16 rounded-full bg-green-900/40 border border-green-700/50 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Verification Submitted!</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Asset <span className="text-primary font-mono font-semibold">{formData.assetId}</span> has been recorded.
          </p>
        </div>
        {capturedGPS && (
          <GPSDisplay latitude={capturedGPS.latitude} longitude={capturedGPS.longitude} accuracy={capturedGPS.accuracy} />
        )}
        <div className="flex gap-3 mt-2">
          <Button onClick={handleReset} className="min-h-[44px] px-6">
            Verify Another Asset
          </Button>
        </div>
      </div>
    );
  }

  if (submitState === 'queued') {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 animate-slide-up">
        <div className="w-16 h-16 rounded-full bg-amber-900/40 border border-amber-700/50 flex items-center justify-center">
          <CloudUpload className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Saved Offline</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Submission queued. Will sync automatically when online.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-4 py-2">
          <WifiOff className="w-4 h-4" />
          <span>No internet connection detected</span>
        </div>
        <Button onClick={handleReset} className="min-h-[44px] px-6">
          Verify Another Asset
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Timestamp display */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2">
        <Clock className="w-3.5 h-3.5 text-primary" />
        <span>Auto-timestamp: <span className="text-foreground font-medium">{new Date().toLocaleString()}</span></span>
      </div>

      {/* Asset ID */}
      <div className="field-card space-y-2">
        <Label htmlFor="assetId" className="form-label">Asset ID *</Label>
        <Input
          id="assetId"
          value={formData.assetId}
          onChange={e => updateField('assetId', e.target.value)}
          placeholder="e.g. ASSET-001, EQ-2024-045"
          className={`font-mono min-h-[44px] bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground ${errors.assetId ? 'border-destructive' : ''}`}
          disabled={isSubmitting}
        />
        {errors.assetId && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{errors.assetId}
          </p>
        )}
      </div>

      {/* Asset Name */}
      <div className="field-card space-y-2">
        <Label htmlFor="name" className="form-label">Asset Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={e => updateField('name', e.target.value)}
          placeholder="e.g. Dell Laptop, Forklift #3"
          className={`min-h-[44px] bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground ${errors.name ? 'border-destructive' : ''}`}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{errors.name}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="field-card space-y-2">
        <Label className="form-label">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={v => updateField('category', v)}
          disabled={isSubmitting}
        >
          <SelectTrigger className={`min-h-[44px] bg-secondary/50 border-border text-foreground ${errors.category ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Select category..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {CATEGORIES.map(cat => (
              <SelectItem key={cat.id} value={cat.id} className="min-h-[44px] text-foreground">
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{errors.category}
          </p>
        )}
      </div>

      {/* Location */}
      <div className="field-card space-y-2">
        <Label htmlFor="locationId" className="form-label">Location *</Label>
        <Input
          id="locationId"
          value={formData.locationId}
          onChange={e => updateField('locationId', e.target.value)}
          placeholder="e.g. Warehouse A, Building 3, Field Site 2"
          className={`min-h-[44px] bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground ${errors.locationId ? 'border-destructive' : ''}`}
          disabled={isSubmitting}
        />
        {errors.locationId && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{errors.locationId}
          </p>
        )}
      </div>

      {/* Condition */}
      <div className="field-card space-y-2">
        <Label className="form-label">Condition *</Label>
        <div className="grid grid-cols-2 gap-2">
          {CONDITIONS.map(cond => (
            <button
              key={cond.value}
              type="button"
              onClick={() => updateField('condition', cond.value)}
              disabled={isSubmitting}
              className={`
                min-h-[44px] rounded-lg border-2 font-semibold text-sm transition-all touch-manipulation
                ${formData.condition === cond.value
                  ? `border-primary bg-primary/10 ${cond.color}`
                  : 'border-border bg-secondary/30 text-muted-foreground hover:border-border/80'
                }
              `}
            >
              {cond.label}
            </button>
          ))}
        </div>
        {errors.condition && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />{errors.condition}
          </p>
        )}
      </div>

      {/* Remarks */}
      <div className="field-card space-y-2">
        <Label htmlFor="remarks" className="form-label">Remarks / Notes</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={e => updateField('remarks', e.target.value)}
          placeholder="Additional observations, serial numbers, damage notes..."
          rows={3}
          className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground resize-none"
          disabled={isSubmitting}
        />
      </div>

      {/* Photo Upload */}
      <div className="field-card space-y-2">
        <Label className="form-label">Photos *</Label>
        <PhotoUpload
          photos={photos}
          onChange={setPhotos}
          error={errors.photos}
        />
      </div>

      {/* GPS Location */}
      <div className="field-card space-y-2">
        <Label className="form-label flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-primary" />
          GPS Location
        </Label>

        {capturedGPS ? (
          <div className="space-y-2">
            <GPSDisplay
              latitude={capturedGPS.latitude}
              longitude={capturedGPS.longitude}
              accuracy={capturedGPS.accuracy}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCaptureGPS}
              disabled={isCapturingGPS || isSubmitting}
              className="w-full min-h-[40px] text-xs border-border text-muted-foreground hover:text-foreground"
            >
              {isCapturingGPS ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Updating GPS...
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5 mr-1.5" />
                  Refresh GPS Location
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span>GPS will be captured automatically on submission, or tap below to capture now.</span>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleCaptureGPS}
              disabled={isCapturingGPS || isSubmitting}
              className="w-full min-h-[44px] border-primary/40 text-primary hover:bg-primary/10 hover:border-primary touch-manipulation"
            >
              {isCapturingGPS ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Capturing GPS...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Capture GPS Location Now
                </>
              )}
            </Button>
          </div>
        )}

        {errors.gps && (
          <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errors.gps}</span>
          </div>
        )}
      </div>

      {/* Submit error */}
      {submitState === 'error' && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Submission failed. Please try again.</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full min-h-[52px] text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-amber"
      >
        {submitState === 'capturing-gps' ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Capturing GPS...
          </>
        ) : submitState === 'submitting' ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Submit Verification
          </>
        )}
      </Button>
    </form>
  );
}
