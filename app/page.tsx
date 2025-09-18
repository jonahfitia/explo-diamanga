'use client';

import { AuthGuard } from '@/components/auth-guard';
import { AuthForms } from '@/components/auth-forms';
import { Dashboard } from '@/components/dashboard';

export default function Home() {
  return (
    <AuthGuard fallback={<AuthForms />}>
      <Dashboard />
    </AuthGuard>
  );
}