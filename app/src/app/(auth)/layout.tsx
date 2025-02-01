'use client';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useAuth } from '@/features/auth/hooks/auth.hooks';
import { useSession } from '@/lib/auth-client';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { data: session } = useSession();
  useEffect(() => {
    if (user && session?.user) {
      router.push('/');
    }
  }, [user, session]);
  return (
    <main className='w-full'>
      <div className='absolute right-6 top-6'>
        <ThemeSwitcher />
      </div>
      <div className='w-full max-h-screen overflow-hidden bg-background flex flex-row p-0 border'>
        <div
          className='hidden lg:block w-3/5 min-h-screen overflow-hidden bg-contain'
          style={{
            backgroundImage: `url(${
              theme === 'light' ? '/light-auth-bg.jpg' : '/dark-auth-bg.jpg'
            })`,
          }}
        ></div>
        {children}
      </div>
    </main>
  );
}
