'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, FileText, Activity, User, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/config';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Marketplace',
    href: '/',
    icon: Store,
  },
  {
    name: 'My Items',
    href: '/profile/user-1',
    icon: FileText,
  },
  {
    name: 'Transactions',
    href: '/orders/ORD-123',
    icon: Activity,
  },
  {
    name: 'Profile',
    href: '/profile/user-1',
    icon: User,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-border/40 bg-card/50 backdrop-blur-lg">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border/40 px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center">
            <svg viewBox="0 0 40 40" className="h-8 w-8">
              <rect width="40" height="40" rx="6" fill="#FFFFFF" />
              <path d="M12 10h4v6h8v-6h4v20h-4v-6h-8v6h-4V10Z" fill="#021058" />
            </svg>
          </div>
          <span className="font-bold text-lg text-white">{siteConfig.name}</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === '/orders/ORD-123' && pathname.startsWith('/orders'));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Actions */}
      <div className="border-t border-border/40">
        {/* User Info */}
        <Link
          href="/profile/user-1"
          className="flex items-center gap-3 px-4 py-4 hover:bg-accent transition-colors"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://via.placeholder.com/100" alt="Jane Doe" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Jane Doe</span>
            <span className="text-xs text-muted-foreground">jane.doe@email.com</span>
          </div>
        </Link>

        {/* Settings & Logout */}
        <div className="space-y-1 px-3 pb-3">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            onClick={() => {
              // Handle logout
              console.log('Logout clicked');
            }}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>

        {/* Contact Support Button */}
        <div className="px-4 pb-4">
          <Button className="w-full" size="lg">
            Contact Support
          </Button>
        </div>
      </div>
    </aside>
  );
}

