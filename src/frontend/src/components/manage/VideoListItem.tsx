import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useDeleteVideo } from '../../hooks/useVideos';
import { getYouTubeThumbnail } from '../../utils/youtube';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { Video } from '../../backend';

interface VideoListItemProps {
  video: Video;
  onEdit: (video: Video) => void;
}

export default function VideoListItem({ video, onEdit }: VideoListItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMutation = useDeleteVideo();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(video.id);
      toast.success('Video deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete video');
    }
    setShowDeleteDialog(false);
  };

  const thumbnailUrl = getYouTubeThumbnail(video.youtubeVideoId);

  return (
    <>
      <div className="flex gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-32 h-20 object-cover rounded flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <h3 className="font-semibold text-foreground truncate flex-1">{video.title}</h3>
            {video.isOriginal && (
              <Badge variant="secondary" className="flex-shrink-0">Original</Badge>
            )}
          </div>
          {video.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {video.description}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(video)}
            disabled={deleteMutation.isPending}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{video.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
