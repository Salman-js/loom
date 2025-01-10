'use client';

import {
  BadgeCheck,
  Bell,
  Bookmark,
  ChevronsUpDown,
  CreditCard,
  Heart,
  Loader,
  Loader2,
  LogIn,
  LogOut,
  Sparkles,
  Target,
  User,
  UserPlus,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { IUser } from '@/features/users/interface/user.interface';
import { useRouter } from 'next/navigation';
import { useAuth, useSignOut } from '@/features/auth/hooks/auth.hooks';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';

export function NavUser() {
  const { isMobile } = useSidebar();
  const {
    isPending: isSigningOut,
    mutate: signUserOut,
    isSuccess,
  } = useSignOut();
  const { data } = useSession();
  const user = useMemo(() => data?.user, [data]);
  const { setUser } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <User />
              </Avatar>
              {user ? (
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{user?.name}</span>
                  <span className='truncate text-xs'>{user?.email}</span>
                </div>
              ) : (
                <span className='truncate font-semibold text-lg'>Guest</span>
              )}
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {isSigningOut ? (
            <DropdownMenuContent
              className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
              side={isMobile ? 'bottom' : 'right'}
              align='end'
              sideOffset={4}
            >
              <div className='w-full p-20 flex flex-col justify-center items-center'>
                <Loader2 className='animate-spin' />
              </div>
            </DropdownMenuContent>
          ) : (
            <>
              {user ? (
                <DropdownMenuContent
                  className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                  side={isMobile ? 'bottom' : 'right'}
                  align='end'
                  sideOffset={4}
                >
                  <DropdownMenuLabel className='p-0 font-normal'>
                    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                      <Avatar className='h-8 w-8 rounded-lg'>
                        <User />
                      </Avatar>
                      <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='truncate font-semibold'>
                          {user?.name}
                        </span>
                        <span className='truncate text-xs'>{user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Target />
                      Reading Goal
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => signUserOut()}>
                    <LogOut />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              ) : (
                <DropdownMenuContent
                  className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                  side={isMobile ? 'bottom' : 'right'}
                  align='end'
                  sideOffset={4}
                >
                  <DropdownMenuLabel className='p-0 font-normal'>
                    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                      <Avatar className='h-8 w-8 rounded-lg'>
                        <AvatarImage src='error' alt='' />
                        <AvatarFallback className='rounded-lg'>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                      <span className='truncate font-semibold text-lg'>
                        Guest
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => router.push('/sign-in')}
                  >
                    <LogIn />
                    Sign in
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => router.push('/sign-up')}
                  >
                    <UserPlus />
                    Create account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
