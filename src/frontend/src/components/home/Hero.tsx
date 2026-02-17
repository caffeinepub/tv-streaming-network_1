import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/generated/tv-streaming-hero-bg.dim_1600x600.png)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      </div>
      <div className="container relative mx-auto flex h-full items-end px-4 pb-16">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-4xl font-display font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Your Personal Streaming Collection
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Discover and enjoy a curated collection of premium video content in a beautiful, cinematic interface.
          </p>
          <div className="flex gap-3">
            <Button size="lg" onClick={onExplore} className="gap-2">
              <Play className="h-5 w-5" />
              Explore Videos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
