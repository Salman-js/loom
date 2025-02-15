import Link from 'next/link';
import { Button } from './button';

export default function UnAuthorized() {
  return (
    <>
      <main className='grid min-h-full place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8'>
        <div className='text-center'>
          <p className='text-base font-semibold text-muted-foreground'>403</p>
          <h1 className='mt-4 text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-7xl'>
            Access Denied
          </h1>
          <p className='mt-6 text-lg font-medium text-pretty text-secondary-foreground sm:text-xl/8'>
            Sorry, you need to be logged in to access this page.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Link
              href='/sign-in'
              className='rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2'
            >
              <Button>Sign In</Button>
            </Link>
            <a href='#' className='text-sm font-semibold text-muted-foreground'>
              Contact support <span aria-hidden='true'>&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
