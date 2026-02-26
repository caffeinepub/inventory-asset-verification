import { useState, useCallback } from 'react';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: false,
    error: null,
  });

  const capture = useCallback((): Promise<{ latitude: number; longitude: number; accuracy: number | null }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = 'Geolocation is not supported by this device/browser.';
        setState(prev => ({ ...prev, error: err, loading: false }));
        reject(new Error(err));
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setState({ latitude, longitude, accuracy, loading: false, error: null });
          // Return accuracy directly from the position object so callers don't
          // need to read it from React state (which may not have updated yet).
          resolve({ latitude, longitude, accuracy });
        },
        (err) => {
          let message = 'Unable to retrieve location.';
          if (err.code === err.PERMISSION_DENIED) {
            message = 'Location permission denied. Please enable GPS access in your browser settings.';
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            message = 'Location information is unavailable. Please try again.';
          } else if (err.code === err.TIMEOUT) {
            message = 'Location request timed out. Please try again.';
          }
          setState(prev => ({ ...prev, loading: false, error: message }));
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 30000,
        }
      );
    });
  }, []);

  const reset = useCallback(() => {
    setState({ latitude: null, longitude: null, accuracy: null, loading: false, error: null });
  }, []);

  return { ...state, capture, reset };
}
