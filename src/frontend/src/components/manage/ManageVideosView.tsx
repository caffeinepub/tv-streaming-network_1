import { useState } from 'react';
import { Plus, AlertCircle, ShieldAlert } from 'lucide-react';
import { useVideos } from '../../hooks/useVideos';
import { useIsAdmin } from '../../hooks/useAdmin';
import VideoForm from './VideoForm';
import VideoListItem from './VideoListItem';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Video } from '../../backend';

export default function ManageVideosView() {
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { data: videos, isLoading: isVideosLoading, error } = useVideos();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingVideo(null);
  };

  // Show loading state while checking admin status
  if (isAdminLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-5 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <ShieldAlert className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Access Denied</AlertTitle>
            <AlertDescription className="mt-2">
              This area is restricted to administrators only. Please sign in with admin credentials to access the video management dashboard.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Admin is verified, show the management interface
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Manage Videos</h2>
            <p className="text-muted-foreground mt-1">
              Add, edit, or remove videos from your collection
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Video
          </Button>
        </div>

        {isFormOpen && (
          <VideoForm video={editingVideo} onClose={handleCloseForm} />
        )}

        {isVideosLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Videos</AlertTitle>
            <AlertDescription>
              {error instanceof Error && error.message.includes('Unauthorized')
                ? 'Your admin session may have expired. Please sign in again with admin credentials.'
                : 'Failed to load videos. Please try again later.'}
            </AlertDescription>
          </Alert>
        )}

        {!isVideosLoading && !error && videos && videos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-lg">
            <div className="rounded-full bg-muted p-6 mb-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-2">No videos yet</h3>
            <p className="text-muted-foreground max-w-md mb-4">
              Get started by adding your first video to your collection.
            </p>
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Video
            </Button>
          </div>
        )}

        {!isVideosLoading && !error && videos && videos.length > 0 && (
          <div className="space-y-3">
            {videos.map((video) => (
              <VideoListItem
                key={video.id.toString()}
                video={video}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
