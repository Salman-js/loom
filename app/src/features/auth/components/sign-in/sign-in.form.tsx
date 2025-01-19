'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Github, Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signInSchema } from '@/lib/form.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import { use, useEffect, useMemo, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { store } from '@/store/store';
import { useSignIn } from '@/features/auth/hooks/auth.hooks';

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { theme } = useTheme();
  const router = useRouter();
  const { data: session } = useSession();
  const user = store.getState().user;
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    console.log(values);
  }
  const { isPending: isGithubPending, mutate: githubSignIn } =
    useSignIn('github');
  const { isPending: isGooglePending, mutate: googleSignIn } =
    useSignIn('google');
  const loading = useMemo(
    () => isGithubPending || isGooglePending,
    [isGithubPending, isGooglePending]
  );
  const githubLogin = async () => {
    githubSignIn();
  };
  const googleLogin = async () => {
    googleSignIn();
  };
  useEffect(() => {
    if (user) router.push('/');
  }, [session]);
  useEffect(() => {
    if (session?.user) {
      store.getState().setUser(session.user);
    }
  }, [session]);
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <Form {...form}>
            <form className='p-6 md:p-8' onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid gap-4'>
                <div className='flex flex-col items-center text-center'>
                  <h1 className='text-2xl font-bold'>Welcome back</h1>
                  <p className='text-balance text-muted-foreground px-14'>
                    Login to your Loom account
                  </p>
                </div>
                <div className='w-full flex flex-row gap-2'>
                  <Button
                    variant='outline'
                    className='w-1/2'
                    disabled={loading}
                    type='button'
                    onClick={googleLogin}
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                      <path
                        d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                        fill='currentColor'
                      />
                    </svg>
                  </Button>
                  <Button
                    variant='outline'
                    className='w-1/2'
                    disabled={loading}
                    type='button'
                    onClick={githubLogin}
                  >
                    <Github />
                  </Button>
                </div>
                <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
                  <span className='relative z-10 bg-background px-2 text-muted-foreground'>
                    Or
                  </span>
                </div>
                <FormField
                  control={form.control}
                  name='email'
                  disabled={loading}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder='m@example.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  disabled={loading}
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center'>
                        <FormLabel>Password</FormLabel>
                        <a
                          href='#'
                          className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <FormControl>
                        <Input type='password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' className='w-full' disabled={loading}>
                  {loading ? (
                    <Loader2 size={16} className='animate-spin' />
                  ) : (
                    'Sign in'
                  )}
                </Button>
                <div className='text-center text-sm'>
                  Don&apos;t have an account?{' '}
                  <Link
                    href='/sign-up'
                    className='underline underline-offset-4'
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className='relative hidden bg-muted md:block'>
            <img
              src={
                theme === 'light' ? '/light-auth-bg.jpg' : '/dark-auth-bg.jpg'
              }
              alt='Image'
              className='absolute inset-0 h-full w-full object-cover'
            />
          </div>
        </CardContent>
      </Card>
      <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  );
}
