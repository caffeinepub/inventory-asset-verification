import { Link, useLocation } from '@tanstack/react-router';
import { ClipboardCheck, LayoutDashboard, PlusCircle } from 'lucide-react';
import { OfflineSyncIndicator } from './OfflineSyncIndicator';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/entry', label: 'Verify Asset', icon: PlusCircle },
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950 border-b border-border shadow-card">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 touch-manipulation">
            <img
              src="/assets/generated/asset-audit-logo.dim_128x128.png"
              alt="Asset Audit"
              className="w-8 h-8 rounded-md"
            />
            <div className="leading-tight">
              <p className="text-sm font-bold text-foreground tracking-tight">AssetVerify</p>
              <p className="text-xs text-muted-foreground hidden sm:block">Field Audit System</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <OfflineSyncIndicator />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 pb-24">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-border">
        <div className="max-w-2xl mx-auto flex">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
            return (
              <Link
                key={path}
                to={path}
                className={`
                  flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px]
                  transition-colors touch-manipulation
                  ${isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                <span className="text-xs font-semibold">{label}</span>
                {isActive && (
                  <span className="absolute bottom-0 w-12 h-0.5 bg-primary rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <footer className="hidden max-w-2xl mx-auto w-full px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} AssetVerify &mdash; Built with{' '}
          <span className="text-destructive">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'asset-verify')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
