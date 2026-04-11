'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setTokenInCookies } from '@/lib/jwtUtils';

function SuccessHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleSuccess = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace('#', ''));
      
      const accessToken = params.get('accessToken');
      const refreshToken = params.get('refreshToken');
      const redirectPath = searchParams.get('redirect') || '/dashboard';

      if (accessToken) {
        await setTokenInCookies('accessToken', accessToken);
      }
      if (refreshToken) {
        await setTokenInCookies('refreshToken', refreshToken);
      }

      // Small delay to allow cookies to be set before redirect
      setTimeout(() => {
        router.replace(redirectPath);
      }, 500);
    };

    handleSuccess();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        <h2 className="text-xl font-semibold text-gray-900">Finalizing login...</h2>
        <p className="text-gray-500">You will be redirected shortly.</p>
      </div>
    </div>
  );
}

export default function GoogleSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessHandler />
    </Suspense>
  );
}
