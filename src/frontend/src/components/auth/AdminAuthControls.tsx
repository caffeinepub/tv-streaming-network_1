import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from '../../hooks/useAdmin';
import { useAdminToken } from '../../hooks/useAdminToken';
import { Button } from '@/components/ui/button';
import { Shield, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';
import AdminTokenDialog from './AdminTokenDialog';

interface AdminAuthControlsProps {
  onAdminGranted?: () => void;
}

export default function AdminAuthControls({ onAdminGranted }: AdminAuthControlsProps) {
  const { identity } = useInternetIdentity();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { clearAdminToken } = useAdminToken();
  const [dialogOpen, setDialogOpen] = useState(false);

  const isAuthenticated = !!identity;

  const handleAdminSignIn = () => {
    if (!isAuthenticated) {
      toast.error('Sign in required', {
        description: 'Please sign in with your account before accessing admin features.',
      });
      return;
    }
    setDialogOpen(true);
  };

  const handleClearAdminAccess = () => {
    clearAdminToken();
    toast.success('Admin access cleared', {
      description: 'You have been signed out of admin mode.',
    });
  };

  const handleAdminSuccess = () => {
    // Call the callback to navigate to manage view
    if (onAdminGranted) {
      onAdminGranted();
    }
  };

  // Don't show anything while checking admin status
  if (isAdminLoading) {
    return null;
  }

  return (
    <>
      {isAdmin ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAdminAccess}
          className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <ShieldOff className="h-4 w-4" />
          <span className="hidden sm:inline">Clear Admin Access</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdminSignIn}
          className="gap-2"
        >
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Admin Sign In</span>
        </Button>
      )}
      <AdminTokenDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSuccess={handleAdminSuccess}
      />
    </>
  );
}
