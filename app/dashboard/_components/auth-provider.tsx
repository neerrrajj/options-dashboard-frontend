'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated, initializeAuth, checkAndHandleSessionExpiry } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      
      // Check if session expired after initialization
      const isExpired = checkAndHandleSessionExpiry();
      if (isExpired) {
        router.push('/auth');
      }
    };
    
    init();
  }, [initializeAuth, checkAndHandleSessionExpiry, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If not authenticated and not loading, don't render children
  // (middleware should handle redirect, but this is a fallback)
  if (!isAuthenticated && !isLoading) {
    return null;
  }

  return <>{children}</>;
}
