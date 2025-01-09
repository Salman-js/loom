import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Wrapper from '../components/wrapper';
import { ThemeProvider } from '@/components/theme-provider';
import { auth } from '@/lib/auth';
import { SessionProvider } from 'next-auth/react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Loom',
  description: 'bookshelf',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute='class'
            enableSystem
            disableTransitionOnChange
          >
            <Wrapper>{children}</Wrapper>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
