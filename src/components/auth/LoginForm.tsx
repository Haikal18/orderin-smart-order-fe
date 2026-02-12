'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Email dan password harus diisi');
      return;
    }

    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Login gagal');
    } finally {
      setSubmitting(false);
    }
  };

  const displayError: string | null = localError ?? (error instanceof Error ? error.message : (typeof error === 'string' ? error : null));

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Masukkan email dan password untuk masuk ke OrderIn SmartOrder
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              disabled={mounted && isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              disabled={mounted && isLoading}
              required
            />
          </div>

          {displayError && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {displayError}
            </div>
          )}

            <Button type="submit" className="w-full" disabled={mounted && (isLoading || submitting)}>
              {mounted && (isLoading || submitting) ? 'Sedang login...' : 'Login'}
            </Button>
        </form>
      </CardContent>
    </Card>
  );
}
