'use client';

import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const monoFont = { fontFamily: 'var(--font-mono), monospace' };

export function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) {
    return null;
  }

  // Get first letter of email for avatar
  const email = user.email || '';
  const avatarLetter = email.charAt(0).toUpperCase() || 'U';
  // Truncate email if too long
  const displayEmail = email.length > 20 
    ? `${email.slice(0, 20)}...` 
    : email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-9 w-9 rounded-full bg-landing-accent/10 text-landing-accent hover:bg-landing-accent/20 hover:text-landing-accent"
          style={monoFont}
        >
          <span className="text-sm font-bold">{avatarLetter}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-[#0d0d0d] border-landing-border-light"
        align="end"
        forceMount
      >
        <DropdownMenuLabel 
          className="font-normal"
          style={monoFont}
        >
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-landing-fg">
              {displayEmail}
            </p>
            <p className="text-xs text-landing-muted">
              {user.user_metadata?.provider === 'google' ? 'Google Account' : 'Email Account'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-landing-border-light" />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-landing-fg hover:bg-landing-border-muted/30 focus:bg-landing-border-muted/30 cursor-pointer"
          style={monoFont}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
