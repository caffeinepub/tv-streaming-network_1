import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Video, Genre } from '../backend';

export function useVideos() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVideos();
    },
    enabled: !!actor && !isActorFetching,
  });
}

export function useOriginalShows() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['originalShows'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOriginalShows();
    },
    enabled: !!actor && !isActorFetching,
  });
}

export function useCreateVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; description: string | null; youtubeUrl: string; genre: Genre; isOriginal: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createVideo(data.title, data.description, data.youtubeUrl, data.genre, data.isOriginal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['originalShows'] });
    },
  });
}

export function useUpdateVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; title: string; description: string | null; youtubeUrl: string; genre: Genre; isOriginal: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateVideo(data.id, data.title, data.description, data.youtubeUrl, data.genre, data.isOriginal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['originalShows'] });
    },
  });
}

export function useDeleteVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteVideo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['originalShows'] });
    },
  });
}
