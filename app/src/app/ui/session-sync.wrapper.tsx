'use client';
import { useAuth } from '@/features/auth/hooks/auth.hooks';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo } from 'react';

type sessionLoadingProps = {
  children: React.ReactNode;
};

const SessionSyncWrapper: React.FC<sessionLoadingProps> = ({ children }) => {
  const { user, setUser, setToken } = useAuth();
  const { data: session } = useSession();
  const sessionUser = useMemo(() => session?.user, [session]);
  useEffect(() => {
    if (sessionUser && !user) {
      setUser(sessionUser);
    }
  }, [sessionUser]);
  return (sessionUser && !user) || (!sessionUser && user) ? (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <Loader2 size={50} className='animate-spin' />
    </div>
  ) : (
    children
  );
};
export default SessionSyncWrapper;
