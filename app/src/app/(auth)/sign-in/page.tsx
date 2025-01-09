'use client';
import { SignInForm } from '@/components/auth/sign-in/sign-in.form';
import React from 'react';

export default function SignIn() {
  return (
    <div className='page-container flex flex-col justify-center items-center'>
      <SignInForm />
    </div>
  );
}
