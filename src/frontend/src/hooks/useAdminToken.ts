import { useQueryClient } from '@tanstack/react-query';
import { storeSessionParameter, clearSessionParameter } from '../utils/urlParams';
import { useActor } from './useActor';

/**
 * Hook to manage admin token for session-based admin access
 * Stores token in sessionStorage and triggers actor/admin state re-evaluation
 */
export function useAdminToken() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  const applyAdminToken = async (token: string): Promise<boolean> => {
    if (!actor) {
      throw new Error('Actor not available');
    }

    try {
      // Call the backend loginAsAdmin method with the token
      await actor.loginAsAdmin(token);
      
      // Store token in session storage for persistence
      storeSessionParameter('caffeineAdminToken', token);
      
      // Invalidate actor query to force re-creation with new token
      queryClient.invalidateQueries({ queryKey: ['actor'] });
      
      // Invalidate admin-dependent queries
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      
      // Wait for admin status to be refetched
      await queryClient.refetchQueries({ queryKey: ['isAdmin'] });
      
      // Check if admin status is now true
      const isAdminData = queryClient.getQueryData<boolean>(['isAdmin']);
      return isAdminData === true;
    } catch (error: any) {
      // Clear token on failure
      clearSessionParameter('caffeineAdminToken');
      throw error;
    }
  };

  const clearAdminToken = () => {
    // Remove token from session storage
    clearSessionParameter('caffeineAdminToken');
    
    // Invalidate actor query to force re-creation without token
    queryClient.invalidateQueries({ queryKey: ['actor'] });
    
    // Invalidate admin-dependent queries
    queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    queryClient.invalidateQueries({ queryKey: ['videos'] });
  };

  return {
    applyAdminToken,
    clearAdminToken,
  };
}
