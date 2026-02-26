import { MapPin, Navigation } from 'lucide-react';

interface GPSDisplayProps {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  compact?: boolean;
}

export function GPSDisplay({ latitude, longitude, accuracy, compact = false }: GPSDisplayProps) {
  const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  if (compact) {
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="font-mono text-xs">
          {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </span>
      </a>
    );
  }

  return (
    <div className="bg-secondary/50 rounded-lg p-3 border border-border">
      <div className="flex items-center gap-2 mb-2">
        <Navigation className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          GPS Coordinates
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Latitude</p>
          <p className="font-mono text-sm font-semibold text-foreground">{latitude.toFixed(6)}°</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Longitude</p>
          <p className="font-mono text-sm font-semibold text-foreground">{longitude.toFixed(6)}°</p>
        </div>
      </div>
      {accuracy != null && (
        <p className="text-xs text-muted-foreground mb-2">
          Accuracy: ±{Math.round(accuracy)}m
        </p>
      )}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
      >
        <MapPin className="w-3 h-3" />
        View on Maps
      </a>
    </div>
  );
}
