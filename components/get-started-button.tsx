'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

const monoFont = { fontFamily: 'var(--font-mono), monospace' };

interface GetStartedButtonProps {
  className?: string;
  children: React.ReactNode;
}

export function GetStartedButton({ className, children }: GetStartedButtonProps) {
  const router = useRouter();
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await initializeAuth();
      setIsLoading(false);
    };
    checkAuth();
  }, [initializeAuth]);

  const handleClick = (e: React.MouseEvent) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }

    // If authenticated, go to dashboard
    // If not, go to auth (the href will handle this, but we could also use router)
    if (isAuthenticated) {
      e.preventDefault();
      router.push('/dashboard');
    }
    // If not authenticated, let the default Link behavior go to /auth
  };

  const href = isAuthenticated && !isLoading ? '/dashboard' : '/auth';

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      style={monoFont}
    >
      {children}
    </Link>
  );
}
