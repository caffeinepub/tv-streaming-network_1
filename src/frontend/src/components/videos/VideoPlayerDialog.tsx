import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Video } from '../../backend';

interface VideoPlayerDialogProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPlayerDialog({ video, isOpen, onClose }: VideoPlayerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-display">{video.title}</DialogTitle>
          {video.description && (
            <p className="text-sm text-muted-foreground pt-2">{video.description}</p>
          )}
        </DialogHeader>
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeVideoId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
