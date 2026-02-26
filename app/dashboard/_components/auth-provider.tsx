'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, initializeAuth } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      await initializeAuth();
      if (mounted) {
        setIsReady(true);
      }
    };
    
    init();
    
    return () => {
      mounted = false;
    };
  }, [initializeAuth]);

  // Show loading during initial auth check
  if (!isReady || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Render children - middleware handles auth redirects
  return <>{children}</>;
}
