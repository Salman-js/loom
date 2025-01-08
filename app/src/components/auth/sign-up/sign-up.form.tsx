'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Github } from 'lucide-react';
// import { signUp } from '@/lib/auth-client';
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
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { authClient } from '@/lib/auth-client';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    console.log(values);
    const { data, error } = await authClient.signIn.email(
      {
        ...values,
        callbackURL: '/',
      },
      {
        onRequest: (ctx) => {
          setLoading(true);
        },
        onSuccess: (ctx) => {
          setLoading(false);
        },
        onError: (ctx) => {
          setLoading(false);
          toast({
            title: 'Sign up failed',
            description: ctx?.error?.message,
            variant: 'destructive',
          });
        },
      }
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <Form {...form}>
            <form className='p-6 md:p-8' onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid gap-4'>
                <div className='flex flex-col items-center text-center'>
                  <h1 className='text-2xl font-bold'>Sign up</h1>
                  <p className='text-balance text-muted-foreground'>
                    Enter your information to create an account
                  </p>
                </div>
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
                <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
                  <span className='relative z-10 bg-background px-2 text-muted-foreground'>
                    Or
                  </span>
                </div>
                <div className='w-full'>
                  <Button variant='outline' className='w-full'>
                    <Github />
                    <span className=''>Continue With Github</span>
                  </Button>
                </div>
                <div className='text-center text-sm'>
                  Already have an account?{' '}
                  <Link
                    href='/sign-in'
                    className='underline underline-offset-4'
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className='relative hidden bg-muted md:block'>
            <div className='absolute right-4 top-4 z-20'>
              <ThemeSwitcher />
            </div>
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

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
