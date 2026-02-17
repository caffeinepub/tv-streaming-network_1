import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useIsAdmin() {
  const { actor, isFetching: isActorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isActorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: isActorFetching || query.isLoading,
    isAdmin: query.data ?? false,
  };
}
