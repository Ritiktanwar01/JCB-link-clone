'use client';

import React from "react"
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, LayoutGrid, Car, Settings } from 'lucide-react';

interface Session {
  userId: string;
  email: string;
  name: string;
  expiresAt: number;
}

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await authAPI.verifyToken();
        setSession({
          userId: userData.user.id,
          email: userData.user.email,
          name: userData.user.name,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
      } catch (err) {
        authAPI.logout();
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleLogout = async () => {
    authAPI.logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { label: 'Vehicles', href: '/vehicles', icon: Car },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between bg-sidebar border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center font-bold text-sm">
            🚗
          </div>
          <h1 className="font-bold text-sidebar-foreground">FleetMgr</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-8 w-8"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } lg:block ${
          sidebarOpen ? 'w-full lg:w-64' : 'lg:w-20'
        } bg-sidebar border-b lg:border-b-0 lg:border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        <div className="hidden lg:flex p-4 lg:p-6 border-b border-sidebar-border items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center font-bold">
              🚗
            </div>
            <h1 className="font-bold text-lg text-sidebar-foreground">FleetMgr</h1>
          </div>
        </div>

        <nav className="flex-1 p-2 lg:p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 lg:p-4 border-t border-sidebar-border space-y-2">
          <div className="text-xs text-sidebar-foreground/70 px-2 truncate">
            {session.name}
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 bg-transparent text-sm lg:text-base"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
