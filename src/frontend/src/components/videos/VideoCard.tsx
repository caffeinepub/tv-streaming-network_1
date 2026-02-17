import { useState } from 'react';
import { Play } from 'lucide-react';
import { getYouTubeThumbnail } from '../../utils/youtube';
import VideoPlayerDialog from './VideoPlayerDialog';
import type { Video } from '../../backend';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const thumbnailUrl = getYouTubeThumbnail(video.youtubeVideoId, 'hq');

  return (
    <>
      <div
        className="group relative flex-shrink-0 w-80 cursor-pointer transition-transform hover:scale-105"
        onClick={() => setIsPlayerOpen(true)}
      >
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted shadow-video-card">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition-opacity group-hover:opacity-75"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="rounded-full bg-primary p-3">
              <Play className="h-6 w-6 text-primary-foreground fill-current" />
            </div>
          </div>
        </div>
        <div className="mt-2 space-y-1">
          <h4 className="font-medium line-clamp-1 text-foreground">{video.title}</h4>
          {video.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
          )}
        </div>
      </div>
      <VideoPlayerDialog
        video={video}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
      />
    </>
  );
}
