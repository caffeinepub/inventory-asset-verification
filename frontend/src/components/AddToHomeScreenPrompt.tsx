import { useState, useEffect } from 'react';
import { X, Share, MoreVertical, Plus } from 'lucide-react';

const DISMISSED_KEY = 'a2hs-prompt-dismissed';

function isMobileDevice(): boolean {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

function isInStandaloneMode(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
  );
}

export function AddToHomeScreenPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;
    if (!isMobileDevice()) return;
    if (isInStandaloneMode()) return;

    // Small delay so it doesn't flash immediately on load
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
  }

  if (!visible) return null;

  const ios = isIOS();
  const android = isAndroid();

  return (
    <div
      className="fixed bottom-20 left-3 right-3 z-50 animate-slide-up"
      role="dialog"
      aria-label="Add to Home Screen"
    >
      <div className="bg-card border border-amber-500/40 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Amber top accent bar */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        <div className="p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/asset-audit-logo.dim_128x128.png"
                alt="App icon"
                className="w-10 h-10 rounded-xl border border-border flex-shrink-0"
              />
              <div>
                <p className="text-sm font-bold text-foreground leading-tight">
                  Install Asset Audit
                </p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                  Add to your home screen for quick access
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 w-8 h-8 min-h-0 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-secondary/60 rounded-lg p-3 space-y-2">
            {ios && (
              <>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  iOS Safari
                </p>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <span className="flex-shrink-0 w-6 h-6 min-h-0 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-bold">
                    1
                  </span>
                  <span className="flex items-center gap-1.5">
                    Tap the{' '}
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-secondary rounded border border-border text-xs font-medium">
                      <Share className="w-3 h-3" /> Share
                    </span>{' '}
                    button in Safari
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <span className="flex-shrink-0 w-6 h-6 min-h-0 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-bold">
                    2
                  </span>
                  <span className="flex items-center gap-1.5">
                    Select{' '}
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-secondary rounded border border-border text-xs font-medium">
                      <Plus className="w-3 h-3" /> Add to Home Screen
                    </span>
                  </span>
                </div>
              </>
            )}

            {android && (
              <>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  Android Chrome
                </p>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <span className="flex-shrink-0 w-6 h-6 min-h-0 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-bold">
                    1
                  </span>
                  <span className="flex items-center gap-1.5">
                    Tap the{' '}
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-secondary rounded border border-border text-xs font-medium">
                      <MoreVertical className="w-3 h-3" /> Menu
                    </span>{' '}
                    in Chrome
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <span className="flex-shrink-0 w-6 h-6 min-h-0 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-bold">
                    2
                  </span>
                  <span className="flex items-center gap-1.5">
                    Select{' '}
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-secondary rounded border border-border text-xs font-medium">
                      <Plus className="w-3 h-3" /> Add to Home Screen
                    </span>
                  </span>
                </div>
              </>
            )}

            {!ios && !android && (
              <>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  Install App
                </p>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <span className="flex-shrink-0 w-6 h-6 min-h-0 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-bold">
                    1
                  </span>
                  <span>Open your browser menu</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <span className="flex-shrink-0 w-6 h-6 min-h-0 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs font-bold">
                    2
                  </span>
                  <span>Select "Add to Home Screen"</span>
                </div>
              </>
            )}
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="mt-3 w-full py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
