import { Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UserAuthButton from '../auth/UserAuthButton';
import AdminAuthControls from '../auth/AdminAuthControls';

interface TopNavProps {
  currentView: 'home' | 'manage';
  onNavigate: (view: 'home' | 'manage') => void;
  isAdmin: boolean;
  onAdminGranted?: () => void;
}

export default function TopNav({ currentView, onNavigate, isAdmin, onAdminGranted }: TopNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-display font-bold tracking-tight text-foreground">
            TV Streaming Network
          </h1>
        </div>
        <nav className="flex items-center gap-2">
          <Button
            variant={currentView === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('home')}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          {isAdmin && (
            <Button
              variant={currentView === 'manage' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('manage')}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Manage Videos</span>
            </Button>
          )}
          <Separator orientation="vertical" className="h-6 mx-1" />
          <UserAuthButton />
          <AdminAuthControls onAdminGranted={onAdminGranted} />
        </nav>
      </div>
    </header>
  );
}
