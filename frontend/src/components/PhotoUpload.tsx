import { useRef, useState } from 'react';
import { Camera, X, ImagePlus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { compressImage } from '../utils/imageCompression';

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  error?: string;
  maxPhotos?: number;
}

export function PhotoUpload({ photos, onChange, error, maxPhotos = 5 }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const remaining = maxPhotos - photos.length;
      const filesToProcess = files.slice(0, remaining);
      const compressed = await Promise.all(filesToProcess.map(f => compressImage(f)));
      onChange([...photos, ...compressed]);
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
              <img
                src={photo}
                alt={`Asset photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-destructive/90 text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation"
                style={{ minHeight: 'unset' }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded font-mono">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {photos.length < maxPhotos && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className={`
              flex flex-col items-center justify-center gap-2 w-full
              min-h-[120px] rounded-lg border-2 border-dashed cursor-pointer
              transition-colors touch-manipulation
              ${error
                ? 'border-destructive/60 bg-destructive/5 hover:bg-destructive/10'
                : 'border-border hover:border-primary/60 bg-secondary/30 hover:bg-secondary/50'
              }
              ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Processing...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Camera className="w-6 h-6 text-primary" />
                  <ImagePlus className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {photos.length === 0 ? 'Add Photo (Required)' : 'Add More Photos'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tap to use camera or choose from gallery
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {photos.length}/{maxPhotos} photos
                  </p>
                </div>
              </>
            )}
          </label>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
