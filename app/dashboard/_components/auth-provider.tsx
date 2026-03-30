'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      if (mounted) {
        await initializeAuth();
      }
    };
    
    init();
    
    return () => {
      mounted = false;
    };
  }, [initializeAuth]);

  // Render children immediately - let pages handle their own loading states
  // Auth state is checked by middleware, pages can use useAuthStore if needed
  return <>{children}</>;
}
