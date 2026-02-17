import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoCard from './VideoCard';
import { Button } from '@/components/ui/button';
import type { Video } from '../../backend';

interface VideoRowProps {
  title: string;
  videos: Video[];
}

export default function VideoRow({ title, videos }: VideoRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (videos.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-display font-semibold tracking-tight">{title}</h3>
      <div className="group relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 h-full rounded-none bg-background/80 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background/90"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {videos.map((video) => (
            <VideoCard key={video.id.toString()} video={video} />
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 h-full rounded-none bg-background/80 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background/90"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}
