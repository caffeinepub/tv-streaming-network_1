import { useRef } from 'react';
import { useVideos, useOriginalShows } from '../../hooks/useVideos';
import Hero from './Hero';
import VideoRow from '../videos/VideoRow';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Genre } from '../../backend';

export default function HomeView() {
  const { data: videos, isLoading, error } = useVideos();
  const { data: originals, isLoading: isOriginalsLoading } = useOriginalShows();
  const videosRef = useRef<HTMLDivElement>(null);

  const handleExplore = () => {
    videosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Group videos by genre (excluding originals)
  const regularVideos = videos?.filter(v => !v.isOriginal) || [];
  const comedyVideos = regularVideos.filter(v => v.genre === 'comedy');
  const dramaVideos = regularVideos.filter(v => v.genre === 'drama');
  const documentaryVideos = regularVideos.filter(v => v.genre === 'documentary');

  const hasOriginals = originals && originals.length > 0;
  const hasContent = hasOriginals || comedyVideos.length > 0 || dramaVideos.length > 0 || documentaryVideos.length > 0;

  return (
    <div className="min-h-screen">
      <Hero onExplore={handleExplore} />
      
      <div ref={videosRef} className="container mx-auto px-4 py-12 space-y-12">
        {(isLoading || isOriginalsLoading) && (
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-48 w-80 flex-shrink-0 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load videos. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && videos && videos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-display font-semibold mb-2">No videos yet</h3>
            <p className="text-muted-foreground max-w-md">
              Check back soon for new content in our collection.
            </p>
          </div>
        )}

        {!isLoading && !isOriginalsLoading && !error && hasContent && (
          <>
            {hasOriginals && (
              <VideoRow title="Originals" videos={originals} />
            )}
            {comedyVideos.length > 0 && (
              <VideoRow title="Comedy" videos={comedyVideos} />
            )}
            {dramaVideos.length > 0 && (
              <VideoRow title="Drama" videos={dramaVideos} />
            )}
            {documentaryVideos.length > 0 && (
              <VideoRow title="Documentary" videos={documentaryVideos} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
