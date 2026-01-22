'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { authAPI } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 sm:space-y-3">
          <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg sm:text-xl">
            🚗
          </div>
          <CardTitle className="text-xl sm:text-2xl">Vehicle Fleet Manager</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Sign in to manage your vehicle fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2 sm:p-3 flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs sm:text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="demo@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">Demo: demo@example.com / demo123</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs sm:text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-sm sm:text-base"
              disabled={loading}
              size="lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t text-center text-xs sm:text-sm text-muted-foreground">
            <p>Demo credentials provided above</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
