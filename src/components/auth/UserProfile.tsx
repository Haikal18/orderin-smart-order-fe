'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function UserProfile() {
  const { user, logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome!</CardTitle>
        <CardDescription>Anda berhasil login</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Name</div>
          <div className="font-medium">{user.name}</div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Email</div>
          <div className="font-medium">{user.email}</div>
        </div>

        {user.role && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Role</div>
            <div className="font-medium capitalize">{user.role}</div>
          </div>
        )}

        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full"
          disabled={mounted && isLoading}
        >
          {mounted && isLoading ? 'Logging out...' : 'Logout'}
        </Button>
      </CardContent>
    </Card>
  );
}
