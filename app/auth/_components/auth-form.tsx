'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { OTPVerification } from './otp-verification';
import { GoogleAuthButton } from './google-auth-button';

const monoFont = { fontFamily: 'var(--font-mono), monospace' };

// Password requirements
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

interface AuthFormProps {
  className?: string;
}

export function AuthForm({ className }: AuthFormProps) {
  const router = useRouter();
  const { setUser, setSession } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOTP, setShowOTP] = useState(false);

  const validatePassword = (pass: string): boolean => {
    return PASSWORD_REGEX.test(pass);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate password
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      setIsLoading(false);
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user?.identities?.length === 0) {
        setError('An account with this email already exists. Please log in.');
        return;
      }

      // Show OTP verification
      setShowOTP(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get current date in IST as YYYY-MM-DD
  const getISTDateString = (): string => {
    const now = new Date()
    const istOffset = 5.5 * 60 * 60 * 1000
    const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)
    const istTime = new Date(utc + istOffset)
    return istTime.toISOString().split('T')[0]
  }

  // Set session date cookie for middleware
  const setSessionDateCookie = () => {
    const today = getISTDateString()
    document.cookie = `auth-session-date=${today}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setError('Please verify your email before logging in. Check your inbox for the OTP.');
          setShowOTP(true);
          return;
        }
        setError('Invalid email or password');
        return;
      }

      // Set auth state
      setUser(data.user);
      setSession(data.session);
      
      // Set session date cookie for middleware
      setSessionDateCookie()

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSuccess = (user: any, session: any) => {
    setUser(user);
    setSession(session);
    setSessionDateCookie()
    router.push('/dashboard');
  };

  // Show OTP verification overlay
  if (showOTP) {
    return (
      <OTPVerification 
        email={email}
        onSuccess={handleOTPSuccess}
        onBack={() => setShowOTP(false)}
      />
    );
  }

  return (
    <TooltipProvider>
      <Card className="bg-[#0d0d0d] border-landing-border-light">
        <CardHeader className="space-y-1">
          <CardTitle 
            className="text-xl text-landing-fg text-center"
            style={monoFont}
          >
            Welcome to strikezone
          </CardTitle>
          <CardDescription 
            className="text-landing-muted text-center"
            style={monoFont}
          >
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 bg-landing-border-muted/50 mb-6">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-landing-accent data-[state=active]:text-landing-bg"
                style={monoFont}
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-landing-accent data-[state=active]:text-landing-bg"
                style={monoFont}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Error message */}
            {error && (
              <div 
                className="mb-4 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded"
                style={monoFont}
              >
                {error}
              </div>
            )}

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label 
                    htmlFor="login-email" 
                    className="text-landing-fg"
                    style={monoFont}
                  >
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-landing-bg border-landing-border-light text-landing-fg placeholder:text-landing-border-muted focus:border-landing-accent"
                    style={monoFont}
                  />
                </div>
                <div className="space-y-2">
                  <Label 
                    htmlFor="login-password" 
                    className="text-landing-fg"
                    style={monoFont}
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-landing-bg border-landing-border-light text-landing-fg placeholder:text-landing-border-muted focus:border-landing-accent pr-10"
                      style={monoFont}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-landing-muted hover:text-landing-fg transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-landing-accent text-landing-bg hover:bg-landing-accent/90 font-semibold tracking-wide uppercase text-xs"
                  style={monoFont}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label 
                    htmlFor="signup-email" 
                    className="text-landing-fg"
                    style={monoFont}
                  >
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-landing-bg border-landing-border-light text-landing-fg placeholder:text-landing-border-muted focus:border-landing-accent"
                    style={monoFont}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label 
                      htmlFor="signup-password" 
                      className="text-landing-fg"
                      style={monoFont}
                    >
                      Password
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          type="button"
                          className="text-landing-muted hover:text-landing-accent transition-colors"
                        >
                          <Info size={14} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="right"
                        className="bg-landing-border border-landing-border-light text-landing-fg max-w-xs"
                      >
                        <p style={monoFont} className="text-xs">
                          Password must have at least 8 characters, including uppercase, lowercase, number, and special character (@$!%*?&)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-landing-bg border-landing-border-light text-landing-fg placeholder:text-landing-border-muted focus:border-landing-accent pr-10"
                      style={monoFont}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-landing-muted hover:text-landing-fg transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label 
                    htmlFor="signup-confirm" 
                    className="text-landing-fg"
                    style={monoFont}
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-landing-bg border-landing-border-light text-landing-fg placeholder:text-landing-border-muted focus:border-landing-accent pr-10"
                      style={monoFont}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-landing-muted hover:text-landing-fg transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-landing-accent text-landing-bg hover:bg-landing-accent/90 font-semibold tracking-wide uppercase text-xs"
                  style={monoFont}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-landing-border-light"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span 
                className="bg-[#0d0d0d] px-2 text-landing-muted"
                style={monoFont}
              >
                Or continue with
              </span>
            </div>
          </div>

          {/* Google OAuth */}
          <GoogleAuthButton />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
