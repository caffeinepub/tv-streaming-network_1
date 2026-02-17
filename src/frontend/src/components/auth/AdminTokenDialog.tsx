import { useState } from 'react';
import { useAdminToken } from '../../hooks/useAdminToken';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AdminTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AdminTokenDialog({ open, onOpenChange, onSuccess }: AdminTokenDialogProps) {
  const [token, setToken] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { applyAdminToken } = useAdminToken();

  const handleApply = async () => {
    if (!token.trim()) {
      setError('Please enter an admin token');
      return;
    }

    setIsApplying(true);
    setError(null);
    
    try {
      // Apply the token and wait for admin status confirmation
      const isAdmin = await applyAdminToken(token.trim());
      
      if (isAdmin) {
        // Success - close dialog and reset
        onOpenChange(false);
        setToken('');
        setError(null);
        
        toast.success('Admin access granted', {
          description: 'You now have access to the management dashboard.',
        });
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        // Token was accepted but admin status is still false
        setError('Invalid admin code. Please check and try again.');
        toast.error('Invalid admin code', {
          description: 'The code you entered is incorrect.',
        });
      }
    } catch (error: any) {
      console.error('Error applying admin token:', error);
      
      // Parse error message from backend
      let errorMessage = 'Failed to apply admin token';
      if (error.message) {
        if (error.message.includes('Invalid code')) {
          errorMessage = 'Invalid admin code. Please check and try again.';
        } else if (error.message.includes('authenticated')) {
          errorMessage = 'You must be signed in to use admin features.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      toast.error('Admin sign in failed', {
        description: errorMessage,
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleCancel = () => {
    setToken('');
    setError(null);
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isApplying) {
      setToken('');
      setError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Sign In</DialogTitle>
          <DialogDescription>
            Enter your admin code to access administrative features.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="admin-token">Admin Code</Label>
            <Input
              id="admin-token"
              type="password"
              placeholder="Enter admin code"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isApplying) {
                  handleApply();
                }
              }}
              disabled={isApplying}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isApplying}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={isApplying || !token.trim()}
          >
            {isApplying ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Verifying...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
