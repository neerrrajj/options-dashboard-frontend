'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthForm } from './_components/auth-form';
import { useAuthStore } from '@/store/authStore';

const monoFont = { fontFamily: 'var(--font-mono), monospace' };

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  // Check for OAuth errors
  const error = searchParams.get('error');

  // Initialize auth on mount
  // Note: We don't auto-redirect here since middleware handles it
  // This is just for client-side state sync

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <main className="min-h-screen bg-landing-bg flex items-center justify-center">
        <div className="text-landing-muted" style={monoFont}>
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-landing-bg relative overflow-hidden">
      {/* Background grid pattern matching landing page */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#00d4ff08 1px, transparent 1px), linear-gradient(90deg, #00d4ff08 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-landing-accent text-2xl">◆</span>
              <span 
                className="text-2xl font-bold tracking-tight text-landing-fg"
                style={monoFont}
              >
                strikezone
              </span>
            </div>
            <p className="text-landing-muted text-sm" style={monoFont}>
              Sign in to access your dashboard
            </p>
          </div>

          {/* OAuth Error Message */}
          {error === 'auth_callback_failed' && (
            <div 
              className="mb-4 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded text-center"
              style={monoFont}
            >
              Authentication failed. Please try again.
            </div>
          )}

          {/* Auth Form */}
          <AuthForm />
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-landing-bg flex items-center justify-center">
        <div className="text-landing-muted" style={monoFont}>
          Loading...
        </div>
      </main>
    }>
      <AuthContent />
    </Suspense>
  );
}
