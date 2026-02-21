import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import TopNav from './components/layout/TopNav';
import HomeView from './components/home/HomeView';
import ManageVideosView from './components/manage/ManageVideosView';
import SplashView from './components/splash/SplashView';
import { Toaster } from '@/components/ui/sonner';
import { useIsAdmin } from './hooks/useAdmin';
import { toast } from 'sonner';

type View = 'splash' | 'home' | 'manage';

const SPLASH_DISMISSED_KEY = 'tv-streaming-splash-dismissed';

function App() {
  const [currentView, setCurrentView] = useState<View>(() => {
    // Check if splash was already dismissed in this session
    const dismissed = sessionStorage.getItem(SPLASH_DISMISSED_KEY);
    return dismissed === 'true' ? 'home' : 'splash';
  });
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  const handleNavigate = (view: View) => {
    if (view === 'manage' && !isAdminLoading && !isAdmin) {
      toast.error('Access Denied', {
        description: 'This area is restricted to administrators only.',
      });
      setCurrentView('home');
      return;
    }
    setCurrentView(view);
  };

  const handleAdminGranted = () => {
    // Navigate to manage view after successful admin sign in
    setCurrentView('manage');
  };

  const handleSplashContinue = () => {
    // Mark splash as dismissed for this session
    sessionStorage.setItem(SPLASH_DISMISSED_KEY, 'true');
    setCurrentView('home');
  };

  // If user tries to access manage view but is not admin, redirect to home
  // But avoid redirect loops while admin status is being evaluated
  useEffect(() => {
    if (!isAdminLoading && currentView === 'manage' && !isAdmin) {
      toast.error('Access Denied', {
        description: 'This area is restricted to administrators only.',
      });
      setCurrentView('home');
    }
  }, [isAdmin, isAdminLoading, currentView]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background">
        {currentView === 'splash' ? (
          <SplashView onContinue={handleSplashContinue} />
        ) : (
          <>
            <TopNav 
              currentView={currentView as 'home' | 'manage'} 
              onNavigate={handleNavigate} 
              isAdmin={isAdmin}
              onAdminGranted={handleAdminGranted}
            />
            <main>
              {currentView === 'home' ? (
                <HomeView />
              ) : (
                <ManageVideosView />
              )}
            </main>
            <footer className="border-t border-border/40 bg-card/50 py-8 mt-16">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>
                  © {new Date().getFullYear()} TV Streaming Network. Built with love using{' '}
                  <a
                    href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                      typeof window !== 'undefined' ? window.location.hostname : 'tv-streaming-network'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    caffeine.ai
                  </a>
                </p>
              </div>
            </footer>
          </>
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
