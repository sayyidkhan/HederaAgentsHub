'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { siteConfig } from '@/lib/config';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

export function HeaderNav() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-primary">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center">
            <svg viewBox="0 0 40 40" className="h-8 w-8">
              <rect width="40" height="40" rx="6" fill="#FFFFFF" />
              <path d="M12 10h4v6h8v-6h4v20h-4v-6h-8v6h-4V10Z" fill="#021058" />
            </svg>
          </div>
          <span className="hidden font-bold text-lg sm:inline-block text-white">{siteConfig.name}</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center space-x-8 text-sm md:flex flex-1">
          <Link 
            href="/" 
            className={cn(
              "text-white transition-colors hover:text-white/80",
              pathname === "/" && "font-bold border-b-2 border-white pb-1"
            )}
          >
            Home
          </Link>
          <Link 
            href="/agents" 
            className={cn(
              "text-white transition-colors hover:text-white/80",
              pathname === "/agents" && "font-bold border-b-2 border-white pb-1"
            )}
          >
            My Agents
          </Link>
          <Link 
            href="/marketplace" 
            className={cn(
              "text-white transition-colors hover:text-white/80",
              pathname === "/marketplace" && "font-bold border-b-2 border-white pb-1"
            )}
          >
            Marketplace
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {!user ? (
            <>
              {/* Sign Up Button */}
              <Link href="/register">
                <Button className="hidden rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 sm:inline-flex">
                  Sign Up
                </Button>
              </Link>

              {/* Log In Button */}
              <Link href="/login">
                <Button variant="ghost" className="hidden text-primary-foreground hover:bg-primary-foreground/10 sm:inline-flex">
                  Log In
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* User Avatar with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 rounded-full flex items-center gap-2 px-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User'} />
                      <AvatarFallback className="bg-orange-200 text-orange-700">
                        {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || <User className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block text-white font-medium text-sm">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.id}`} className="cursor-pointer">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/user-1" className="cursor-pointer">
                      My Items
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer">
                      Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

