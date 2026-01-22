'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { ProtectedLayout } from '@/components/protected-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { getSession } from '@/lib/session';

interface Session {
  userId: string;
  email: string;
  name: string;
}

export default function SettingsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const sess = await getSession();
      if (sess) {
        setSession(sess);
      }
      setLoading(false);
    };
    loadSession();
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (passwordForm.oldPassword === passwordForm.newPassword) {
      setError('New password must be different from old password');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to reset password');
        return;
      }

      setSuccess('Password reset successfully');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div>Loading...</div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">Manage your account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Account Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Account Information</CardTitle>
              <CardDescription className="text-xs md:text-sm">Your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Name</p>
                <p className="font-medium text-sm md:text-base break-words">{session?.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Email</p>
                <p className="font-medium text-sm md:text-base break-all">{session?.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Account Type</p>
                <p className="font-medium text-sm md:text-base">Administrator</p>
              </div>
            </CardContent>
          </Card>

          {/* Reset Password */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Reset Password</CardTitle>
              <CardDescription className="text-xs md:text-sm">Change your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex gap-2 items-start">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-xs md:text-sm text-destructive">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs md:text-sm text-green-800 dark:text-green-300">{success}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="oldPassword" className="text-xs md:text-sm font-medium">
                    Current Password
                  </label>
                  <Input
                    id="oldPassword"
                    name="oldPassword"
                    type="password"
                    placeholder="••••••••"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    required
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-xs md:text-sm font-medium">
                      New Password
                    </label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-xs md:text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto"
                  >
                    {submitting ? 'Resetting...' : 'Reset Password'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPasswordForm({
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      setError('');
                      setSuccess('');
                    }}
                    disabled={submitting}
                    className="w-full sm:w-auto"
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Other Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Preferences</CardTitle>
            <CardDescription className="text-xs md:text-sm">Configure your application preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b">
              <div>
                <p className="font-medium text-sm md:text-base">Email Notifications</p>
                <p className="text-xs md:text-sm text-muted-foreground">Receive email alerts for vehicle events</p>
              </div>
              <label className="flex items-center cursor-pointer flex-shrink-0">
                <input type="checkbox" defaultChecked className="rounded" />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b">
              <div>
                <p className="font-medium text-sm md:text-base">Dark Mode</p>
                <p className="text-xs md:text-sm text-muted-foreground">Enable dark mode for the dashboard</p>
              </div>
              <label className="flex items-center cursor-pointer flex-shrink-0">
                <input type="checkbox" className="rounded" />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-medium text-sm md:text-base">Activity Log</p>
                <p className="text-xs md:text-sm text-muted-foreground">Track all account activities</p>
              </div>
              <label className="flex items-center cursor-pointer flex-shrink-0">
                <input type="checkbox" defaultChecked className="rounded" />
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
}
