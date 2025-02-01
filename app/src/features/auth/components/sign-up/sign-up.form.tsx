'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Github, Facebook } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { signUpSchema } from '@/lib/form.schema';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useTheme } from 'next-themes';
import { toast } from '@/hooks/use-toast';
import { useMemo } from 'react';
import { useSignIn, useSignUp } from '@/features/auth/hooks/auth.hooks';
import { ErrorContext } from 'better-auth/react';

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { theme } = useTheme();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const onError = (ctx: ErrorContext) => {
    if (ctx?.error?.message?.includes('email')) {
      form.setError('email', {
        message: ctx?.error?.message,
      });
    } else {
      toast({
        title: 'Error',
        content: ctx?.error?.message,
      });
    }
  };
  const { isPending: signUpPending, mutate: signUp } = useSignUp({
    onError,
  });
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    await signUp({ ...values });
  }

  const { isPending: isGithubPending, mutate: githubSignIn } =
    useSignIn('github');
  const { isPending: isGooglePending, mutate: googleSignIn } =
    useSignIn('google');
  const { isPending: isFacebookPending, mutate: facebookSignIn } =
    useSignIn('facebook');
  const loading = useMemo(
    () =>
      isGithubPending || isGooglePending || isFacebookPending || signUpPending,
    [isGithubPending, isGooglePending, isFacebookPending, signUpPending]
  );
  const githubLogin = async () => {
    githubSignIn({});
  };
  const googleLogin = async () => {
    googleSignIn({});
  };
  const facebookLogin = async () => {
    facebookSignIn({});
  };
  return (
    <div
      className={cn(
        'flex flex-col justify-between items-center w-full lg:w-2/5 py-6',
        className
      )}
      {...props}
    >
      <div></div>
      <div className='flex flex-col space-y-4 lg:w-1/2 w-4/5'>
        <div className='flex flex-col items-center text-center'>
          <h1 className='text-2xl font-bold'>Sign up</h1>
          <p className='text-balance text-muted-foreground'>
            Enter your information to create an account
          </p>
        </div>
        <div className='w-full flex flex-row gap-2'>
          <Button
            variant='outline'
            className='w-1/3'
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
            className='w-1/3'
            disabled={loading}
            type='button'
            onClick={githubLogin}
          >
            <Github />
          </Button>
          <Button
            variant='outline'
            className='w-1/3'
            disabled={loading}
            type='button'
            onClick={facebookLogin}
          >
            <Facebook />
          </Button>
        </div>
        <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
          <span className='relative z-10 bg-background px-2 text-muted-foreground'>
            Or
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='John Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
                  'Create an account'
                )}
              </Button>
              <div className='text-center text-sm'>
                Already have an account?{' '}
                <Link href='/sign-in' className='underline underline-offset-4'>
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
