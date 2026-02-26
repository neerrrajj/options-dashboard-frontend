'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { GoogleAuthButton } from './google-auth-button';
import { toast } from 'sonner';

const monoFont = { fontFamily: 'var(--font-mono), monospace' };

// Password requirements
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

function validatePasswordStrength(password: string): PasswordValidation {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[@$!%*?&]/.test(password),
  };
}

function isPasswordValid(validation: PasswordValidation): boolean {
  return Object.values(validation).every(Boolean);
}

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
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Update password validation on type
  useEffect(() => {
    setPasswordValidation(validatePasswordStrength(password));
  }, [password]);

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
        toast.error(error.message);
        return;
      }

      if (data.user?.identities?.length === 0) {
        toast.error('An account with this email already exists. Please log in.');
        setActiveTab('login');
        return;
      }

      // Show success message
      setShowSuccess(true);
      
      // Clear form
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error(
            'Account exists but password is incorrect. If you signed up with Google, please use the "Continue with Google" button.',
            { duration: 6000 }
          );
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email before logging in. Check your inbox for the verification link.', {
            duration: 6000,
          });
        } else {
          toast.error(error.message);
        }
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
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password validation icon with tooltip
  const PasswordValidationIcon = () => {
    if (!password) return null;
    
    const isValid = isPasswordValid(passwordValidation);
    const missingItems = [
      !passwordValidation.minLength && '8+ characters',
      !passwordValidation.hasUppercase && 'uppercase letter',
      !passwordValidation.hasLowercase && 'lowercase letter',
      !passwordValidation.hasNumber && 'number',
      !passwordValidation.hasSpecial && 'special character',
    ].filter(Boolean);
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="right"
          className="ml-2 bg-muted border border-border text-muted-foreground"
        >
          <div className="space-y-1.5">
            <p style={monoFont} className="text-sm font-medium">
              {isValid ? 'Password meets all requirements' : 'Password requirements:'}
            </p>
            {!isValid && (
              <ul className="text-sm space-y-0.5">
                <li className={passwordValidation.minLength ? 'text-green-500' : 'text-landing-muted'}>
                  <span className="inline-block w-4 text-center">
                    {passwordValidation.minLength ? '✓' : '•'}
                  </span>
                  <span className="ml-1">8+ characters</span>
                </li>
                <li className={passwordValidation.hasUppercase ? 'text-green-500' : 'text-landing-muted'}>
                  <span className="inline-block w-4 text-center">
                    {passwordValidation.hasUppercase ? '✓' : '•'}
                  </span>
                  <span className="ml-1">Uppercase letter</span>
                </li>
                <li className={passwordValidation.hasLowercase ? 'text-green-500' : 'text-landing-muted'}>
                  <span className="inline-block w-4 text-center">
                    {passwordValidation.hasLowercase ? '✓' : '•'}
                  </span>
                  <span className="ml-1">Lowercase letter</span>
                </li>
                <li className={passwordValidation.hasNumber ? 'text-green-500' : 'text-landing-muted'}>
                  <span className="inline-block w-4 text-center">
                    {passwordValidation.hasNumber ? '✓' : '•'}
                  </span>
                  <span className="ml-1">Number</span>
                </li>
                <li className={passwordValidation.hasSpecial ? 'text-green-500' : 'text-landing-muted'}>
                  <span className="inline-block w-4 text-center">
                    {passwordValidation.hasSpecial ? '✓' : '•'}
                  </span>
                  <span className="ml-1">Special character (@$!%*?&)</span>
                </li>
              </ul>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  // Confirm password match icon with tooltip
  const ConfirmPasswordIcon = () => {
    if (!confirmPassword) return null;
    
    const isPasswordRequirementsMet = isPasswordValid(passwordValidation);
    const isMatch = confirmPassword === password && password !== '';
    // Only show green if password meets requirements AND confirm matches
    const isValid = isPasswordRequirementsMet && isMatch;
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="right"
          className="ml-2 bg-muted border border-border text-muted-foreground"
        >
          <p style={monoFont} className="text-sm">
            {!isPasswordRequirementsMet 
              ? 'Password does not meet requirements' 
              : isMatch 
                ? 'Passwords match' 
                : 'Passwords do not match'}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  };

  // Check if signup form is valid
  const isSignupValid = () => {
    return (
      email &&
      password &&
      confirmPassword &&
      isPasswordValid(passwordValidation) &&
      password === confirmPassword
    );
  };

  // Check if login form is valid
  const isLoginValid = () => {
    return email && password;
  };

  // Show success message after signup
  if (showSuccess) {
    return (
      <Card className="bg-[#0d0d0d] border-landing-border-light">
        <CardContent className="pt-6 pb-6 text-center">
          <CheckCircle className="w-16 h-16 text-landing-accent mx-auto mb-4" />
          <h3 
            className="text-xl font-bold text-landing-fg mb-2"
            style={monoFont}
          >
            Verification Email Sent
          </h3>
          <p 
            className="text-landing-muted mb-6"
          >
            Check your email! We&apos;ve sent you a verification link.
          </p>
          <Button
            onClick={() => {
              setShowSuccess(false);
              setActiveTab('login');
            }}
            className="bg-landing-accent text-landing-bg hover:bg-landing-accent/90 font-semibold tracking-wide uppercase text-xs"
            style={monoFont}
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
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

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label 
                    htmlFor="login-email" 
                    className="text-muted-foreground"
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
                    className="bg-landing-bg border-landing-border-light text-landing-fg placeholder:text-landing-border-muted focus:border-landing-accent tracking-wide"
                    style={monoFont}
                  />
                </div>
                <div className="space-y-2">
                  <Label 
                    htmlFor="login-password" 
                    className="text-muted-foreground"
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
                      className="bg-landing-bg border-landing-border-light text-landing-fg placeholder:text-landing-border-muted focus:border-landing-accent pr-10 tracking-wide"
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
                  disabled={isLoading || !isLoginValid()}
                  className="w-full bg-landing-accent text-landing-bg hover:bg-landing-accent/90 font-semibold tracking-wider uppercase text-sm disabled:opacity-50"
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
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <Label 
                    htmlFor="signup-email" 
                    className="text-muted-foreground"
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
                    className="bg-landing-bg border-landing-border-light text-landing-fg placeholder:text-landing-border-muted focus:border-landing-accent tracking-wide"
                    style={monoFont}
                  />
                </div>
                <div className="space-y-2">
                  <Label 
                    htmlFor="signup-password" 
                    className="text-muted-foreground"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-landing-bg border-landing-border-light text-landing-fg placeholder:text-landing-border-muted focus:border-landing-accent pr-16 tracking-wide"
                      style={monoFont}
                    />
                    <PasswordValidationIcon />
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
                    className="text-muted-foreground"
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
                      className="bg-landing-bg border-landing-border-light text-landing-fg placeholder:text-landing-border-muted focus:border-landing-accent pr-16 tracking-wide"
                      style={monoFont}
                    />
                    <ConfirmPasswordIcon />
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
                  disabled={isLoading || !isSignupValid()}
                  className="w-full bg-landing-accent text-landing-bg hover:bg-landing-accent/90 font-semibold tracking-wider uppercase text-sm disabled:opacity-50 cursor-pointer"
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
            <div className="relative flex justify-center text-sm">
              <span 
                className="bg-[#0d0d0d] px-2 text-landing-muted"
              >
                or
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
