'use client';

import { useState, useEffect, useCallback } from 'react';
import { OTPInput } from 'input-otp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const monoFont = { fontFamily: 'var(--font-mono), monospace' };

interface OTPVerificationProps {
  email: string;
  onSuccess: (user: any, session: any) => void;
  onBack: () => void;
}

export function OTPVerification({ email, onSuccess, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user && data.session) {
        onSuccess(data.user, data.session);
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Resend the signup email/OTP
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setCountdown(60);
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="bg-[#0d0d0d] border-landing-border-light">
      <CardHeader className="space-y-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-landing-muted hover:text-landing-fg transition-colors mb-2 -ml-1"
        >
          <ArrowLeft size={14} />
          <span className="text-xs">Back</span>
        </button>
        <CardTitle 
          className="text-xl text-landing-fg"
        >
          Verify your email
        </CardTitle>
        <CardDescription 
          className="text-landing-muted"
        >
          Enter the 6-digit code sent to{' '}
          <span className="text-landing-accent">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error message */}
        {error && (
          <div 
            className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded"
          >
            {error}
          </div>
        )}

        {/* OTP Input */}
        <div className="flex justify-center">
          <OTPInput
            maxLength={6}
            value={otp}
            onChange={setOtp}
            onComplete={handleVerify}
            containerClassName="flex gap-2"
            render={({ slots }) => (
              <>
                {slots.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`
                      relative w-12 h-14 text-lg flex items-center justify-center
                      border-2 rounded bg-landing-bg
                      transition-all duration-200
                      ${slot.isActive 
                        ? 'border-landing-accent ring-2 ring-landing-accent/20' 
                        : 'border-landing-border-light'
                      }
                      ${slot.char ? 'text-landing-fg' : 'text-landing-muted'}
                    `}
                    style={monoFont}
                  >
                    {slot.char}
                    {slot.hasFakeCaret && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-0.5 h-5 bg-landing-accent animate-pulse" />
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          />
        </div>

        {/* Verify button */}
        <Button
          onClick={handleVerify}
          disabled={isLoading || otp.length !== 6}
          className="w-full bg-landing-accent text-landing-bg hover:bg-landing-accent/90 font-semibold tracking-wide uppercase text-xs disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Verify Email'
          )}
        </Button>

        {/* Resend code */}
        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
            className="text-sm text-landing-muted hover:text-landing-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isResending ? (
              <>
                <RefreshCw className="h-3 w-3 animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              `Resend code in ${countdown}s`
            ) : (
              <>
                <RefreshCw className="h-3 w-3" />
                Resend code
              </>
            )}
          </button>
          <p className="text-xs text-landing-border-muted mt-2">
            Code expires in 10 minutes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
