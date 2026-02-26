import { Link } from '@tanstack/react-router';
import { ClipboardCheck, LayoutDashboard, Shield, Wifi, Camera, MapPin } from 'lucide-react';

export function HomePage() {
  return (
    <div className="space-y-6 py-4 animate-slide-up">
      {/* Hero */}
      <div className="text-center space-y-3 pt-4">
        <div className="flex justify-center">
          <img
            src="/assets/generated/asset-audit-logo.dim_128x128.png"
            alt="AssetVerify"
            className="w-20 h-20 rounded-2xl shadow-amber"
          />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">AssetVerify</h1>
          <p className="text-sm text-muted-foreground mt-1">Field Audit & Physical Verification System</p>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/30 rounded-full px-3 py-1">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">Blockchain-Secured Records</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-3">
        <Link
          to="/entry"
          className="field-card flex items-center gap-4 hover:border-primary/50 transition-all touch-manipulation active:scale-[0.99] min-h-[80px]"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <ClipboardCheck className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-foreground">Verify Asset</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Submit a new physical verification with GPS & photo</p>
          </div>
          <span className="text-muted-foreground text-lg">→</span>
        </Link>

        <Link
          to="/admin"
          className="field-card flex items-center gap-4 hover:border-primary/50 transition-all touch-manipulation active:scale-[0.99] min-h-[80px]"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary/80 border border-border flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-foreground">Admin Dashboard</h2>
            <p className="text-xs text-muted-foreground mt-0.5">View all submissions, filter and drill into records</p>
          </div>
          <span className="text-muted-foreground text-lg">→</span>
        </Link>
      </div>

      {/* Features */}
      <div className="field-card space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Features</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: MapPin, label: 'GPS Capture', desc: 'Auto location tagging' },
            { icon: Camera, label: 'Photo Proof', desc: 'Mandatory photo upload' },
            { icon: Wifi, label: 'Offline Mode', desc: 'Works without internet' },
            { icon: Shield, label: 'Tamper-proof', desc: 'On-chain storage' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/30">
              <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-4">
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
      </div>
    </div>
  );
}
