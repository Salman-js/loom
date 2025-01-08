export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='w-full h-screen flex flex-col items-center justify-center'>
      {children}
    </main>
  );
}
