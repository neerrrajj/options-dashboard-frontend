'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { User, LogOut, Sun, Moon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/store/authStore';
import { createClient } from '@/lib/supabase/client';

export function UserMenu() {
  const router = useRouter();
  const { user: storeUser, logout, setUser, setSession } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [localUser, setLocalUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Sync with Supabase session on mount
  useEffect(() => {
    const syncUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (user && session) {
        setUser(user);
        setSession(session);
        setLocalUser(user);
      }
      setIsLoading(false);
    };
    
    syncUser();
    setMounted(true);
  }, [setUser, setSession]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'light' : 'dark');
  };

  // Use store user or local user
  const user = storeUser || localUser;

  if (!user || isLoading) {
    return null;
  }

  // Get first letter of email for avatar fallback
  const email = user.email || '';
  const displayEmail = email.length > 30 
    ? `${email.slice(0, 30)}...` 
    : email;

  // Determine if light mode is active
  const isLightMode = mounted && theme === 'light';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full bg-landing-accent/10 text-landing-accent hover:bg-landing-accent/20 hover:text-landing-accent p-0"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-72 bg-background border border-border mt-2"
        align="end"
        forceMount
      >
        {/* Email Section */}
        <DropdownMenuLabel className="font-normal px-3 py-3 bg-landing-accent/10 rounded-t-md">
          <div className="flex flex-col space-y-1 ">
            <p className="text-sm font-medium text-landing-accent tracking-wide text-center">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-border" />
        
        {/* Theme Toggle Section */}
        <div className="px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLightMode ? (
                <Sun className="h-4 w-4 text-landing-muted" />
              ) : (
                <Moon className="h-4 w-4 text-landing-muted" />
              )}
              <span className="text-sm text-muted-foreground">Light Mode</span>
            </div>
            <Switch
              checked={isLightMode}
              onCheckedChange={handleThemeToggle}
              className="cursor-pointer"
            />
          </div>
        </div>
        
        {/* <DropdownMenuSeparator className="bg-border" /> */}
        
        {/* Logout Button */}
        <div className='px-2 py-2'>
          <Button
            variant="outline" 
            className='flex w-full cursor-pointer border border-red-500/50 text-red-500/80 hover:text-red-500/90'
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
