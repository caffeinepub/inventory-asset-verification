import { useRef, useState } from 'react';
import { Camera, X, ImagePlus, AlertCircle, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { compressImage } from '../utils/imageCompression';

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  error?: string;
  maxPhotos?: number;
}

export function PhotoUpload({ photos, onChange, error, maxPhotos = 5 }: PhotoUploadProps) {
  // Two separate refs: one for camera capture, one for gallery/file picker
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = async (files: File[]) => {
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
      // Reset both inputs so the same file can be selected again
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleCameraChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
  };

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
  };

  const handleCameraClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleGalleryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const canAddMore = photos.length < maxPhotos;

  return (
    <div className="space-y-3">
      {/* Hidden camera input — capture="environment" forces rear camera on mobile */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />
      {/* Hidden gallery input — no capture attribute so OS shows file picker / gallery */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleGalleryChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

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
                className="absolute top-1 right-1 bg-destructive/90 text-destructive-foreground rounded-full p-1 opacity-80 group-hover:opacity-100 transition-opacity touch-manipulation"
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

      {/* Upload buttons */}
      {canAddMore && (
        <div className="space-y-2">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center gap-2 w-full min-h-[80px] rounded-lg border-2 border-dashed border-border bg-secondary/30">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">Processing photo...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {/* Camera button */}
              <button
                type="button"
                onClick={handleCameraClick}
                className={`
                  flex flex-col items-center justify-center gap-2
                  min-h-[80px] rounded-lg border-2 cursor-pointer
                  transition-colors touch-manipulation select-none
                  active:scale-95
                  ${error
                    ? 'border-destructive/60 bg-destructive/5 hover:bg-destructive/10'
                    : 'border-border hover:border-primary/60 bg-secondary/30 hover:bg-secondary/50'
                  }
                `}
              >
                <Camera className="w-6 h-6 text-primary" />
                <span className="text-xs font-semibold text-foreground">Take Photo</span>
              </button>

              {/* Gallery button */}
              <button
                type="button"
                onClick={handleGalleryClick}
                className={`
                  flex flex-col items-center justify-center gap-2
                  min-h-[80px] rounded-lg border-2 cursor-pointer
                  transition-colors touch-manipulation select-none
                  active:scale-95
                  ${error
                    ? 'border-destructive/60 bg-destructive/5 hover:bg-destructive/10'
                    : 'border-border hover:border-primary/60 bg-secondary/30 hover:bg-secondary/50'
                  }
                `}
              >
                <FolderOpen className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">Upload from Gallery</span>
              </button>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            {photos.length === 0
              ? <span className="text-destructive font-medium">At least 1 photo required</span>
              : `${photos.length}/${maxPhotos} photos added`
            }
          </p>
        </div>
      )}

      {photos.length >= maxPhotos && (
        <p className="text-xs text-muted-foreground text-center">
          Maximum {maxPhotos} photos reached
        </p>
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
