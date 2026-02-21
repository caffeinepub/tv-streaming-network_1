import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface SplashViewProps {
  onContinue: () => void;
}

export default function SplashView({ onContinue }: SplashViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-12 px-4 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/generated/tv-streaming-network-logo.dim_512x512.png"
            alt="TV Streaming Network Logo"
            className="h-32 w-32 object-contain animate-in fade-in zoom-in duration-700"
          />
        </div>

        {/* Title */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-foreground">
            TV STREAMING NETWORK
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
            Your destination for premium entertainment
          </p>
        </div>

        {/* Continue button */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
          <Button
            size="lg"
            onClick={onContinue}
            className="gap-3 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Play className="h-6 w-6" />
            Enter
          </Button>
        </div>
      </div>
    </div>
  );
}
